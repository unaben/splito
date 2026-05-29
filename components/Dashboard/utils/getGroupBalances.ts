/**
 * Aggregate totals from the resolved balance array
 */

export const getGroupBalances = (groupBalances: number[]) => {
  return groupBalances.reduce(
    (acc, balance) => ({
      totalOwed: balance > 0 ? acc.totalOwed + balance : acc.totalOwed,
      totalOwing:
        balance < 0 ? acc.totalOwing + Math.abs(balance) : acc.totalOwing,
    }),
    { totalOwed: 0, totalOwing: 0 }
  );
};
