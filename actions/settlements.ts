"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/mockAuth";
import { penceFromPounds } from "@/utils/balance/balance";
import { uid, now } from "@/helper";
import { createSettlement, updateSettlementStatus } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { baseUrl } from "@/services/baseUrl";

const SettleUpSchema = z.object({
  groupId: z.string().min(1),
  payeeId: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
  paymentType: z.enum(["card", "cash"]),
});

export async function settleUpAction(formData: FormData) {
  const payerId = await getCurrentUserId();

  const raw = {
    groupId: formData.get("groupId"),
    payeeId: formData.get("payeeId"),
    amount: formData.get("amount"),
    paymentType: formData.get("paymentType"),
  };

  const parsed = SettleUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const amountPence = penceFromPounds(parsed.data.amount);

  if (parsed.data.paymentType === "cash") {
    await createSettlement({
      id: `settle-${uid()}`,
      createdAt: now(),
      groupId: parsed.data.groupId,
      payerId,
      payeeId: parsed.data.payeeId,
      amountPence,
      status: "completed",
      settledAt: now(),
    });

    revalidatePath(`/groups/${parsed.data.groupId}`);
    revalidatePath("/dashboard");
    return { success: true, type: "cash" };
  }

  const settlement = await createSettlement({
    id: `settle-${uid()}`,
    groupId: parsed.data.groupId,
    payerId,
    payeeId: parsed.data.payeeId,
    amountPence,
    status: "pending",
    createdAt: now(),
  });

  if (!baseUrl) {
    await updateSettlementStatus(settlement.id, "failed");
    return { error: "App URL is not configured." };
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: amountPence,
            product_data: {
              name: "Splito — settle up",
              description: `Payment of £${parsed.data.amount}`,
            },
          },
        },
      ],
      metadata: {
        settlementId: settlement.id,
        groupId: parsed.data.groupId,
        payerId,
        payeeId: parsed.data.payeeId,
      },
      success_url: `${baseUrl()}/settle/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/settle/cancel?group_id=${
        parsed.data.groupId
      }&settlement_id=${settlement.id}`,
    });
  } catch (err) {
    console.error("[settleUpAction] Stripe session creation failed:", err);
    await updateSettlementStatus(settlement.id, "failed");
    return { error: "Could not create payment session. Please try again." };
  }

  if (!session.url) {
    await updateSettlementStatus(settlement.id, "failed");
    return { error: "Payment session had no URL. Please try again." };
  }

  return {
    success: true,
    type: "card",
    checkoutUrl: session.url,
    settlementId: settlement.id,
  };
}
