// Analytics API Response Types

export interface AnalyticsSummaryResponse {
  status_code: number;
  message: string;
  data: {
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
  };
}

export interface RevenueBucketData {
  day: string; // ISO date-time
  revenue: number;
  count: number;
}

export interface RevenueBucketsResponse {
  status_code: number;
  message: string;
  data: RevenueBucketData[];
}

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';

export interface AnalyticsDateRange {
  from?: string; // ISO date-time
  to?: string; // ISO date-time
}

// UI-specific types for analytics components
export interface MetricCardData {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
  subtitle?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  date?: string;
}

export interface OrderStatusBreakdown {
  pending: number;
  confirmed: number;
  outForDelivery: number;
  completed: number;
  cancelled: number;
}

export interface PaymentMethodBreakdown {
  mobile_money: number;
  cash_on_delivery: number;
}

export interface OperatorBreakdown {
  mtn: number;
  orange: number;
}

// Restaurant Balance Types
export interface RestaurantBalance {
  balance: number;
  credits: number;
  debits: number;
  currency: string;
}

export interface RestaurantBalanceResponse {
  status_code: number;
  message: string;
  data: RestaurantBalance;
}

// Updated API Response Types for new endpoints
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

export interface RevenueBucket {
  day: string; // ISO date-time
  revenue: number;
  count: number;
}

// Standardized response types
export interface StandardApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type RestaurantAnalyticsSummaryResponse = StandardApiResponse<RestaurantAnalyticsSummary>;
export type RestaurantRevenueBucketsResponse = StandardApiResponse<RevenueBucket[]>;
export type RestaurantBalanceApiResponse = StandardApiResponse<RestaurantBalance>;