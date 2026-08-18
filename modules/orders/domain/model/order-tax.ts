export const TAX_RATE = 0.15;

export const calculateOrderTotals = (subTotal: number) => {
  const tax = Math.round(subTotal * TAX_RATE);
  return {
    subTotal,
    tax,
    total: subTotal + tax,
  };
};