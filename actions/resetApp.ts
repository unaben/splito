"use server";

import { supabase } from "@/lib/supabase";
import { RESET_CONFIRMATION_WORD } from "./constants";
import { insertSeedData } from "@/lib";

export async function resetAppAction(formData: FormData) {
  const confirmation = ((formData.get("confirmation") as string) ?? "").trim();

  if (confirmation !== RESET_CONFIRMATION_WORD) {
    return {
      error: `Type ${RESET_CONFIRMATION_WORD} in capital letters to confirm.`,
    };
  }

  // Delete all user data in dependency order
  // (cascade handles most of it but settlements reference users directly)
  await supabase.from("settlements").delete().neq("id", "");
  await supabase.from("expense_splits").delete().neq("expense_id", "");
  await supabase.from("expenses").delete().neq("id", "");
  await supabase.from("group_members").delete().neq("group_id", "");
  await supabase.from("groups").delete().neq("id", "");

  // Reset user-1 back to seed state — keep mock members as-is
  await supabase
    .from("users")
    .update({
      name: "User One",
      email: "user1@example.com",
      avatar_initials: "U1",
      is_seeded: true,
      password_hash: null,
    })
    .eq("id", "user-1");

   // Re-populate with fresh seed data
  await insertSeedData()

  return { success: true };
}
