import type { Expense, Settlement, Balance } from "@/types";

type BalanceRecord = Record<string, number>;

/**
 * Calculate the net balance for every member in a group.
 *
 * Positive value  → this person is owed money by others
 * Negative value  → this person owes money to others
 * Zero            → fully settled up
 */
export function calculateBalances(
  expenses: Expense[],
  settlements: Settlement[],
  memberIds: string[]
): Balance[] {
  const initial: BalanceRecord = Object.fromEntries(
    memberIds.map((id) => [id, 0])
  );

  const afterExpenses = expenses.reduce<BalanceRecord>((acc, expense) => {
    const unsettledSplits = expense.splits.filter((s) => !s.isSettled);
    const othersUnsettledShare = unsettledSplits
      .filter((s) => s.userId !== expense.paidBy)
      .reduce((sum, s) => sum + s.amountPence, 0);

    const accWithPayer =
      expense.paidBy in acc && othersUnsettledShare > 0
        ? {
            ...acc,
            [expense.paidBy]: acc[expense.paidBy] + othersUnsettledShare,
          }
        : acc;

    return unsettledSplits
      .filter((s) => s.userId !== expense.paidBy)
      .reduce<BalanceRecord>((inner, split) => {
        if (!(split.userId in inner)) return inner;
        return {
          ...inner,
          [split.userId]: inner[split.userId] - split.amountPence,
        };
      }, accWithPayer);
  }, initial);

  const afterSettlements = settlements
    .filter((s) => s.status === "completed")
    .reduce<BalanceRecord>((acc, s) => {
      const payerBal = acc[s.payerId];
      const payeeBal = acc[s.payeeId];
      return {
        ...acc,
        ...(payerBal !== undefined
          ? { [s.payerId]: payerBal + s.amountPence }
          : {}),
        ...(payeeBal !== undefined
          ? { [s.payeeId]: payeeBal - s.amountPence }
          : {}),
      };
    }, afterExpenses);

  return Object.entries(afterSettlements).map(([userId, amountPence]) => ({
    userId,
    amountPence: Math.round(amountPence),
  }));
}
