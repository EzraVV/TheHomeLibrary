# Vercel Deployment

Deploy this repository as one Vercel project. Vite builds the React client into `dist`, and the Express API runs as the Node Function in `api/index.ts`.

## Vercel Project

1. Import `EzraVV/TheHomeLibrary`.
2. Use this project root.
3. Select the `Vite` framework preset.
4. Set build settings:
   - Build Command: `npm run build:client`
   - Output Directory: `dist`
   - Install Command: default `npm install`

Do not use `npm run build` as the Vercel build command. That command also writes `dist/server.js`, while Vercel should build the client output and bundle the API function separately.

## Environment Variables

Add these variables for both Production and Preview:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `DATABASE_URL`
- `GOOGLE_BOOKS_API_KEY`

Use the Supabase Transaction Pooler connection string for `DATABASE_URL`, not the direct database connection. The transaction pooler uses port `6543` and is better suited to Vercel's serverless function instances.

Add these only if the support form should send email:

- `SUPPORT_EMAIL`
- `SUPPORT_EMAIL_PASSWORD`

## Supabase Auth URLs

In Supabase Auth URL Configuration:

1. Set Site URL to the final production Vercel domain.
2. Add `https://<production-domain>/auth/confirm`.
3. Add `https://*-<your-vercel-team-or-account-slug>.vercel.app/**` for previews.
4. Keep the local redirect URL, such as `http://localhost:5173/**`.

After the production URL is known, update the Supabase Site URL and exact production redirect URL if the domain changed.

## Deploy Flow

1. Deploy a Vercel Preview from `feat/deploy`.
2. Run the preview smoke tests.
3. Merge or promote to production after the preview passes.

## Local Pre-Deploy Checks

Run:

```sh
npm run typecheck
npm test -- --run
npm run lint
npm run build:client
```

Optional Vercel-local check:

```sh
npx vercel dev
```

Verify:

- `/`
- `/books/search?query=dune`
- `/api/v1/books`

## Preview Smoke Tests

- Load the home page and direct deep links such as `/books/search`.
- Verify `/api/v1/books` returns JSON, not `index.html`.
- Sign up with email and confirm the redirect lands on `/auth/confirm`.
- Log in and call an authenticated flow such as creating a borrow request.
- Check Vercel Function logs for database, auth, or environment variable errors.
