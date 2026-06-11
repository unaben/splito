# Splito app

Live: https://splito-sigma.vercel.app

A shared expense tracker. Add expenses, see who owes what, and settle up — without the awkward money conversations after a group trip.

---

## What it does

You create a group for any shared situation (a holiday, a flat, regular dinners). Whenever someone pays for the group, you log the expense and choose how to split it. Splito tracks everything and tells each person exactly what to pay and to whom — using the minimum number of transfers possible.

---

## Tech stack

- **Next.js 16** — App Router, Server Actions, API routes
- **TypeScript** — strict mode throughout
- **Supabase** — Postgres database
- **NextAuth v4** — credentials-based auth with bcrypt
- **Zod** — form and action validation
- **Jest** — unit tests for the balance calculation logic
- **Cypress** — end-to-end tests

---

## Getting started

**Prerequisites:** Node.js 18+, a Supabase project

**1. Clone and install**

```bash
git clone https://github.com/yourname/splito.git
cd splito
npm install
```

**2. Set up environment variables**

```bash
cp .env.local.example .env.local
```

Fill in your values:

```
NEXTAUTH_SECRET=        # generate with: openssl rand -base64 32
NEXTAUTH_URL=           # http://localhost:3000 for local dev
SUPABASE_URL=           # your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=  # from Supabase → Settings → API
NEXT_PUBLIC_APP_URL=    # http://localhost:3000 for local dev
```

**3. Set up the database**

Run these SQL files in order in your Supabase SQL editor:

```
supabase/migrations/001_schema.sql
supabase/migrations/002_multi_user.sql
supabase/migrations/003_rls.sql
supabase/migrations/004_drop_is_seeded.sql
```

**4. Run it**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register an account.

---

## How it works

When you register you'll go through a short onboarding screen that explains the app and lets you add placeholder members to split with. You can rename these any time from the Members page, or add new ones there.

From there:
1. Create a group
2. Add expenses — pick who paid and how to split
3. Check the Balances tab to see who owes what
4. Hit Settle up to record payments

Each user's data is completely isolated. If two people register on the same deployment, they each have their own groups, expenses and members — nothing is shared.

---

## Project structure

```
src/
  app/          pages and API routes
  actions/      server actions (form submissions)
  components/   UI components
  lib/          auth config, Supabase client, db queries
  utils/        finance calculations (pure functions)
  types/        TypeScript types
supabase/
  migrations/   SQL files to set up the database
```

The financial logic lives in `utils/finance.ts` — `calculateBalances` and `simplifyDebts` are pure functions with no side effects, which is why they're easy to test and reason about.

---

## Running tests

```bash
# Unit tests
npm test

# E2E tests (requires the app to be running)
npm run cy:open
```

---

## Deployment

The app is designed to deploy to Vercel. Push to your repo, connect it in the Vercel dashboard, and add the same environment variables from your `.env.local`.

Make sure `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` point to your production domain, not localhost.

---

## Notes

- Passwords are hashed with bcrypt before being stored — plain text passwords are never saved
- API routes are protected with a JWT check — unauthenticated requests get a 401
- Row Level Security is enabled on all Supabase tables as an additional layer of protection
- The balance algorithm reduces payments to the mathematical minimum — N people need at most N-1 transfers to settle up completely