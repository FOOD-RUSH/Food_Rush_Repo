import { apiClient } from '@/src/services/shared/apiClient';
import {
  AnalyticsSummaryResponse,
  RevenueBucketsResponse,
  AnalyticsPeriod,
  AnalyticsDateRange,
  RestaurantBalanceApiResponse,
} from '@/src/types/analytics';

export const analyticsApi = {
  /**
   * Get restaurant analytics summary using Africa/Douala timezone
   * @param params - Date range parameters (ISO date-time)
   * @returns Analytics summary data
   */
  getSummary: async (
    params?: AnalyticsDateRange,
  ): Promise<AnalyticsSummaryResponse> => {
    try {
      const response = await apiClient.get(
        '/analytics/restaurants/my/summary',
        {
          params: {
            from: params?.from,
            to: params?.to,
          },
        },
      );
      return response;
    } catch (error: any) {
      console.error('Analytics Summary API Error:', error);
      // Return empty data structure if API fails
      return {
        status_code: 200,
        message: 'No data available',
        data: {
          revenueCollected: 0,
          gmv: 0,
          aov: 0,
          counts: {
            total: 0,
            pending: 0,
            confirmed: 0,
            outForDelivery: 0,
            completed: 0,
            cancelled: 0,
          },
          paymentMethod: {
            mobile_money: 0,
            cash_on_delivery: 0,
          },
          operator: {
            mtn: 0,
            orange: 0,
          },
          acceptanceRate: 0,
        },
      };
    }
  },

  /**
   * Get restaurant balance (ledger credits - debits) in XAF
   * @returns Restaurant balance data
   */
  getBalance: async (): Promise<RestaurantBalanceApiResponse> => {
    try {
      const response = await apiClient.get('/analytics/restaurants/my/balance');
      return response;
    } catch (error: any) {
      console.error('Restaurant Balance API Error:', error);
      // Return empty balance data if API fails
      return {
        data: {
          balance: 0,
          credits: 0,
          debits: 0,
          currency: 'XAF',
        },
        success: true,
        message: 'No balance data available',
      };
    }
  },

  /**
   * Get restaurant revenue buckets (daily/weekly/monthly) using Africa/Douala timezone
   * @param period - Time period for bucketing (daily | weekly | monthly)
   * @param params - Date range and pagination parameters
   * @returns Revenue bucket data
   */
  getRevenueBuckets: async (
    period: AnalyticsPeriod = 'daily',
    params?: AnalyticsDateRange & { page?: number },
  ): Promise<RevenueBucketsResponse> => {
    try {
      const response = await apiClient.get(
        '/analytics/restaurants/my/revenue/bucketed',
        {
          params: {
            period,
            from: params?.from,
            to: params?.to,
            page: params?.page || 1,
          },
        },
      );
      return response;
    } catch (error: any) {
      console.error('Revenue Buckets API Error:', error);
      // Return empty revenue data if API fails
      return {
        status_code: 200,
        message: 'No revenue data available',
        data: [],
      };
    }
  },
};
