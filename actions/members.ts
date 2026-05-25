"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  updateUser,
  getUser,
  getMockMembers,
  deleteUser,
  getUserExpenseCount,
  createUser,
} from "@/lib/db";
import { getCurrentUserId } from "@/lib/mockAuth";
import { uid } from "@/helper";
import { MAX_MOCK_MEMBERS } from "@/constants";

const MemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  avatarBg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid colour"),
  avatarFg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid colour"),
});

export async function addMemberAction(
  currentUserId: string,
  formData: FormData
) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    avatarBg: formData.get("avatarBg"),
    avatarFg: formData.get("avatarFg"),
  };

  const parsed = MemberSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const existing = await getMockMembers(currentUserId);
  if (existing.length >= MAX_MOCK_MEMBERS) {
    return { error: `You can have a maximum of ${MAX_MOCK_MEMBERS} members.` };
  }

  const email = parsed.data.email?.trim() || null;
  if (email) {
    const emailTaken = existing.some(
      (m) => m.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      return { error: "That email is already used by another member." };
    }
  }

  const initials = parsed.data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  await createUser({
    id: `mock-${uid()}`,
    email: email ?? `mock-${uid()}@placeholder.splito`,
    name: parsed.data.name,
    avatarInitials: initials,
    avatarBg: parsed.data.avatarBg,
    avatarFg: parsed.data.avatarFg,
    ownerId: currentUserId,
    onboardingComplete: true,
  });

  revalidatePath("/members");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateMemberAction(
  currentUserId: string,
  memberId: string,
  formData: FormData
) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    avatarBg: formData.get("avatarBg"),
    avatarFg: formData.get("avatarFg"),
  };

  const parsed = MemberSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const ownedMembers = await getMockMembers(currentUserId);
  const member = ownedMembers.find((m) => m.id === memberId);
  if (!member) {
    return { error: "Member not found." };
  }

  const email = parsed.data.email?.trim() || null;
  if (email) {
    const emailTaken = ownedMembers.some(
      (m) => m.email.toLowerCase() === email.toLowerCase() && m.id !== memberId
    );
    if (emailTaken) {
      return { error: "That email is already used by another member." };
    }
  }

  const initials = parsed.data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  await updateUser(memberId, {
    name: parsed.data.name,
    email: email ?? member.email,
    avatarBg: parsed.data.avatarBg,
    avatarFg: parsed.data.avatarFg,
    avatarInitials: initials,
  });

  revalidatePath("/members");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteMemberAction(userId: string) {
  const currentUserId = await getCurrentUserId();

  const target = await getUser(userId, currentUserId);
  if (!target || target.ownerId !== currentUserId) {
    return { error: "Member not found." };
  }

  const expenseCount = await getUserExpenseCount(userId);
  if (expenseCount > 0) {
    return {
      error: `${target.name} has expense history and cannot be removed. Settle all balances involving them first.`,
    };
  }

  try {
    await deleteUser(userId);
  } catch {
    return { error: "Failed to delete member." };
  }

  revalidatePath("/members");
  revalidatePath("/dashboard");
  return { success: true };
}
