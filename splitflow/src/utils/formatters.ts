export const formatAmount = (n: number) => 
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
