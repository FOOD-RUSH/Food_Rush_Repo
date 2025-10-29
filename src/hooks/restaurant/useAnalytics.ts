import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { analyticsApi } from '@/src/services/restaurant/analyticsApi';
import { AnalyticsPeriod, AnalyticsDateRange } from '@/src/types/analytics';
import { queryClient } from '@/src/services/shared/queryClient';

/**
 * Hook to fetch restaurant analytics summary - WebSocket-first with HTTP fallback
 */
export const useAnalyticsSummary = (dateRange?: AnalyticsDateRange) => {
  const wsConnectedRef = useRef(false);

  const query = useQuery({
    queryKey: ['analytics', 'summary', dateRange],
    queryFn: () => analyticsApi.getSummary(dateRange),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // WebSocket real-time updates
  useEffect(() => {
    let mounted = true;

    const setupWebSocket = async () => {
      try {
        const { socketService } = await import('@/src/services/shared/socket');

        if (!mounted) return;

        await socketService.connect();

        if (!socketService.isConnected()) {
          console.log(
            '[Analytics] WebSocket not available, using HTTP polling',
          );
          return;
        }

        wsConnectedRef.current = true;

        const handleSummaryUpdate = (payload: any) => {
          if (!mounted || !payload?.data) return;

          queryClient.setQueryData(
            ['analytics', 'summary', dateRange],
            payload,
          );
        };

        socketService.on('analytics:summary', handleSummaryUpdate);

        return () => {
          socketService.off('analytics:summary', handleSummaryUpdate);
        };
      } catch (error) {
        console.log('[Analytics] WebSocket setup failed, using HTTP only');
      }
    };

    setupWebSocket();

    return () => {
      mounted = false;
    };
  }, [dateRange]);

  return query;
};

/**
 * Hook to fetch restaurant balance - WebSocket-first with HTTP fallback
 */
export const useRestaurantBalance = () => {
  const wsConnectedRef = useRef(false);

  const query = useQuery({
    queryKey: ['analytics', 'balance'],
    queryFn: () => analyticsApi.getBalance(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // WebSocket real-time updates
  useEffect(() => {
    let mounted = true;

    const setupWebSocket = async () => {
      try {
        const { socketService } = await import('@/src/services/shared/socket');

        if (!mounted) return;

        await socketService.connect();

        if (!socketService.isConnected()) return;

        wsConnectedRef.current = true;

        const handleBalanceUpdate = (payload: any) => {
          if (!mounted || !payload?.data) return;

          queryClient.setQueryData(['analytics', 'balance'], payload);
        };

        socketService.on('analytics:balance', handleBalanceUpdate);

        return () => {
          socketService.off('analytics:balance', handleBalanceUpdate);
        };
      } catch (error) {
        console.log('[Balance] WebSocket setup failed, using HTTP only');
      }
    };

    setupWebSocket();

    return () => {
      mounted = false;
    };
  }, []);

  return query;
};

/**
 * Hook to fetch restaurant revenue buckets - WebSocket-first with HTTP fallback
 */
export const useRevenueBuckets = (
  period: AnalyticsPeriod = 'daily',
  dateRange?: AnalyticsDateRange & { page?: number },
) => {
  const wsConnectedRef = useRef(false);

  const query = useQuery({
    queryKey: ['analytics', 'revenue-buckets', period, dateRange],
    queryFn: () => analyticsApi.getRevenueBuckets(period, dateRange),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!period,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // WebSocket real-time updates
  useEffect(() => {
    let mounted = true;

    const setupWebSocket = async () => {
      try {
        const { socketService } = await import('@/src/services/shared/socket');

        if (!mounted) return;

        await socketService.connect();

        if (!socketService.isConnected()) return;

        wsConnectedRef.current = true;

        const handleRevenueUpdate = (payload: any) => {
          if (!mounted || !Array.isArray(payload?.data)) return;

          queryClient.setQueryData(
            ['analytics', 'revenue-buckets', period, dateRange],
            payload,
          );
        };

        socketService.on('analytics:revenue', handleRevenueUpdate);

        return () => {
          socketService.off('analytics:revenue', handleRevenueUpdate);
        };
      } catch (error) {
        console.log('[Revenue] WebSocket setup failed, using HTTP only');
      }
    };

    setupWebSocket();

    return () => {
      mounted = false;
    };
  }, [period, dateRange]);

  return query;
};

/**
 * Generate date range for analytics queries
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
