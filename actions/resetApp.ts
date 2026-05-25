"use server";

import { supabase } from "@/lib/supabase";
import { getUserByEmail } from "@/lib/db";
import { RESET_CONFIRMATION_WORD } from "./constants";

export async function resetAppAction(formData: FormData) {
  const confirmation = ((formData.get("confirmation") as string) ?? "").trim();
  const email = ((formData.get("resetEmail") as string) ?? "").trim();

  if (confirmation !== RESET_CONFIRMATION_WORD) {
    return {
      error: `Type ${RESET_CONFIRMATION_WORD} in capital letters to confirm.`,
    };
  }

  const user = await getUserByEmail(email);

  if (!user || user.ownerId !== null) {
    return { error: "No account found with that email address." };
  }

  const currentUserId = user.id;

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", currentUserId);

  const groupIds = (memberships ?? []).map((m) => m.group_id);

  if (groupIds.length > 0) {
    await supabase.from("settlements").delete().in("group_id", groupIds);
    const { data: expenses } = await supabase
      .from("expenses")
      .select("id")
      .in("group_id", groupIds);
    if (expenses && expenses.length > 0) {
      await supabase
        .from("expense_splits")
        .delete()
        .in(
          "expense_id",
          expenses.map((e) => e.id)
        );
    }
    await supabase.from("expenses").delete().in("group_id", groupIds);
    await supabase.from("group_members").delete().in("group_id", groupIds);
    await supabase.from("groups").delete().in("id", groupIds);
  }

  await supabase.from("users").delete().eq("owner_id", currentUserId);
  await supabase.from("users").delete().eq("id", currentUserId);

  return { success: true };
}
