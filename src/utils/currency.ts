export const getCurrencySymbol = (currencyCode: string = "INR"): string => {
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
  return symbols[currencyCode] || "₹";
};

export const formatCurrency = (amount: number, currencyCode: string = "INR"): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
};