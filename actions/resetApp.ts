"use server";

import { writeDb } from "@/lib/db";
import { RESET_CONFIRMATION_WORD } from "./constants";

export async function resetAppAction(formData: FormData) {
  const confirmation = ((formData.get("confirmation") as string) ?? "").trim();

  if (confirmation !== RESET_CONFIRMATION_WORD) {
    return {
      error: `Type ${RESET_CONFIRMATION_WORD} in capital letters to confirm.`,
    };
  }

  await writeDb({
    users: [
      {
        id: "user-1",
        email: "user1@example.com",
        name: "User One",
        avatarInitials: "U1",
        avatarBg: "#CCFCE7",
        avatarFg: "#065F46",
        isSeeded: true,
      },
      {
        id: "user-2",
        email: "sarah@example.com",
        name: "Sarah Adeyemi",
        avatarInitials: "SA",
        avatarBg: "#EDE9FE",
        avatarFg: "#5B21B6",
        isSeeded: true,
      },
      {
        id: "user-3",
        email: "marcus@example.com",
        name: "Marcus King",
        avatarInitials: "MK",
        avatarBg: "#FEF3C7",
        avatarFg: "#92400E",
        isSeeded: true,
      },
      {
        id: "user-4",
        email: "james@example.com",
        name: "James Thornton",
        avatarInitials: "JT",
        avatarBg: "#FFE4E6",
        avatarFg: "#9F1239",
        isSeeded: true,
      },
      {
        id: "user-5",
        email: "rosa@example.com",
        name: "Rosa Lima",
        avatarInitials: "RL",
        avatarBg: "#FCE7F3",
        avatarFg: "#9D174D",
        isSeeded: true,
      },
    ],
    groups: [],
    expenses: [],
    settlements: [],
  });

  return { success: true };
}
