export const formatCurrency = (amount: number, currency: string = "VND") => {
    if (isNaN(amount)) return "0 VND"; 
  
    return amount.toLocaleString("vi-VN") + ` ${currency}`;
  };
  