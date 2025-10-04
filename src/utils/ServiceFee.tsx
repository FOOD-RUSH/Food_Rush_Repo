const calculateServiceFee = (orderValue: number): number => {
  let feePercentage: number;
  let baseFee: number;
  
  const SMALL_ORDER_THRESHOLD = 2000;
  const MEDIUM_ORDER_THRESHOLD = 5000;
  const LARGE_ORDER_THRESHOLD = 10000;
  
  if (orderValue < SMALL_ORDER_THRESHOLD) {
    feePercentage = 0.08; // 8% (reduced from 12%)
    baseFee = 150; // 150 CFA (reduced from 300)
  } else if (orderValue < MEDIUM_ORDER_THRESHOLD) {
    feePercentage = 0.07; // 7% (reduced from 10%)
    baseFee = 150; // 150 CFA (reduced from 250)
  } else if (orderValue < LARGE_ORDER_THRESHOLD) {
    feePercentage = 0.06; // 6% (reduced from 8%)
    baseFee = 100; // 100 CFA (reduced from 200)
  } else {
    feePercentage = 0.05; // 5% (reduced from 6%)
    baseFee = 100; // 100 CFA (reduced from 150)
  }
  
  return Math.round((orderValue * feePercentage) + baseFee);
};

// Reduced delivery fee

export { calculateServiceFee };