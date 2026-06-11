"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/mockAuth";
import { processMockPayment } from "@/lib/mockStripe";
import { penceFromPounds } from "@/utils/balance/balance";
import { uid, now } from "@/helper";
import { createSettlement, updateSettlementStatus } from "@/lib/db";

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

  // Card payment — run through mock Stripe
  const settlement = await createSettlement({
    id: `settle-${uid()}`,
    createdAt: now(),
    groupId: parsed.data.groupId,
    payerId,
    payeeId: parsed.data.payeeId,
    amountPence,
    status: "pending",
  });

  const result = await processMockPayment(amountPence);

  if (!result.success) {
    await updateSettlementStatus(settlement.id, "failed");
    return { error: result.error ?? "Payment failed. Please try again." };
  }

  await updateSettlementStatus(settlement.id, "completed");

  revalidatePath(`/groups/${parsed.data.groupId}`);
  revalidatePath("/dashboard");
  return { success: true, type: "card", paymentId: result.paymentId };
}
