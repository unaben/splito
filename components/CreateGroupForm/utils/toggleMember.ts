import { Dispatch, SetStateAction } from "react";

export function toggleMember(
  userId: string,
  setSelectedMembers: Dispatch<SetStateAction<string[]>>
) {
  setSelectedMembers((prev) =>
    prev.includes(userId)
      ? prev.filter((id) => id !== userId)
      : [...prev, userId]
  );
}
