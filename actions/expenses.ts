"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { penceFromPounds } from "@/utils/balance";
import { getGroup, createExpense, deleteExpense, uid, now } from "@/lib/db";
import type { Expense } from "@/types";

const AddExpenseSchema = z.object({
  groupId: z.string().min(1),
  paidBy: z.string().min(1),
  description: z.string().min(1, "Description is required").max(100),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
  splitType: z.enum(["equal", "custom", "percent"]),
  category: z.enum([
    "food",
    "transport",
    "accommodation",
    "activities",
    "shopping",
    "utilities",
    "other",
  ]),
});

export async function addExpenseAction(formData: FormData) {
  const raw = {
    groupId: formData.get("groupId"),
    paidBy: formData.get("paidBy"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    splitType: formData.get("splitType"),
    category: formData.get("category"),
  };

  const parsed = AddExpenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const group = await getGroup(parsed.data.groupId);
  if (!group) return { error: "Group not found" };

  const amountPence = penceFromPounds(parsed.data.amount);
  const memberCount = group.memberIds.length;
  const sharePerMember = Math.round(amountPence / memberCount);

  // Equal split — last member absorbs any rounding remainder
  const splits: Expense["splits"] = group.memberIds.map((userId, idx) => {
    const isLast = idx === memberCount - 1;
    return {
      userId,
      amountPence: isLast
        ? amountPence - sharePerMember * (memberCount - 1)
        : sharePerMember,
      isSettled: userId === parsed.data.paidBy,
    };
  });

  await createExpense({
    id: `settle-${uid()}`,
    groupId: parsed.data.groupId,
    paidBy: parsed.data.paidBy,
    description: parsed.data.description,
    amountPence,
    splitType: parsed.data.splitType,
    category: parsed.data.category,
    splits,
    createdAt: now(),
  });

  revalidatePath(`/groups/${parsed.data.groupId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteExpenseAction(id: string, groupId: string) {
  await deleteExpense(id);
  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
