import { apiClient } from '@/src/services/shared/apiClient';
import { 
  AnalyticsSummaryResponse, 
  RevenueBucketsResponse, 
  AnalyticsPeriod, 
  AnalyticsDateRange,
  RestaurantBalanceResponse,
  RestaurantBalanceApiResponse
} from '@/src/types/analytics';

export const analyticsApi = {
  /**
   * Get restaurant analytics summary using Africa/Douala timezone
   * @param params - Date range parameters (ISO date-time)
   * @returns Analytics summary data
   */
  getSummary: (params?: AnalyticsDateRange): Promise<AnalyticsSummaryResponse> => {
    return apiClient.get('/api/v1/analytics/restaurants/my/summary', {
      params: {
        from: params?.from,
        to: params?.to,
      },
    });
  },

  /**
   * Get restaurant balance (ledger credits - debits) in XAF
   * @returns Restaurant balance data
   */
  getBalance: (): Promise<RestaurantBalanceApiResponse> => {
    return apiClient.get('/api/v1/analytics/restaurants/my/balance');
  },

  /**
   * Get restaurant revenue buckets (daily/weekly/monthly) using Africa/Douala timezone
   * @param period - Time period for bucketing (daily | weekly | monthly)
   * @param params - Date range and pagination parameters
   * @returns Revenue bucket data
   */
  getRevenueBuckets: (
    period: AnalyticsPeriod = 'daily',
    params?: AnalyticsDateRange & { page?: number }
  ): Promise<RevenueBucketsResponse> => {
    return apiClient.get('/api/v1/analytics/restaurants/my/revenue/bucketed', {
      params: {
        period,
        from: params?.from,
        to: params?.to,
        page: params?.page || 1,
      },
    });
  },
};