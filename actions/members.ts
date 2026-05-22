"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateUser, getAllUsers } from "@/lib/db";
import { getCurrentUserId } from "@/lib/mockAuth";

const UpdateMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email address"),
  avatarBg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid colour"),
  avatarFg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid colour"),
});

export async function updateMemberAction(userId: string, formData: FormData) {
  const currentUserId = await getCurrentUserId();

  if (userId === currentUserId || userId === "user-1") {
    return { error: "Your own profile cannot be edited here." };
  }

  const validMockIds = ["user-2", "user-3", "user-4", "user-5"];
  if (!validMockIds.includes(userId)) {
    return { error: "Member not found." };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    avatarBg: formData.get("avatarBg"),
    avatarFg: formData.get("avatarFg"),
  };

  const parsed = UpdateMemberSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const allUsers = await getAllUsers();
  const emailTaken = allUsers.some(
    (u) =>
      u.email.toLowerCase() === parsed.data.email.toLowerCase() &&
      u.id !== userId
  );
  if (emailTaken) {
    return { error: "That email is already used by another member." };
  }

  const avatarInitials = parsed.data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  await updateUser(userId, {
    name: parsed.data.name,
    email: parsed.data.email,
    avatarBg: parsed.data.avatarBg,
    avatarFg: parsed.data.avatarFg,
    avatarInitials,
  });

  revalidatePath("/members");
  revalidatePath("/dashboard");

  return { success: true };
}
