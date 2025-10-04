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
 * Safe number formatter that handles undefined/null values
 */
const safeNumber = (value?: number | null): number => {
  return value === null || value === undefined || isNaN(value) ? 0 : value;
};

/**
 * Format currency value for display with loading state handling
 */
export const formatCurrency = (
  value?: number | null,
  currency = 'XAF',
  isLoading = false,
): string => {
  if (isLoading) return '---';
  const safeValue = safeNumber(value);

  try {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeValue);
  } catch (error) {
    return `${safeValue.toLocaleString()} ${currency}`;
  }
};

/**
 * Format large numbers with K/M suffixes with loading state handling
 */
export const formatLargeNumber = (
  value?: number | null,
  isLoading = false,
): string => {
  if (isLoading) return '---';
  const safeValue = safeNumber(value);

  if (safeValue >= 1000000) {
    return `${(safeValue / 1000000).toFixed(1)}M`;
  }
  if (safeValue >= 1000) {
    return `${(safeValue / 1000).toFixed(1)}K`;
  }
  return safeValue.toString();
};

/**
 * Calculate percentage change between two values with null handling
 */
export const calculatePercentageChange = (
  current?: number | null,
  previous?: number | null,
): number => {
  const currentSafe = safeNumber(current);
  const previousSafe = safeNumber(previous);

  if (previousSafe === 0) return currentSafe > 0 ? 100 : 0;
  return ((currentSafe - previousSafe) / previousSafe) * 100;
};

/**
 * Format percentage change for display with loading state handling
 */
export const formatPercentageChange = (
  change?: number | null,
  isLoading = false,
): string => {
  if (isLoading) return '---';
  const safeChange = safeNumber(change);
  const sign = safeChange >= 0 ? '+' : '';
  return `${sign}${safeChange.toFixed(1)}%`;
};

/**
 * Get change type based on percentage change
 */
export const getChangeType = (
  change?: number | null,
): 'positive' | 'negative' | 'neutral' => {
  const safeChange = safeNumber(change);
  if (safeChange > 0) return 'positive';
  if (safeChange < 0) return 'negative';
  return 'neutral';
};

/**
 * Format percentage value with proper handling of undefined/null
 */
export const formatPercentage = (
  value?: number | null,
  isLoading = false,
  decimals = 1,
): string => {
  if (isLoading) return '---';
  const safeValue = safeNumber(value);
  return `${safeValue.toFixed(decimals)}%`;
};

/**
 * Convert analytics summary to metric cards data with loading states
 */
export const convertToMetricCards = (
  data?: AnalyticsSummaryResponse['data'] | null,
  previousData?: AnalyticsSummaryResponse['data'] | null,
  isLoading = false,
): MetricCardData[] => {
  const cards: MetricCardData[] = [];

  // Revenue card
  const revenueChange =
    data && previousData
      ? calculatePercentageChange(
          data.revenueCollected,
          previousData.revenueCollected,
        )
      : 0;

  cards.push({
    title: 'Revenue',
    value: isLoading ? '---' : formatLargeNumber(data?.revenueCollected),
    change:
      data && previousData && !isLoading
        ? formatPercentageChange(revenueChange)
        : undefined,
    changeType: data && previousData ? getChangeType(revenueChange) : 'neutral',
    icon: 'cash',
    color: '#007aff',
    subtitle: 'XAF',
  });

  // Total orders card
  const ordersChange =
    data && previousData
      ? calculatePercentageChange(
          data.counts?.total,
          previousData.counts?.total,
        )
      : 0;

  cards.push({
    title: 'Total Orders',
    value: isLoading ? '---' : data?.counts?.total?.toString() || '0',
    change:
      data && previousData && !isLoading
        ? formatPercentageChange(ordersChange)
        : undefined,
    changeType: data && previousData ? getChangeType(ordersChange) : 'neutral',
    icon: 'receipt',
    color: '#00D084',
    subtitle: 'orders',
  });

  // Average Order Value card
  const aovChange =
    data && previousData
      ? calculatePercentageChange(data.aov, previousData.aov)
      : 0;

  cards.push({
    title: 'Avg Order Value',
    value: isLoading ? '---' : formatLargeNumber(data?.aov),
    change:
      data && previousData && !isLoading
        ? formatPercentageChange(aovChange)
        : undefined,
    changeType: data && previousData ? getChangeType(aovChange) : 'neutral',
    icon: 'calculator',
    color: '#FF9500',
    subtitle: 'XAF',
  });

  // Acceptance Rate card
  const acceptanceChange =
    data && previousData
      ? calculatePercentageChange(
          data.acceptanceRate,
          previousData.acceptanceRate,
        )
      : 0;

  cards.push({
    title: 'Acceptance Rate',
    value: isLoading ? '---' : formatPercentage(data?.acceptanceRate),
    change:
      data && previousData && !isLoading
        ? formatPercentageChange(acceptanceChange)
        : undefined,
    changeType:
      data && previousData ? getChangeType(acceptanceChange) : 'neutral',
    icon: 'check-circle',
    color: '#8B5CF6',
    subtitle: 'of orders',
  });

  return cards;
};

/**
 * Convert revenue bucket data to chart data points with loading handling
 */
export const convertToChartData = (
  buckets?: RevenueBucketData[] | null,
  color = '#007aff',
  isLoading = false,
): ChartDataPoint[] => {
  if (isLoading) {
    // Return placeholder data for loading state
    return Array.from({ length: 7 }, (_, index) => ({
      label: `Day ${index + 1}`,
      value: 0,
      color: `${color}40`,
      date: new Date().toISOString(),
    }));
  }

  if (!buckets || buckets.length === 0) {
    return [];
  }

  return buckets.map((bucket, index) => ({
    label: formatDateLabel(bucket.day),
    value: safeNumber(bucket.revenue),
    color: index % 2 === 0 ? color : `${color}80`,
    date: bucket.day,
  }));
};

/**
 * Format date for chart labels based on the date string
 */
export const formatDateLabel = (dateString?: string): string => {
  if (!dateString) return 'N/A';

  try {
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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    // Otherwise show month/year
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Get order status breakdown with colors and safe handling
 */
export const getOrderStatusBreakdown = (
  counts?: OrderStatusBreakdown | null,
  isLoading = false,
) => {
  if (isLoading) {
    return [
      {
        status: 'Loading...',
        count: 0,
        percentage: 0,
        color: '#E0E0E0',
      },
    ];
  }

  if (!counts) {
    return [
      {
        status: 'No Data',
        count: 0,
        percentage: 0,
        color: '#E0E0E0',
      },
    ];
  }

  const total = Object.values(counts).reduce(
    (sum, count) => sum + safeNumber(count),
    0,
  );

  const breakdown = [
    {
      status: 'Completed',
      count: safeNumber(counts.completed),
      percentage: total > 0 ? (safeNumber(counts.completed) / total) * 100 : 0,
      color: '#00D084',
    },
    {
      status: 'Out for Delivery',
      count: safeNumber(counts.outForDelivery),
      percentage:
        total > 0 ? (safeNumber(counts.outForDelivery) / total) * 100 : 0,
      color: '#007aff',
    },
    {
      status: 'Confirmed',
      count: safeNumber(counts.confirmed),
      percentage: total > 0 ? (safeNumber(counts.confirmed) / total) * 100 : 0,
      color: '#FF9500',
    },
    {
      status: 'Pending',
      count: safeNumber(counts.pending),
      percentage: total > 0 ? (safeNumber(counts.pending) / total) * 100 : 0,
      color: '#8B5CF6',
    },
    {
      status: 'Cancelled',
      count: safeNumber(counts.cancelled),
      percentage: total > 0 ? (safeNumber(counts.cancelled) / total) * 100 : 0,
      color: '#FF3B30',
    },
  ];

  // Filter out zero counts, but if all are zero, show "No orders"
  const filteredBreakdown = breakdown.filter((item) => item.count > 0);

  return filteredBreakdown.length > 0
    ? filteredBreakdown
    : [
        {
          status: 'No Orders',
          count: 0,
          percentage: 0,
          color: '#E0E0E0',
        },
      ];
};

/**
 * Get payment method breakdown with colors and safe handling
 */
export const getPaymentMethodBreakdown = (
  paymentMethods?: PaymentMethodBreakdown | null,
  isLoading = false,
) => {
  if (isLoading) {
    return [
      {
        method: 'Loading...',
        count: 0,
        percentage: 0,
        color: '#E0E0E0',
      },
    ];
  }

  if (!paymentMethods) {
    return [
      {
        method: 'No Data',
        count: 0,
        percentage: 0,
        color: '#E0E0E0',
      },
    ];
  }

  const total =
    safeNumber(paymentMethods.mobile_money) +
    safeNumber(paymentMethods.cash_on_delivery);

  const breakdown = [
    {
      method: 'Mobile Money',
      count: safeNumber(paymentMethods.mobile_money),
      percentage:
        total > 0 ? (safeNumber(paymentMethods.mobile_money) / total) * 100 : 0,
      color: '#FF9500',
    },
    {
      method: 'Cash on Delivery',
      count: safeNumber(paymentMethods.cash_on_delivery),
      percentage:
        total > 0
          ? (safeNumber(paymentMethods.cash_on_delivery) / total) * 100
          : 0,
      color: '#00D084',
    },
  ];

  const filteredBreakdown = breakdown.filter((item) => item.count > 0);

  return filteredBreakdown.length > 0
    ? filteredBreakdown
    : [
        {
          method: 'No Payments',
          count: 0,
          percentage: 0,
          color: '#E0E0E0',
        },
      ];
};

/**
 * Get operator breakdown with colors and safe handling
 */
export const getOperatorBreakdown = (
  operators?: OperatorBreakdown | null,
  isLoading = false,
) => {
  if (isLoading) {
    return [
      {
        operator: 'Loading...',
        count: 0,
        percentage: 0,
        color: '#E0E0E0',
      },
    ];
  }

  if (!operators) {
    return [
      {
        operator: 'No Data',
        count: 0,
        percentage: 0,
        color: '#E0E0E0',
      },
    ];
  }

  const total = safeNumber(operators.mtn) + safeNumber(operators.orange);

  const breakdown = [
    {
      operator: 'MTN',
      count: safeNumber(operators.mtn),
      percentage: total > 0 ? (safeNumber(operators.mtn) / total) * 100 : 0,
      color: '#FFD93D',
    },
    {
      operator: 'Orange',
      count: safeNumber(operators.orange),
      percentage: total > 0 ? (safeNumber(operators.orange) / total) * 100 : 0,
      color: '#FF6B35',
    },
  ];

  const filteredBreakdown = breakdown.filter((item) => item.count > 0);

  return filteredBreakdown.length > 0
    ? filteredBreakdown
    : [
        {
          operator: 'No Data',
          count: 0,
          percentage: 0,
          color: '#E0E0E0',
        },
      ];
};

/**
 * Generate date range for analytics queries (unchanged but with better typing)
 */
export const generateDateRange = (
  period: 'today' | 'yesterday' | '7days' | '30days',
): { from: string; to: string } | undefined => {
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

/**
 * Create loading state metric cards for skeleton UI
 */
export const createLoadingMetricCards = (): MetricCardData[] => {
  return [
    {
      title: 'Revenue',
      value: '---',
      icon: 'cash',
      color: '#007aff',
      subtitle: 'XAF',
    },
    {
      title: 'Total Orders',
      value: '---',
      icon: 'receipt',
      color: '#00D084',
      subtitle: 'orders',
    },
    {
      title: 'Avg Order Value',
      value: '---',
      icon: 'calculator',
      color: '#FF9500',
      subtitle: 'XAF',
    },
    {
      title: 'Acceptance Rate',
      value: '---',
      icon: 'check-circle',
      color: '#8B5CF6',
      subtitle: 'of orders',
    },
  ];
};
