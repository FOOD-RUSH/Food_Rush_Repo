import { apiClient } from '@/src/services/shared/apiClient';
import { 
  AnalyticsSummaryResponse, 
  RevenueBucketsResponse, 
  AnalyticsPeriod, 
  AnalyticsDateRange,
  RestaurantBalanceResponse 
} from '@/src/types/analytics';

// New types for updated API responses
export interface RestaurantAnalyticsSummary {
  revenueCollected: number;
  gmv: number;
  aov: number;
  counts: {
    total: number;
    pending: number;
    confirmed: number;
    outForDelivery: number;
    completed: number;
    cancelled: number;
  };
  paymentMethod: {
    mobile_money: number;
    cash_on_delivery: number;
  };
  operator: {
    mtn: number;
    orange: number;
  };
  acceptanceRate: number;
}

export interface RestaurantBalance {
  balance: number;
  credits: number;
  debits: number;
  currency: string;
}

export interface RevenueBucket {
  day: string; // ISO date-time
  revenue: number;
  count: number;
}

export type RestaurantBalanceResponse = {
  data: RestaurantBalance;
  success: boolean;
  message?: string;
};

export type RestaurantAnalyticsSummaryResponse = {
  data: RestaurantAnalyticsSummary;
  success: boolean;
  message?: string;
};

export type RestaurantRevenueBucketsResponse = {
  data: RevenueBucket[];
  success: boolean;
  message?: string;
};

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
  getBalance: (): Promise<RestaurantBalanceResponse> => {
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