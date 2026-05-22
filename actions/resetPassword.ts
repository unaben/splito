"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUser, updateUser } from "@/lib/db";

const ResetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPasswordAction(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = ResetPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const userOne = await getUser("user-1");

  if (!userOne || userOne.isSeeded) {
    return { error: "No account found. Please register first." };
  }

  if (userOne.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return { error: "No account found with that email address." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await updateUser("user-1", { passwordHash });

  return { success: true };
}
