import { Expense, Settlement, Balance } from "@/types";
type BalanceRecord = Record<string, number>;

export function calculateBalances(
  expenses: Expense[],
  settlements: Settlement[],
  memberIds: string[]
): Balance[] {
  const initialState: BalanceRecord = Object.fromEntries(
    memberIds.map((id) => [id, 0])
  );

  // Process each expense ─────────────────────────────────────────
  const afterExpenses = expenses.reduce<BalanceRecord>((balances, expense) => {
    // 1. Identify who hasn't paid yet
    const filteredUnsettledSplits = expense.splits.filter((s) => !s.isSettled);

    // 2. Calculate what the payer is owed by others
    const totalToCreditPayer = filteredUnsettledSplits
      .filter((s) => s.userId !== expense.paidBy)
      .reduce((sum, s) => sum + s.amountPence, 0);

    const balancesWithPayerCredited =
      expense.paidBy in balances && totalToCreditPayer > 0
        ? {
            ...balances,
            [expense.paidBy]: balances[expense.paidBy] + totalToCreditPayer,
          }
        : balances;

    // 3. Subtract shares from the people who owe
    const finalBalancesForThisExpense = filteredUnsettledSplits
      .filter((s) => s.userId !== expense.paidBy)
      .reduce<BalanceRecord>((acc, split) => {
        if (!(split.userId in acc)) return acc;
        return {
          ...acc,
          [split.userId]: acc[split.userId] - split.amountPence,
        };
      }, balancesWithPayerCredited);
    return finalBalancesForThisExpense;
  }, initialState);

  // ── Step 3: Apply completed settlements ──────────────────────────────────
  const afterSettlements = settlements
    .filter((s) => s.status === "completed")
    .reduce<BalanceRecord>((balances, settlement) => {
      const payerBalance = balances[settlement.payerId];
      const payeeBalance = balances[settlement.payeeId];

      const newBalances = {
        ...balances,
        ...(payerBalance !== undefined
          ? { [settlement.payerId]: payerBalance + settlement.amountPence }
          : {}),
        ...(payeeBalance !== undefined
          ? { [settlement.payeeId]: payeeBalance - settlement.amountPence }
          : {}),
      };

      return newBalances;
    }, afterExpenses);

  return Object.entries(afterSettlements).map(([userId, amountPence]) => ({
    userId,
    amountPence: Math.round(amountPence),
  }));
}
