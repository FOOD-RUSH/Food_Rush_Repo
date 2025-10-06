// Transaction History Types
export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: 'mobile_money';
  provider: 'mtn' | 'orange';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  phoneNumber?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // Order details for display
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