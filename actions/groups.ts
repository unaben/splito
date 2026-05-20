"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createGroup, updateGroup, deleteGroup } from "../services/store";
import { getCurrentUserId } from "@/lib/mockAuth";

const CreateGroupSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(200).optional(),
  emoji: z.string().min(1),
  memberIds: z.array(z.string()).min(1),
});

export async function createGroupAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    emoji: formData.get("emoji"),
    memberIds: formData.getAll("memberIds"),
  };

  const parsed = CreateGroupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const group = await createGroup({
    ...parsed.data,
    createdBy: userId,
    memberIds: Array.from(new Set([userId, ...parsed.data.memberIds])),
  });

  revalidatePath("/dashboard");
  redirect(`/groups/${group.id}`);
}

export async function updateGroupAction(id: string, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    emoji: formData.get("emoji"),
    memberIds: formData.getAll("memberIds") as string[],
  };

  const parsed = CreateGroupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await updateGroup(id, parsed.data);
  revalidatePath(`/groups/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteGroupAction(id: string) {
  await deleteGroup(id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
