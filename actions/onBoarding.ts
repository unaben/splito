"use server";

import { z } from "zod";
import { createUser, updateUser } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AVATAR_COLORS } from "@/components/EditMemberForm/constants";
import { uid } from "@/helper";
import { DEFAULT_NAMES } from "./constants";

const OnboardingSchema = z.object({
  addMembers: z.enum(["example", "custom", "skip"]),
  member1: z.string().max(50).optional(),
  member2: z.string().max(50).optional(),
  member3: z.string().max(50).optional(),
  member4: z.string().max(50).optional(),
});

export async function completeOnboardingAction(
  currentUserId: string,
  formData: FormData
) {
  const raw = {
    addMembers: formData.get("addMembers"),
    member1: formData.get("member1") ?? undefined,
    member2: formData.get("member2") ?? undefined,
    member3: formData.get("member3") ?? undefined,
    member4: formData.get("member4") ?? undefined,
  };

  const parsed = OnboardingSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { addMembers } = parsed.data;

  if (addMembers !== "skip") {
    const names =
      addMembers === "example"
        ? DEFAULT_NAMES
        : [
            parsed.data.member1?.trim() || DEFAULT_NAMES[0],
            parsed.data.member2?.trim() || DEFAULT_NAMES[1],
            parsed.data.member3?.trim() || DEFAULT_NAMES[2],
            parsed.data.member4?.trim() || DEFAULT_NAMES[3],
          ];

    await Promise.all(
      names.map(async (name, i) => {
        const initials = name
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return createUser({
          id: `mock-${uid()}`,
          email: `mock-${uid()}@placeholder.splito`,
          name,
          avatarInitials: initials,
          avatarBg: AVATAR_COLORS[i].bg,
          avatarFg: AVATAR_COLORS[i].fg,
          ownerId: currentUserId,
          onboardingComplete: true,
        });
      })
    );
  }

  await updateUser(currentUserId, { onboardingComplete: true });
  revalidatePath("/dashboard");
  return { success: true };
}
