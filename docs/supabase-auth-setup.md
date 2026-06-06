# Supabase Auth And Database Setup

The application uses Supabase Auth for sessions and Supabase Postgres for
application data. Express remains the application-data authorization boundary.

## Project Configuration

1. Copy `.env.example` to `.env`.
2. Add the project URL and publishable key to both the `VITE_` and server
   variables.
3. Add the direct Postgres connection string as `DATABASE_URL`.
4. Never expose a database password or secret/service-role key through a
   `VITE_` variable.

In Supabase Authentication settings:

- Enable Email authentication.
- Keep email confirmation enabled.
- Set the local site URL to `http://localhost:5173`.
- Add `http://localhost:5173/auth/confirm` as a redirect URL.
- Add the production Vercel confirmation URL before deployment.

## Apply The Database Schema

Open the Supabase SQL Editor, paste the contents of
`supabase/migrations/20260605000000_initial_schema.sql`, and run it once.

Then paste `supabase/seed.sql` into a new SQL Editor query and run it once if
you want the demo profile and book.

The migration creates `profiles` and links it to `auth.users` through
`profiles.auth_user_id`. Existing application-facing IDs such as `u_00001`
remain in use for books and loans.

## Verify Authentication

1. Run `npm run dev`.
2. Sign up at `/signup`.
3. Confirm the email using the received link.
4. Log in and verify `/profile`, `/books/add`, and `/books/dashboard`.
5. Log out and confirm those routes return to `/signup`.

Public catalogue, search, book details, About, and Support pages remain
available without a session.
