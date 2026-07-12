# Splito

Live: https://splito-sigma.vercel.app

A shared expense tracker. Add expenses, see who owes what, and settle up — without the awkward money conversations after a group trip.

---

## What it does

You create a group for any shared situation — a holiday, a flat share, regular dinners. Whenever someone pays for the group, log the expense and split it. Splito tracks everything and tells each person exactly who to pay back and how much, based on who actually paid for them.

Settlements can be recorded as cash or paid directly through the app using Stripe.

---

## Tech stack

- **Next.js 16** — App Router, Server Actions, API routes
- **TypeScript** — strict mode throughout
- **Supabase** — Postgres database with Row Level Security
- **NextAuth v4** — credentials-based auth with bcrypt
- **Stripe** — card payments via Checkout, webhook for settlement confirmation
- **Zod** — form and action validation
- **Jest** — unit tests for the balance calculation logic
- **Cypress** — end-to-end tests

---

## Getting started

**Prerequisites:** Node.js 18+, a Supabase project, a Stripe account

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
NEXTAUTH_SECRET=                      # generate with: openssl rand -base64 32
NEXTAUTH_URL=                         # http://localhost:3000 for local dev
SUPABASE_URL=                         # your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=            # from Supabase → Settings → API
NEXT_PUBLIC_APP_URL=                  # http://localhost:3000 for local dev
STRIPE_SECRET_KEY=                    # from Stripe dashboard → Developers → API keys
STRIPE_WEBHOOK_SECRET=                # see Stripe setup below
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**3. Set up the database**

Run these SQL files in order in your Supabase SQL editor:

```
supabase/migrations/001_schema.sql
supabase/migrations/002_multi_user.sql
supabase/migrations/003_rls.sql
supabase/migrations/004_drop_is_seeded.sql
```

**4. Set up Stripe webhooks (local dev)**

Install the Stripe CLI, then run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret it prints and add it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`. Keep this terminal running while you test payments.

**5. Run it**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register an account.

---

## How it works

When you register you go through a short onboarding screen that explains the app and lets you add placeholder members to split with. You can rename them any time from the Members page, or add new ones there.

From there:
1. Create a group and add members
2. Log expenses — pick who paid and split equally or by custom amounts
3. Check the Balances tab to see who owes what
4. Hit Settle up — pay by cash (recorded instantly) or card (goes through Stripe)

Each user's data is completely isolated. Two people on the same deployment each have their own groups, expenses and members — nothing is shared between accounts.

---

## Payments

Card payments go through Stripe Checkout — you're redirected to a Stripe-hosted page so the app never handles raw card numbers.

When payment completes, Stripe sends a webhook to `/api/webhooks/stripe`. The webhook verifies the Stripe signature and marks the settlement as completed in the database. This happens server-to-server, so closing the browser tab after paying doesn't break anything.

For local testing use Stripe's test card `4242 4242 4242 4242` with any future expiry and any CVC. See `STRIPE_SETUP.md` for the full setup guide and go-live checklist.

---

## Project structure

```
src/
  app/          pages and API routes
  actions/      server actions (form submissions)
  components/   UI components
  lib/          auth, Supabase client, Stripe client, db queries
  utils/        finance calculations (pure functions)
  types/        TypeScript types
supabase/
  migrations/   SQL files to set up the database
```

The financial logic lives in `utils/finance.ts`. `calculateBalances` gives each person's net position. `calculateDirectDebts` works out who pays who — based on who actually paid for each expense, not a mathematical optimisation that can route payments through the wrong person.

---

## Running tests

```bash
# Unit tests
npm test

# E2E tests (app must be running)
npm run cy:open
```

---

## Deployment

Push to your repo, connect it in the Vercel dashboard, and add the environment variables. For the Stripe webhook, create an endpoint in the Stripe dashboard pointing at `https://your-domain.vercel.app/api/webhooks/stripe` and add the signing secret as `STRIPE_WEBHOOK_SECRET`.

Make sure `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` point to your production domain, not localhost.

---

## Notes

- Passwords are hashed with bcrypt — plain text is never stored
- API routes require a valid JWT — unauthenticated requests get a 401
- Stripe webhooks are authenticated by signature verification, not JWT
- Row Level Security on all Supabase tables means users can only read their own data, even if they hit the database directly