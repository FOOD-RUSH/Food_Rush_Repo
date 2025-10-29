import { apiClient } from '@/src/services/shared/apiClient';
import {
  Transaction,
  TransactionHistoryResponse,
  PaymentTransactionApiResponse,
  PaymentTransactionListResponse,
  TransactionStatus,
  TransactionProvider,
} from '@/src/types/transaction';
import { useAuthStore } from '@/src/stores/AuthStore';

export interface TransactionFilters {
  status?: TransactionStatus;
  method?: 'mobile_money';
  provider?: TransactionProvider;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

class TransactionService {
  private static instance: TransactionService;

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * Get current user ID from auth store
   */
  private getCurrentUserId(): string {
    const user = useAuthStore.getState().user;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }

  /**
   * Determine provider from financial transaction ID or medium
   */
  private determineProvider(
    financialTransId: string | null,
    medium: string | null,
  ): TransactionProvider {
    // Check financial transaction ID first
    if (financialTransId) {
      const transIdLower = financialTransId.toLowerCase();
      if (
        transIdLower.includes('mtn') ||
        transIdLower.startsWith('67') ||
        transIdLower.startsWith('68')
      ) {
        return 'mtn';
      }
      if (
        transIdLower.includes('orange') ||
        transIdLower.startsWith('69') ||
        transIdLower.startsWith('65')
      ) {
        return 'orange';
      }
    }

    // Check medium
    if (medium) {
      const mediumLower = medium.toLowerCase();
      if (mediumLower.includes('orange')) {
        return 'orange';
      }
      if (mediumLower.includes('mtn')) {
        return 'mtn';
      }
    }

    // Return unknown if we can't determine
    return 'unknown';
  }

  /**
   * Map API status to app status
   */
  private mapApiStatus(
    apiStatus: 'PENDING' | 'SUCCESSFUL' | 'FAILED',
  ): TransactionStatus {
    switch (apiStatus) {
      case 'PENDING':
        return 'pending';
      case 'SUCCESSFUL':
        return 'completed';
      case 'FAILED':
        return 'failed';
      default:
        return 'failed';
    }
  }

  /**
   * Transform API response to Transaction interface
   */
  private transformApiResponseToTransaction(
    apiResponse: PaymentTransactionApiResponse,
  ): Transaction {
    const provider = this.determineProvider(
      apiResponse.financialTransId,
      apiResponse.medium,
    );
    const status = this.mapApiStatus(apiResponse.status);

    // Generate a user-friendly description based on available data
    let description = `${apiResponse.transType} - ${apiResponse.serviceName}`;
    if (provider !== 'unknown') {
      description = `${provider.toUpperCase()} Mobile Money ${apiResponse.transType.toLowerCase()}`;
    }

    // Determine payment method
    const method =
      apiResponse.medium === 'mobile money' ? 'mobile_money' : 'unknown';

    return {
      id: apiResponse.transId,
      orderId: apiResponse.externalId, // Use externalId as order reference
      amount: apiResponse.amount,
      revenue: apiResponse.revenue,
      currency: 'XAF', // Default currency for Cameroon
      method,
      provider,
      status,
      transactionId: apiResponse.transId,
      financialTransId: apiResponse.financialTransId,
      phoneNumber: undefined, // Not available from payment API
      payerName: apiResponse.payerName,
      email: apiResponse.email,
      description,
      serviceName: apiResponse.serviceName,
      transType: apiResponse.transType,
      externalId: apiResponse.externalId,
      createdAt: apiResponse.dateInitiated,
      updatedAt: apiResponse.dateConfirmed,
      orderDetails: undefined, // Would need to be fetched separately if needed
    };
  }

  /**
   * Get transaction history with filters
   * Uses the documented API endpoint: GET /api/v1/payments/transactions/{userId}
   */
  async getTransactionHistory(
    filters: TransactionFilters = {},
  ): Promise<TransactionHistoryResponse> {
    try {
      const userId = this.getCurrentUserId();

      // Use the documented payment API endpoint
      const response = await apiClient.get<PaymentTransactionListResponse>(
        `/payments/transactions/${userId}`,
      );

      // Transform API response to expected format
      let transactions = response.data.data.map((apiTransaction) =>
        this.transformApiResponseToTransaction(apiTransaction),
      );

      // Apply client-side filtering since the API doesn't support query parameters
      if (filters.status) {
        transactions = transactions.filter((t) => t.status === filters.status);
      }
      if (filters.provider && filters.provider !== 'unknown') {
        transactions = transactions.filter(
          (t) => t.provider === filters.provider,
        );
      }
      if (filters.method) {
        transactions = transactions.filter((t) => t.method === filters.method);
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        transactions = transactions.filter(
          (t) => new Date(t.createdAt) >= startDate,
        );
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        transactions = transactions.filter(
          (t) => new Date(t.createdAt) <= endDate,
        );
      }

      // Sort by date (newest first)
      transactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTransactions = transactions.slice(startIndex, endIndex);

      // Create pagination info
      const totalTransactions = transactions.length;
      const totalPages = Math.ceil(totalTransactions / limit);

      return {
        status_code: 200,
        message: 'Transactions retrieved successfully',
        data: {
          transactions: paginatedTransactions,
          pagination: {
            page,
            limit,
            total: totalTransactions,
            pages: totalPages,
          },
        },
      };
    } catch (error: any) {
      console.error('Failed to fetch transaction history:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch transaction history',
      );
    }
  }

  /**
   * Get transaction details by ID
   * First tries to find in the user's transaction list, then falls back to verification endpoint
   */
  async getTransactionById(transactionId: string): Promise<Transaction> {
    try {
      // First try to find the transaction in the user's transaction history
      const transactionHistory = await this.getTransactionHistory({
        limit: 1000,
      });
      const foundTransaction = transactionHistory.data.transactions.find(
        (t) => t.transactionId === transactionId,
      );

      if (foundTransaction) {
        return foundTransaction;
      }

      // Fallback: Use the payment verification endpoint
      const response = await apiClient.get<PaymentTransactionApiResponse>(
        `/payments/verify?transId=${transactionId}`,
      );

      return this.transformApiResponseToTransaction(response.data);
    } catch (error: any) {
      console.error('Failed to fetch transaction details:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch transaction details',
      );
    }
  }

  /**
   * Get transaction statistics
   * Calculates stats from the user's transaction history
   */
  async getTransactionStats(): Promise<{
    totalTransactions: number;
    totalAmount: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
  }> {
    try {
      // Get all transactions and calculate stats client-side
      const transactionHistory = await this.getTransactionHistory({
        limit: 1000,
      }); // Get a large number to calculate accurate stats
      const transactions = transactionHistory.data.transactions;

      const stats = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        successfulTransactions: transactions.filter(
          (t) => t.status === 'completed',
        ).length,
        failedTransactions: transactions.filter(
          (t) => t.status === 'failed' || t.status === 'cancelled',
        ).length,
        pendingTransactions: transactions.filter((t) => t.status === 'pending')
          .length,
      };

      return stats;
    } catch (error: any) {
      console.error('Failed to fetch transaction stats:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch transaction stats',
      );
    }
  }
}

export default TransactionService.getInstance();
