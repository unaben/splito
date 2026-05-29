import { getUsersByIds } from "@/lib/db";
import type { Group } from "@/types";

/**
 *
 * @param groups
 * @param currentUserId
 * Fetch member users for every group in one parallel pass
 */

export const getMembersById = async (
  groups: Array<Group>,
  currentUserId: string
) => {
  const allMemberIds = Array.from(new Set(groups.flatMap((g) => g.memberIds)));
  const allMembers = await getUsersByIds(allMemberIds, currentUserId);
  return Object.fromEntries(allMembers.map((u) => [u.id, u]));
};
