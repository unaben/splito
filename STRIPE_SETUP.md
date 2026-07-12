# Stripe Setup

How to get card payments working in Splito.

---

## 1. Create a Stripe account

Go to [stripe.com](https://stripe.com) and sign up if you haven't already.
Stay in **test mode** (the toggle in the top right) until you're ready to go live.

---

## 2. Get your API keys

In the Stripe dashboard go to **Developers → API keys**.

Copy:
- **Publishable key** — starts with `pk_test_`
- **Secret key** — starts with `sk_test_`

Add them to `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 3. Install the Stripe package

```bash
npm install stripe
```

---

## 4. Set up the webhook for local development

Stripe needs to call your app when a payment completes. In local dev
your machine isn't publicly accessible, so you use the Stripe CLI to
forward events to localhost.

**Install the Stripe CLI:**

```bash
# Mac
brew install stripe/stripe-cli/stripe

# Other platforms: https://stripe.com/docs/stripe-cli
```

**Log in:**

```bash
stripe login
```

**Start forwarding:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will print a webhook signing secret like `whsec_...`.
Copy that and add it to `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

Keep this terminal running while you test — it forwards all Stripe
events to your local server.

---

## 5. Set up the webhook for production (Vercel)

In the Stripe dashboard go to **Developers → Webhooks → Add endpoint**.

- **Endpoint URL:** `https://your-app.vercel.app/api/webhooks/stripe`
- **Events to listen to:**
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `payment_intent.payment_failed`

After creating the endpoint, click **Reveal** under **Signing secret**
and copy the `whsec_...` value.

Add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`.

---

## 6. Test a payment

Start the app:

```bash
npm run dev
```

In another terminal, keep the Stripe CLI running:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

In the app:
1. Create a group with members
2. Add an expense
3. Go to the group → Balances → Settle up
4. Choose **Card**
5. You'll be redirected to Stripe Checkout

Use these Stripe test card numbers:

| Card number          | Result              |
|----------------------|---------------------|
| `4242 4242 4242 4242` | Payment succeeds   |
| `4000 0000 0000 9995` | Card declined      |
| `4000 0025 0000 3155` | Requires 3D Secure |

Use any future expiry date and any 3-digit CVC.

After paying with the `4242` card you should be redirected to
`/settle/success` and the settlement in the group should update
to **completed**.

---

## 7. Go live

When you're ready to accept real payments:

1. In the Stripe dashboard toggle from **Test mode** to **Live mode**
2. Get your live API keys (they start with `sk_live_` and `pk_live_`)
3. Create a new webhook endpoint pointing at your production URL
4. Update your Vercel environment variables with the live keys
5. Redeploy

---

## How it works

```
User clicks "Pay with card"
     │
     ▼
settleUpAction creates a Settlement (status: pending)
then creates a Stripe Checkout Session with:
  - the amount in pence
  - metadata: { settlementId, groupId }
  - success_url: /settle/success
  - cancel_url:  /settle/cancel
     │
     ▼
User redirected to Stripe-hosted payment page
     │
     ├── Pays → Stripe sends webhook: checkout.session.completed
     │           → settlement marked completed
     │           → user redirected to /settle/success
     │
     └── Cancels → user redirected to /settle/cancel
                   → settlement marked failed
```

The webhook is the source of truth. The redirect page (`/settle/success`)
is just a confirmation screen — it doesn't update the database itself.
This matters because a user could close the browser tab after paying
and never hit the success page. The webhook still fires regardless.