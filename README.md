# The Home Library

A community-focused person-to-person book lending platform designed to unlock the biggest libraries in the world: the ones hidden inside our homes. The app helps readers discover books, share titles they own, keep track of active loans, and support local borrowing between users.

This is a group project developed by **Jen**, **Eden**, **Brannan**, and **Ezra**.

---

## Project Status

The Home Library is a working full-stack lending application with book discovery, personal library management, user profiles, borrowing workflows, authenticated access, and a production-oriented deployment setup. It supports the full core journey of discovering a book, requesting it, managing loans, and maintaining a personal catalogue.

### Key Achievements:

- **Consistent Design System:** Tailored warm, trustworthy color scheme (`primary`, `secondary`, `accent`, `background`, `surface`), Merriweather headings, Inter body text, and customized card elevations.
- **Book Discovery Catalog:** Built the main discovery experience (`HomePage.tsx`) with dynamic catalogue data, search/discovery flows, custom loading states, empty states, and functional book detail interactions.
- **Layout & Dynamic Routing:** Configured standard layouts (`Navbar`, `Footer`) utilizing React Router client-side path linking, complete with active navigation state highlights.
- **My Books Management:** Implemented a complete personal library workflow including owned-book listing, Google Books-powered search/add flow, and book edit/update support.
- **Borrowing Workflow:** Delivered end-to-end loan functionality so users can request books and manage active loans through pending, accepted, denied, and returned states.
- **Profile View:** Developed the `UserProfilePage.tsx` along with responsive profile cards showing bio info, reading interests badges, and owned book lists.
- **Authentication:** Supabase Auth provides confirmed email/password signup, login, logout, and persisted sessions.
- **Database:** Supabase Postgres stores application data while Express verifies authenticated requests and enforces ownership.
- **Book Metadata:** Express enriches stored catalogue records from the keyed Google Books API while preserving local ownership, condition, status, and lending terms.
- **Accessibility:** Applied a frontend-wide accessibility pass covering landmarks, keyboard support, focus management, screen reader naming, contrast fixes, live regions, and dialog behavior to bring the client in line with a WCAG AA baseline.
- **Deployment Readiness:** Prepared the application for deployment with updated server/runtime configuration and environment-aware backend wiring.

---

## Codebase Architecture & Structure

This codebase is organized into logical layers, separating frontend concerns, backend server layers, shared utilities, and data modeling:

### 1. Frontend Client (`client/`)

- **Pages (`client/components/pages/`):** React route-level page components:
  - `HomePage.tsx`: Main discovery view displaying browsable library catalogue books.
  - `UserProfilePage.tsx`: User profile details displaying user details, interests, and books owned.
  - `AddUserPage.tsx`: Form page handles user registration/sign-up.
  - `MyBooksPage.tsx`: Personal library management view for listing and adding owned books.
  - `AboutPage.tsx` and `SupportPage.tsx`: Supporting informational and feedback pages.
- **Components (`client/components/`):** Reusable layout, book, and user cards:
  - `BookCard.tsx`: Individual book rendering displaying cover, metadata, availability, and book detail triggers.
  - `layout/`: Shared `Navbar.tsx` and `Footer.tsx` with dynamic page state highlights.
  - `book/`: `AddBook.tsx`, `BookForm.tsx`, `BookDashboard.tsx`, `BorrowedList.tsx`, `LentList.tsx`, `BookDetailModal.tsx`, and `EditBook.tsx` managing search, loan, modal, and catalogue update flows.
  - `user/`: Header, Bio, Borrowed, and Owned lists representing segmented user profile sections.
- **APIs & State Hooks (`client/apis/` & `client/hooks/`):** Consumes JSON API endpoints:
  - `books.ts`, `loans.ts`, and `users.ts`: Request layers mapping to local Express routers. Express proxies external metadata lookups to the keyed Google Books API.
  - `useBooks.ts`, `useUserBooks.ts`, and `useLoans.ts`: TanStack Query hooks handling catalogue, personal library, and loan state.

### 2. Backend Server (`server/`)

- **Routes (`server/routes/`):** Core API routes under `/api/v1/`:
  - `book.ts`: Exposes endpoints to retrieve discoverable catalog books, fetch details, add new volumes, and update existing book records.
  - `loan.ts`: Handles authenticated loan retrieval, search, creation, and status transitions such as accept, deny, and return.
  - `users.ts`: Enforces user identity retrieval, signup verification, and profile management.
  - `support.ts`: Receives support/contact submissions from the client.
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
- **Testing:** Vitest, React Testing Library, isolated in-memory SQLite database

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

Targeted component tests cover key frontend behaviors including dialog focus
management, navigation/search semantics, accessible form behavior, and library
management interactions.

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
