/*
1. What to Mock vs. What to Test Real
Layer Component Test Strategy Why?
Frontend UI Buttons / State Skip for pipeline testing Belongs in frontend component unit tests (Cypress/RTL).
External Network APIs Mock (msw or nock)  Real APIs rate-limit you, go down, change data, and slow down test suites.
Express Route Handler Test Real (supertest)  Ensures authentication, validation middleware, and HTTP status codes match.
Database Engine Test Real (SQLite In-Memory)  Ensures your Knex syntax, transactions, and unique constraints actually work.


2. Happy test.

Pretend a user hit the backend API. Fire a mock ISBN request, tricks the server into thinking it contacted OpenLibrary, and checks whether the database processed correctly.

Use 'supertest'
Nock intercepts and mocks HTTP requests
Import Express app instance
Import knex db instance

describe('POST /api/books/add', () => {
  // Before testing, migrate your in-memory test database
  beforeEach(async () => {
    await db.migrate.latest();
  });

  // Rollback after each test
  afterEach(async () => {
    await db.migrate.rollback();
    nock.cleanAll(); // Clear network mocks
  });

  it('should take an ISBN, fetch from OpenLibrary, normalise the strings, and save a clean record', async () => {
    const targetIsbn = '9780439139601';

    // 1. Intercept the outbound call to OpenLibrary and return fake dirty data
    nock('https://openlibrary.org')
      .get(`/api/volumes/brief/isbn/${targetIsbn}.json`)
      .reply(200, {
        records: {
          "/books/OL123M": {
            data: {
              title: "HARRY POTTER AND THE GOBLET OF FIRE (PAPERBACK) ", // Dirty text
              authors: [{ name: "Rowling, J.K." }]                     // Dirty text
            }
          }
        }
      });


    // Simulate the frontend hitting your backend route
    const response = await request(app)
      .post('/api/books/ingest')
      .send({ isbn: targetIsbn });

    // ASSERTION LAYER 1: Check the HTTP response shape
    expect(response.status).toBe(201);
    expect(response.body.book).toHaveProperty('book_id');
    expect(response.body.book.work_id).toMatch(/^wrk_/); // Proves your hashing layer activated

    // ASSERTION LAYER 2: Query the real database to see what actually saved
    const savedBook = await db('book').where({ isbn: targetIsbn }).first();
    
    expect(savedBook).toBeDefined();
    expect(savedBook.title).toBe("HARRY POTTER AND THE GOBLET OF FIRE (PAPERBACK) "); // Kept raw original entry
    
    // Proves your shared normalisation helpers cleaned the background search index
    expect(savedBook.search_index).toContain("harry potter and the goblet of fire");
    expect(savedBook.search_index).toContain("jk rowling");
  });
});

3. Edge-Case Integration Tests

Test 1: The API Cascade Fallback
Scenario: OpenLibrary returns a 404 Not Found. Google Books returns a successful object.

What it proves: Your service layer successfully catches the first failure and cascades to the secondary provider without crashing the user's request.

Test 2: The Double-Ingest Prevention (Deduplication)
Scenario: Hit the endpoint with the exact same ISBN twice in a row.

What it proves: The second request returns a 200 OK (Existing) or blocks it, rather than throwing a catastrophic SQLITE_CONSTRAINT: UNIQUE crash because it tried to double-insert the primary key.

Test 3: The Malformed Payload Input
Scenario: Hit the endpoint with an invalid 7-digit ISBN string or a missing body.

What it proves: Your route-level validation layer catches the junk input instantly and rejects it with a 400 Bad Request before wasting time spinning up network connections.

*/