import { getUsersByIds } from "@/lib/db";
import type { RecentActivity } from "@/types";

/**
 *
 * @param currentUserId
 * @param recentActivity
 * Fetch payers for recent activity in one shot
 */

export const getPayersById = async (
  currentUserId: string,
  recentActivity: Array<RecentActivity>
) => {
  const payerIds = Array.from(new Set(recentActivity.map((e) => e.paidBy)));
  const payers = await getUsersByIds(payerIds, currentUserId);
  return Object.fromEntries(payers.map((u) => [u.id, u]));
};
