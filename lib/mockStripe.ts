/**
 * MOCK STRIPE
 * ─────────────────────────────────────────────────────────────
 * Simulates Stripe payment flow with a realistic delay.
 * TODO - SWAP: Replace processMockPayment() with real Stripe
 * PaymentIntent creation and webhook handling.
 * ─────────────────────────────────────────────────────────────
 */

export interface MockPaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

// Simulates Stripe processing delay + occasional failure (10% chance)
export async function processMockPayment(
  amountPence: number
): Promise<MockPaymentResult> {
  await new Promise((res) => setTimeout(res, 1500 + Math.random() * 1000));

  const shouldFail = Math.random() < 0.1;

  if (shouldFail) {
    return {
      success: false,
      error: "Your card was declined. Please try again.",
    };
  }

  return {
    success: true,
    paymentId: `mock_pi_${Math.random().toString(36).slice(2, 14)}`,
  };
}

export function formatPence(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}
