import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateSettlementStatus } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // Payment succeeded — the user paid
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only process sessions where payment was actually collected
        if (session.payment_status !== "paid") break;

        const { settlementId, groupId } = session.metadata ?? {};
        if (!settlementId || !groupId) {
          console.error(
            "checkout.session.completed: missing metadata",
            session.id
          );
          break;
        }

        await updateSettlementStatus(settlementId, "completed");
        revalidatePath(`/groups/${groupId}`);
        revalidatePath("/dashboard");
        break;
      }

      // Session expired without payment (15 min timeout)
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { settlementId, groupId } = session.metadata ?? {};
        if (!settlementId) break;

        await updateSettlementStatus(settlementId, "failed");
        if (groupId) revalidatePath(`/groups/${groupId}`);
        break;
      }

      // Payment intent failed (card declined, insufficient funds, etc.)
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { settlementId, groupId } = paymentIntent.metadata ?? {};
        if (!settlementId) break;

        await updateSettlementStatus(settlementId, "failed");
        if (groupId) revalidatePath(`/groups/${groupId}`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error processing webhook event ${event.type}: ${message}`);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
