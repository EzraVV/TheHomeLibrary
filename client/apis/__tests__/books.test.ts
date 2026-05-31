import app from "../../components/App"
import connection from "../../../server/db/connection"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import request from "supertest"
import nock from 'nock'

vi.mock('superagent', () => {
  const mockResponse = { body: [] }
  const mockQuery = vi.fn().mockReturnThis()
  const mockGet = vi.fn().mockImplementation(() => ({
    query: mockQuery,
    body: mockResponse.body,
    then: vi.fn().mockImplementation((callback) => callback(mockResponse))
  }))

  return {
    default: {
      get: mockGet
    }
  }
})

describe('POST /api/books/ingest', () => {
  const db = connection
  // Migrate test database
  beforeEach(async () => {
    await db.migrate.latest();
  });

  // Rollback after each test
  afterEach(async () => {
    await db.migrate.rollback();
    nock.cleanAll(); // Clear network mocks
  });

  it('should take an ISBN, fetch from OpenLibrary, normalise strings, and save a clean record', async () => {
    const targetIsbn = '9780439139601';

    // Intercept the outbound call to OpenLibrary and return fake dirty data
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


    // Simulate the frontend hitting backend route
    const response = await request(app)
      .post('/api/books/add')
      .send({ isbn: targetIsbn });

    // Check the HTTP response shape
    expect(response.status).toBe(201);
    expect(response.body.book).toHaveProperty('book_id');
    expect(response.body.book.work_id).toMatch(/^wrk_/); // Proves hashing layer activated

    // Query the real database to see what actually saved
    const savedBook = await db('book').where({ isbn: targetIsbn }).first();
    
    expect(savedBook).toBeDefined();
    expect(savedBook.title).toBe("HARRY POTTER AND THE GOBLET OF FIRE (PAPERBACK) "); // Kept raw original entry
    
    // Proves normalisation helpers cleaned the background search index
    expect(savedBook.search_index).toContain("harry potter and the goblet of fire");
    expect(savedBook.search_index).toContain("jk rowling");
  });
});

// Edge-Case Integration Tests
/*
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