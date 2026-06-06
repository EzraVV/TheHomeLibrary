# The Home Library

A calm, community-focused person-to-person book lending system designed to unlock the biggest libraries in the world: the ones hidden inside our homes. This app helps book lovers borrow books they might not have, while sharing books others might want to read, keeping track of who has what book, and facilitating local lending.

This is a group project developed by **Jen**, **Eden**, **Brannan**, and **Ezra**.

---

## Project Status: MVP 2

The project now includes catalogue browsing, profiles, book and loan
management, Supabase email/password authentication, and a Supabase Postgres
database.

### Key Achievements:
- **Consistent Design System:** Tailored warm, trustworthy color scheme (`primary`, `secondary`, `accent`, `background`, `surface`), Merriweather headings, Inter body text, and customized card elevations.
- **Book Discovery Catalog:** Built the cozy main page (`HomePage.tsx`) with dynamic API integration, custom skeleton loading states, empty statuses, and functional `BookCard` triggers.
- **Layout & Dynamic Routing:** Configured standard layouts (`Navbar`, `Footer`) utilizing React Router client-side path linking, complete with active navigation state highlights.
- **Profile View:** Developed the `UserProfilePage.tsx` along with responsive profile cards showing bio info, reading interests badges, and owned book lists.
- **Authentication:** Supabase Auth provides confirmed email/password signup, login, logout, and persisted sessions.
- **Database:** Supabase Postgres stores application data while Express verifies authenticated requests and enforces ownership.
- **Book Metadata:** Express enriches stored catalogue records from the keyed Google Books API while preserving local ownership, condition, status, and lending terms.


---

## Codebase Architecture & Structure

This codebase is organized into logical layers, separating frontend concerns, backend server layers, shared utilities, and data modeling:

### 1. Frontend Client (`client/`)
- **Pages (`client/pages/`):** React route-level page components:
  - `HomePage.tsx`: Cozy main view displaying discoverable library catalog books.
  - `UserProfilePage.tsx`: User profile details displaying user details, interests, and books owned.
  - `AddUserPage.tsx`: Form page handles user registration/sign-up.
- **Components (`client/components/`):** Reusable layout, book, and user cards:
  - `BookCard.tsx`: Individual book rendering displaying cover, metadata, and lender proximity.
  - `layout/`: Sticky `Navbar.tsx` and cozy `Footer.tsx` with dynamic page state highlights.
  - `book/`: `AddBook.tsx` and `BookForm.tsx` managing library ingest and updates.
  - `user/`: Header, Bio, Borrowed, and Owned lists representing segmented user profile sections.
- **APIs & State Hooks (`client/apis/` & `client/hooks/`):** Consumes JSON API endpoints:
  - `books.ts` and `users.ts`: Handles requests mapping to local Express routers. Express proxies all external metadata lookups to the keyed Google Books API.
  - `useBooks.ts` & `useUserBooks.ts`: Dynamic React Query (TanStack Query) custom hooks for responsive query caching and mutation state.

### 2. Backend Server (`server/`)
- **Routes (`server/routes/`):** Core API routes under `/api/v1/`:
  - `book.ts`: Exposes endpoints to retrieve discoverable catalog books, fetch detailed profiles, and add new volumes.
  - `users.ts`: Enforces user identity retrieval, signup verification, and profile management.
  - `server.ts`: Configures Express application middleware, JSON parsing, API routing, and static distribution logic.
- **Database & Query Layer (`server/db/`):** Datastore configuration:
  - `supabase/migrations/`: PostgreSQL schema migrations applied to the linked Supabase project.
  - `book.ts`, `loan.ts`, and `users.ts`: Knex queries using the direct Supabase Postgres connection.
- **Authentication (`server/auth/`):**
  - Verifies Supabase access tokens sent as bearer tokens.
  - Resolves the authenticated Supabase user to the application profile before protected routes run.
- **Utilities (`server/utils/`):** Core server functions:
  - `generateWorkId.ts`: Unique primary keys generation for ingested books.
  - `getDistance.ts`: Calculates geographical distance metrics between user coordinates using the Haversine formula.

### 3. Shared Utilities (`shared/`)
- **Shared Helpers (`shared/utils/`):** Immutable validators and string formatters compiled across both server and client environments:
  - `isbnCheck.ts` & `postcodeCheck.ts`: Sanitizes inputs and validates data integrity constraints.
  - `ageValidator.ts` & `calculateDueDate.ts`: Standardizes business logic boundaries.
  - `interestProcessing.ts` & `formatters.ts`: Formats raw list inputs and parses interest badges.
- **Unit Tests (`shared/__tests__/`):** Comprehensive Vitest suites achieving 100% code coverage.

### 4. Domain Models (`models/`)
- **Domain Contracts (`models/`):** Declares TypeScript contract interfaces (`user.ts`, `book.ts`, `loan.ts`, `reviews.ts`) defining consistent domain data boundaries.

---

## Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons, TanStack Query (React Query)
- **Backend:** Node.js, Express, tsx
- **Authentication:** Supabase Auth
- **Database:** Supabase Postgres, Knex.js
- **Testing:** Vitest, isolated in-memory SQLite database

---

## Building and Running

### 1. Setup & Installation

Clone the repository, navigate into the directory, and install dependencies:

```bash
npm install
```

Copy the environment template:

```bash
cp .env.example .env
```

Add the following values from the Supabase project:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key

DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
```

The URL and publishable key appear twice because Vite only exposes browser
variables prefixed with `VITE_`. Never commit `.env`.

The team uses one shared Supabase project. Ask a project owner for the shared
development values rather than creating or linking a separate Supabase project.

### 2. Database Migrations

PostgreSQL schema changes are stored in `supabase/migrations/` and are applied
to the shared Supabase database by a project owner. `supabase/seed.sql` contains
optional demo data.

### 3. Database And Authentication Flow

1. The React client signs users up and logs them in through Supabase Auth.
2. Supabase stores and refreshes the browser session.
3. Protected client API requests send the Supabase access token as a bearer token.
4. Express verifies the token and resolves it to the matching `profiles` row.
5. Express uses Knex and `DATABASE_URL` to query Supabase Postgres directly.
6. Protected routes derive ownership from the verified profile instead of accepting user IDs from the client.

Supabase Auth UUIDs are stored in `profiles.auth_user_id`. Existing application
IDs such as `u_00001`, `bk_00001`, and `ln_00001` remain the IDs used by the
application tables.

### 4. Development Mode

Start both the client dev server and the backend watch process in parallel:

```bash
npm run dev
```

The app will be accessible locally in your browser.

### 5. Production Build & Execution

To bundle the application and start it in production mode:

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

### 6. Testing

Automated tests use an isolated in-memory SQLite database. They do not modify
the hosted Supabase database.

```bash
npm test -- --run
npm run lint
npm run typecheck
```

For more detailed setup guidance, see `docs/supabase-auth-setup.md`.

---

## Git Workflow Guidelines

To maintain a clean repository history and avoid conflicts, all group members must follow these conventions:

### Branch Naming
All branches must follow this format:
- `type/short-description` (e.g., `feat/user-profile`, `fix/navbar-bug`, `docs/update-readme`)

### Commit Formatting
Commits must be atomic and follow this format:
- `type: what-you-did` (e.g., `feat: add user profile`, `fix: update README`, `test: add auth tests`)

### PR and Review Workflow
- Always write code on your own branch.
- **Never commit directly to `main`**.
- Once a feature is complete, push your branch and open a Pull Request (PR) on GitHub.
- Share the PR link in the team **Discord** channel.
- Another team member must review the code, approve, and merge it into `main`.
