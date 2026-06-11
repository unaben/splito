import { Balance, SimplifiedDebt } from "@/types";

/**
 * Reduce net balances to the minimum number of payments needed
 * to make everyone whole. At most N-1 transactions for N people.
 *
 * Two-pointer greedy algorithm:
 *   1. Partition into creditors (+) and debtors (-)
 *   2. Sort both arrays largest-first
 *   3. Match biggest debtor → biggest creditor
 *   4. Transfer = min(owed, owes); subtract from both
 *   5. Whoever hits zero advances their pointer
 */
export function simplifyDebts(balances: Balance[]): SimplifiedDebt[] {
  const result: SimplifiedDebt[] = [];

  const creditors = balances
    .filter((b) => b.amountPence > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.amountPence - a.amountPence);

  const debtors = balances
    .filter((b) => b.amountPence < 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.amountPence - b.amountPence);

  let creditorPointer = 0;
  let debtorPointer = 0;

  while (creditorPointer < creditors.length && debtorPointer < debtors.length) {
    const creditor = creditors[creditorPointer];
    const debtor = debtors[debtorPointer];

    // Transfer the smaller of what's owed vs what's owing
    // so we never overpay a creditor or over-collect from a debtor
    const amount = Math.min(creditor.amountPence, Math.abs(debtor.amountPence));

    result.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amountPence: amount,
    });

    creditor.amountPence -= amount;
    debtor.amountPence += amount;

    if (debtor.amountPence === 0) debtorPointer++;
    if (creditor.amountPence === 0) creditorPointer++;
  }

  return result;
}
