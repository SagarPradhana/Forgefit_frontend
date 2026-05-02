export const getCurrencySymbol = (currencyCode: string = "USD"): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    AUD: "A$",
    CAD: "C$",
    JPY: "¥",
    CNY: "¥",
  };
  return symbols[currencyCode] || "$";
};

export const formatCurrency = (amount: number, currencyCode: string = "USD"): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
};