"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/db";
import { uid } from "@/helper";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function registerAction(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const existing = await getUserByEmail(parsed.data.email);
  if (existing) {
    return {
      error: "An account with this email already exists. Please log in.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const initials = parsed.data.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userId = `user-${uid()}`;

  await createUser({
    id: userId,
    email: parsed.data.email,
    name: parsed.data.name,
    avatarInitials: initials,
    avatarBg: "#CCFCE7",
    avatarFg: "#065F46",
    ownerId: null,
    onboardingComplete: false,
    passwordHash,
  });

  return { success: true, userId };
}
