import { Group } from "@/types";

/**
 *
 * @param groupBalances
 * @param groups
 * Pair each group with its resolved balance
 */

export const getGroupsWithBalance = (
  groupBalances: number[],
  groups: Group[]
) => {
  return groups.map((group, i) => ({
    group,
    balance: groupBalances[i],
  }));
};
