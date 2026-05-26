# The Home Library

A calm, community-focused person-to-person book lending system designed to unlock the biggest libraries in the world: the ones hidden inside our homes. This app helps book lovers borrow books they might not have, while sharing books others might want to read, keeping track of who has what book, and facilitating local lending.

This is a group project developed by **Jen**, **Eden**, **Brannan**, and **Ezra**.

---

## Project Status: MVP 1 (Styling & Navigation)

We are currently in **MVP 1 (Styling & Navigation Complete)**. The core design tokens, colors, custom typography, reusable catalog elements, and page layouts have been established using **Tailwind CSS**.

### Key Achievements in MVP 1:
- **Consistent Design System:** Tailored warm, trustworthy color scheme (`primary`, `secondary`, `accent`, `background`, `surface`), Merriweather headings, Inter body text, and customized card elevations.
- **Book Discovery Catalog:** Built the cozy main page (`HomePage.tsx`) with dynamic API integration, custom skeleton loading states, empty statuses, and functional `BookCard` triggers.
- **Layout & Dynamic Routing:** Configured standard layouts (`Navbar`, `Footer`) utilizing React Router client-side path linking, complete with active navigation state highlights.
- **Profile View:** Developed the `UserProfilePage.tsx` along with responsive profile cards showing bio info, reading interests badges, and owned book lists.

---

## Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons, TanStack Query (React Query)
- **Backend:** Node.js, Express, tsx
- **Database:** SQLite3, Knex.js (Migrations & Seeds)
- **Testing:** Vitest

---

## Building and Running

### 1. Setup & Installation

Clone the repository, navigate into the directory, and install dependencies:

```bash
npm install
```

### 2. Database Migrations & Seeding

Prepare the local SQLite database by running migrations and seeds:

```bash
# Run database migrations
npm run knex migrate:latest

# Seed the database with books and users
npm run knex seed:run
```

### 3. Development Mode

Start both the client dev server and the backend watch process in parallel:

```bash
npm run dev
```

The app will be accessible locally in your browser.

### 4. Production Build & Execution

To bundle the application and start it in production mode:

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

### 5. Testing

To run the Vitest test suite:

```bash
npm test -- --run
```

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
