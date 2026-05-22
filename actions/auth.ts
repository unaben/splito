"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUser, updateUser } from "@/lib/db";
import { groupsTableIsEmpty, insertSeedData } from "@/lib";

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

  const userOne = await getUser("user-1");

  if (!userOne) {
    return { error: "Setup error: base user not found." };
  }

  if (!userOne.isSeeded) {
    return {
      error: "An account already exists on this device. Please log in.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const initials = parsed.data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  await updateUser("user-1", {
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    avatarInitials: initials,
    passwordHash,
    isSeeded: false,
  });
  
  if (await groupsTableIsEmpty()) {
    await insertSeedData();
  }

  return { success: true };
}
