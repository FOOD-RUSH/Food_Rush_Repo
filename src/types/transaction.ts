// Transaction History Types - Updated to match actual Payment API response

// Raw API response from GET /api/v1/payments/transactions/{userId}
export interface PaymentTransactionApiResponse {
  transId: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  medium: string | null; // e.g., "mobile money" or null
  serviceName: string; // e.g., "Glenzzy"
  transType: string; // e.g., "Collection"
  amount: number;
  revenue: number | null; // Revenue after fees
  payerName: string | null;
  email: string;
  redirectUrl: string | null;
  externalId: string; // UUID for the transaction
  userId: string | null;
  webhook: string | null;
  financialTransId: string | null; // Provider's transaction ID (e.g., "783257261")
  dateInitiated: string; // ISO date string
  dateConfirmed: string; // ISO date string
}

// API response wrapper for the transaction list
export interface PaymentTransactionListResponse {
  status_code: number;
  message: string;
  data: PaymentTransactionApiResponse[];
}

// Enhanced transaction interface for app usage
export interface Transaction {
  id: string; // Maps to transId from API
  orderId?: string; // Maps to externalId from API (order UUID)
  amount: number;
  revenue: number | null; // Revenue after fees
  currency: string; // Default to "XAF" for Cameroon
  method: 'mobile_money' | 'unknown';
  provider: 'mtn' | 'orange' | 'unknown'; // Derived from medium or financialTransId
  status: 'pending' | 'completed' | 'failed' | 'cancelled'; // Mapped from API status
  transactionId: string; // Maps to transId from API
  financialTransId: string | null; // Provider's transaction ID
  phoneNumber?: string; // May not be available from payment API
  payerName: string | null; // From API
  email: string; // From API
  description: string; // Generated description
  serviceName: string; // From API (e.g., "Glenzzy")
  transType: string; // From API (e.g., "Collection")
  externalId: string; // UUID from API
  createdAt: string; // Maps to dateInitiated
  updatedAt: string; // Maps to dateConfirmed
  // Order details for display (may need to be fetched separately)
  orderDetails?: {
    restaurantName: string;
    itemCount: number;
    items: string[];
  };
}

export interface TransactionHistoryResponse {
  status_code: number;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface PaymentProvider {
  id: 'mtn' | 'orange';
  name: string;
  displayName: string;
  icon: any;
  color: string;
  description: string;
}

export interface PaymentMethodSelection {
  method: 'mobile_money';
  provider: 'mtn' | 'orange';
  phoneNumber?: string;
}

// Payment initialization response from API
export interface PaymentInitSuccessResponse {
  status_code: 201; // Resource created successfully
  message: 'Resource created successfully';
  data: {
    message: 'Accepted';
    transId: string; // e.g., "E1HWnnNj"
    dateInitiated: string; // ISO date string e.g., "2025-10-09T20:04:37.508Z"
  };
}

// Generic payment initialization response
export interface PaymentInitResponse {
  status_code: number;
  message: string;
  data: {
    message: string;
    transId: string;
    dateInitiated: string;
    status?: 'PENDING';
    amount?: number;
    ussdCode?: string;
  };
}

// Transaction status type for filtering
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Transaction provider type
export type TransactionProvider = 'mtn' | 'orange' | 'unknown';