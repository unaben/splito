import { calculateBalances } from "@/utils/calculateBalances";
import { getExpenses, getSettlements } from "../../../services/store";
import type { Group } from "@/types";

/** Returns the current user's net balance (pence) for a single group. */
export async function getGroupBalance(
  group: Group,
  currentUserId: string
): Promise<number> {
  const [expenses, settlements] = await Promise.all([
    getExpenses(group.id),
    getSettlements(group.id),
  ]);

  const balances = calculateBalances(expenses, settlements, group.memberIds);
  return balances.find((b) => b.userId === currentUserId)?.amountPence ?? 0;
}