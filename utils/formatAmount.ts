export const formatAmount = (amountPence: number) => {
  const amountFormatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountPence / 100);
  return amountFormatted;
};
