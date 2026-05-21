import { getExpenses } from "../../../services/store";
import type { Group } from "@/types";

/**
 * Collect, sort and slice the 5 most recent expenses across all groups.
 * All expense fetches run in parallel.
 */
export async function getRecentActivity(groups: Group[]) {
  const perGroup = await Promise.all(
    groups.map(async (g) => {
      const expenses = await getExpenses(g.id);
      return expenses.map((e) => ({
        ...e,
        groupName: g.name,
        groupEmoji: g.emoji,
      }));
    })
  );

  return perGroup
    .flat()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
}
