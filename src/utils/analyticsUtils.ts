import {
  AnalyticsSummaryResponse,
  RevenueBucketData,
  MetricCardData,
  ChartDataPoint,
  OrderStatusBreakdown,
  PaymentMethodBreakdown,
  OperatorBreakdown,
} from '@/src/types/analytics';

/**
 * Format currency value for display
 */
export const formatCurrency = (value: number, currency = 'XAF'): string => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format large numbers with K/M suffixes
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format percentage change for display
 */
export const formatPercentageChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

/**
 * Get change type based on percentage change
 */
export const getChangeType = (
  change: number,
): 'positive' | 'negative' | 'neutral' => {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
};

/**
 * Convert analytics summary to metric cards data
 */
export const convertToMetricCards = (
  data: AnalyticsSummaryResponse['data'],
  previousData?: AnalyticsSummaryResponse['data'],
): MetricCardData[] => {
  const cards: MetricCardData[] = [];

  // Revenue card
  const revenueChange = previousData
    ? calculatePercentageChange(
        data.revenueCollected,
        previousData.revenueCollected,
      )
    : 0;

  cards.push({
    title: 'Revenue',
    value: formatLargeNumber(data.revenueCollected),
    change: previousData ? formatPercentageChange(revenueChange) : undefined,
    changeType: previousData ? getChangeType(revenueChange) : 'neutral',
    icon: 'cash',
    color: '#007aff',
    subtitle: 'XAF',
  });

  // Total orders card
  const ordersChange = previousData
    ? calculatePercentageChange(data.counts.total, previousData.counts.total)
    : 0;

  cards.push({
    title: 'Total Orders',
    value: data.counts.total.toString(),
    change: previousData ? formatPercentageChange(ordersChange) : undefined,
    changeType: previousData ? getChangeType(ordersChange) : 'neutral',
    icon: 'receipt',
    color: '#00D084',
    subtitle: 'orders',
  });

  // Average Order Value card
  const aovChange = previousData
    ? calculatePercentageChange(data.aov, previousData.aov)
    : 0;

  cards.push({
    title: 'Avg Order Value',
    value: formatLargeNumber(data.aov),
    change: previousData ? formatPercentageChange(aovChange) : undefined,
    changeType: previousData ? getChangeType(aovChange) : 'neutral',
    icon: 'calculator',
    color: '#FF9500',
    subtitle: 'XAF',
  });

  // Acceptance Rate card
  const acceptanceChange = previousData
    ? calculatePercentageChange(
        data.acceptanceRate,
        previousData.acceptanceRate,
      )
    : 0;

  cards.push({
    title: 'Acceptance Rate',
    value: `${data.acceptanceRate.toFixed(1)}%`,
    change: previousData ? formatPercentageChange(acceptanceChange) : undefined,
    changeType: previousData ? getChangeType(acceptanceChange) : 'neutral',
    icon: 'check-circle',
    color: '#8B5CF6',
    subtitle: 'of orders',
  });

  return cards;
};

/**
 * Convert revenue bucket data to chart data points
 */
export const convertToChartData = (
  buckets: RevenueBucketData[],
  color = '#007aff',
): ChartDataPoint[] => {
  return buckets.map((bucket, index) => ({
    label: formatDateLabel(bucket.day),
    value: bucket.revenue,
    color: index % 2 === 0 ? color : `${color}80`, // Alternate opacity
    date: bucket.day,
  }));
};

/**
 * Format date for chart labels based on the date string
 */
export const formatDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If within last 7 days, show day name
  if (diffDays <= 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // If within last 30 days, show month/day
  if (diffDays <= 30) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Otherwise show month/year
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

/**
 * Get order status breakdown with colors
 */
export const getOrderStatusBreakdown = (counts: OrderStatusBreakdown) => {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return [
    {
      status: 'Completed',
      count: counts.completed,
      percentage: total > 0 ? (counts.completed / total) * 100 : 0,
      color: '#00D084',
    },
    {
      status: 'Out for Delivery',
      count: counts.outForDelivery,
      percentage: total > 0 ? (counts.outForDelivery / total) * 100 : 0,
      color: '#007aff',
    },
    {
      status: 'Confirmed',
      count: counts.confirmed,
      percentage: total > 0 ? (counts.confirmed / total) * 100 : 0,
      color: '#FF9500',
    },
    {
      status: 'Pending',
      count: counts.pending,
      percentage: total > 0 ? (counts.pending / total) * 100 : 0,
      color: '#8B5CF6',
    },
    {
      status: 'Cancelled',
      count: counts.cancelled,
      percentage: total > 0 ? (counts.cancelled / total) * 100 : 0,
      color: '#FF3B30',
    },
  ].filter((item) => item.count > 0); // Only show statuses with orders
};

/**
 * Get payment method breakdown with colors
 */
export const getPaymentMethodBreakdown = (
  paymentMethods: PaymentMethodBreakdown,
) => {
  const total = paymentMethods.mobile_money + paymentMethods.cash_on_delivery;

  return [
    {
      method: 'Mobile Money',
      count: paymentMethods.mobile_money,
      percentage: total > 0 ? (paymentMethods.mobile_money / total) * 100 : 0,
      color: '#FF9500',
    },
    {
      method: 'Cash on Delivery',
      count: paymentMethods.cash_on_delivery,
      percentage:
        total > 0 ? (paymentMethods.cash_on_delivery / total) * 100 : 0,
      color: '#00D084',
    },
  ].filter((item) => item.count > 0);
};

/**
 * Get operator breakdown with colors
 */
export const getOperatorBreakdown = (operators: OperatorBreakdown) => {
  const total = operators.mtn + operators.orange;

  return [
    {
      operator: 'MTN',
      count: operators.mtn,
      percentage: total > 0 ? (operators.mtn / total) * 100 : 0,
      color: '#FFD93D',
    },
    {
      operator: 'Orange',
      count: operators.orange,
      percentage: total > 0 ? (operators.orange / total) * 100 : 0,
      color: '#FF6B35',
    },
  ].filter((item) => item.count > 0);
};

/**
 * Generate date range for analytics queries
 */
export const generateDateRange = (
  period: 'today' | 'yesterday' | '7days' | '30days',
) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return {
        from: today.toISOString(),
        to: now.toISOString(),
      };

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);

      return {
        from: yesterday.toISOString(),
        to: endOfYesterday.toISOString(),
      };

    case '7days':
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return {
        from: sevenDaysAgo.toISOString(),
        to: now.toISOString(),
      };

    case '30days':
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return {
        from: thirtyDaysAgo.toISOString(),
        to: now.toISOString(),
      };

    default:
      return undefined;
  }
};
