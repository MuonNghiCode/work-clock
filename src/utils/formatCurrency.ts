export const formatCurrency = (amount: number, currency: string = "VND") => {
  if (isNaN(amount)) return "0 VND";

  return amount.toLocaleString("vi-VN") + ` ${currency}`;
};

export function onNumericInputChange(value: string) {
  const reg = /^-?\d*(\.\d*)?$/;
  if ((!isNaN(Number(value)) && reg.test(value)) || value === "" || value === "-") {
    return value;
  }
  return false;
}