import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/src/services/restaurant/analyticsApi';
import { AnalyticsPeriod, AnalyticsDateRange } from '@/src/types/analytics';

/**
 * Hook to fetch restaurant analytics summary using Africa/Douala timezone
 * @param dateRange - Optional date range for filtering (ISO date-time)
 * @returns Query result with analytics summary data
 */
export const useAnalyticsSummary = (dateRange?: AnalyticsDateRange) => {
  return useQuery({
    queryKey: ['analytics', 'summary', dateRange],
    queryFn: () => analyticsApi.getSummary(dateRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Don't throw errors, handle them gracefully
    throwOnError: false,
  });
};

/**
 * Hook to fetch restaurant balance (ledger credits - debits) in XAF
 * @returns Query result with balance data
 */
export const useRestaurantBalance = () => {
  return useQuery({
    queryKey: ['analytics', 'balance'],
    queryFn: () => analyticsApi.getBalance(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Don't throw errors, handle them gracefully
    throwOnError: false,
  });
};

/**
 * Hook to fetch restaurant revenue buckets using Africa/Douala timezone
 * @param period - Time period for bucketing (daily | weekly | monthly)
 * @param dateRange - Optional date range and pagination parameters
 * @returns Query result with revenue bucket data
 */
export const useRevenueBuckets = (
  period: AnalyticsPeriod = 'daily',
  dateRange?: AnalyticsDateRange & { page?: number },
) => {
  return useQuery({
    queryKey: ['analytics', 'revenue-buckets', period, dateRange],
    queryFn: () => analyticsApi.getRevenueBuckets(period, dateRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!period, // Only run query if period is provided
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Don't throw errors, handle them gracefully
    throwOnError: false,
  });
};

/**
 * Hook to get formatted date range for Africa/Douala timezone
 * @param days - Number of days to go back (default: 30)
 * @returns Date range object with from and to ISO strings
 */
export const useDoualaDateRange = (days: number = 30): AnalyticsDateRange => {
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return {
    from: from.toISOString(),
    to: now.toISOString(),
  };
};

/**
 * Hook to get analytics data with proper error handling and loading states
 * @param period - Analytics period
 * @param dateRange - Date range for filtering
 * @returns Combined analytics data with loading and error states
 */
export const useAnalyticsData = (
  period: AnalyticsPeriod = 'daily',
  dateRange?: AnalyticsDateRange,
) => {
  const summaryQuery = useAnalyticsSummary(dateRange);
  const balanceQuery = useRestaurantBalance();
  const revenueQuery = useRevenueBuckets(period, dateRange);

  // Simplified loading and error states
  const isLoading =
    summaryQuery.isLoading || balanceQuery.isLoading || revenueQuery.isLoading;
  const isFetching =
    summaryQuery.isFetching ||
    balanceQuery.isFetching ||
    revenueQuery.isFetching;

  // Combine errors - if any of the queries has an auth error, treat as auth error
  const authError =
    (summaryQuery.error && (summaryQuery.error as any)?.status === 401) ||
    (balanceQuery.error && (balanceQuery.error as any)?.status === 401) ||
    (revenueQuery.error && (revenueQuery.error as any)?.status === 401);

  // Data error - if all queries failed
  const dataError =
    summaryQuery.isError && balanceQuery.isError && revenueQuery.isError;

  return {
    summary: summaryQuery.data,
    balance: balanceQuery.data,
    revenue: revenueQuery.data,
    isLoading,
    isFetching,
    isError: authError || dataError,
    error: authError
      ? 'Authentication required'
      : dataError
        ? 'Failed to load analytics data'
        : null,
    refetch: async () => {
      const results = await Promise.allSettled([
        summaryQuery.refetch(),
        balanceQuery.refetch(),
        revenueQuery.refetch(),
      ]);
      return results;
    },
  };
};
