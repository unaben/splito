"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { readDb, writeDb } from "@/lib/db";
import { titleCase } from "@/utils/titleCase";
import { findUserOne } from "@/utils";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function registerAction(formData: FormData) {
  const raw = {
    name: formData.get("name") ?? '',
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = RegisterSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const db = await readDb();
  const userOne = findUserOne(db);

 
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

  const idx = db.users.findIndex((u) => u.id === "user-1");
  db.users[idx] = {
    ...db.users[idx],
    name: titleCase(parsed.data.name),
    email: parsed.data.email,
    avatarInitials: initials,
    passwordHash,
    isSeeded: false, 
  };

  await writeDb(db);

  return { success: true };
}
