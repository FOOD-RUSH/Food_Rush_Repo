// Transaction History Types - Updated to match Payment API documentation

// Raw API response from /api/v1/payments/transactions/{userId}
export interface PaymentTransactionApiResponse {
  transId: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  medium: string; // e.g., "mobile money"
  serviceName: string; // e.g., "FoodRush"
  amount: number;
  payerName: string;
  email: string;
  financialTransId?: string; // Provider's transaction ID (e.g., "MTN-789456")
  dateInitiated: string; // e.g., "2025-10-06"
  dateConfirmed?: string; // null if still pending
}

// Enhanced transaction interface for app usage
export interface Transaction {
  id: string; // Maps to transId from API
  orderId?: string; // May not be available from payment API
  amount: number;
  currency: string; // Default to "XAF" for Cameroon
  method: 'mobile_money';
  provider: 'mtn' | 'orange'; // Derived from medium or financialTransId
  status: 'pending' | 'completed' | 'failed' | 'cancelled'; // Mapped from API status
  transactionId: string; // Maps to transId from API
  financialTransId?: string; // Provider's transaction ID
  phoneNumber?: string; // May not be available from payment API
  payerName: string; // From API
  email: string; // From API
  description: string; // Generated description
  createdAt: string; // Maps to dateInitiated
  updatedAt: string; // Maps to dateConfirmed or dateInitiated
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