import { Expense, Settlement, SimplifiedDebt } from "@/types";

export function calculateDirectDebts(
  expenses: Expense[],
  settlements: Settlement[],
  memberIds: string[]
): SimplifiedDebt[] {
  const pairwiseNet: Record<string, Record<string, number>> = {};

  memberIds.forEach((a) => {
    pairwiseNet[a] = {};
    memberIds.forEach((b) => {
      if (a !== b) pairwiseNet[a][b] = 0;
    });
  });

  expenses.forEach((expense) => {
    const { paidBy, splits } = expense;

    splits.forEach((split) => {
      if (split.userId === paidBy) return;
      if (split.isSettled) return;
      if (!(split.userId in pairwiseNet)) return;
      if (!(paidBy in pairwiseNet[split.userId])) return;
      pairwiseNet[split.userId][paidBy] += split.amountPence;
    });
  });

  settlements
    .filter((s) => s.status === "completed")
    .forEach((s) => {
      if (!(s.payerId in pairwiseNet)) return;
      if (!(s.payeeId in pairwiseNet[s.payerId])) return;

      pairwiseNet[s.payerId][s.payeeId] -= s.amountPence;
    });

  const debts: SimplifiedDebt[] = [];
  const processed = new Set<string>();

  memberIds.forEach((a) => {
    memberIds.forEach((b) => {
      if (a >= b) return;
      const pairKey = `${a}|${b}`;
      if (processed.has(pairKey)) return;
      processed.add(pairKey);

      const aOwesB = (pairwiseNet[a]?.[b] ?? 0) - (pairwiseNet[b]?.[a] ?? 0);
      const net = Math.round(aOwesB);

      if (net > 0) {
        debts.push({ fromUserId: a, toUserId: b, amountPence: net });
      } else if (net < 0) {
        debts.push({ fromUserId: b, toUserId: a, amountPence: Math.abs(net) });
      }
    });
  });

  return debts.sort((a, b) => b.amountPence - a.amountPence);
}
