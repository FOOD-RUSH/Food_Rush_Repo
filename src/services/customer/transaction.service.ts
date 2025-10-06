import { apiClient } from '@/src/services/shared/apiClient';
import { Transaction, TransactionHistoryResponse } from '@/src/types/transaction';

export interface TransactionFilters {
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  method?: 'mobile_money';
  provider?: 'mtn' | 'orange';
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
   * Get transaction history with filters
   */
  async getTransactionHistory(
    filters: TransactionFilters = {}
  ): Promise<TransactionHistoryResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.method) params.append('method', filters.method);
      if (filters.provider) params.append('provider', filters.provider);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get<TransactionHistoryResponse>(
        `/transactions/history?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch transaction history:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch transaction history'
      );
    }
  }

  /**
   * Get transaction details by ID
   */
  async getTransactionById(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<{
        status_code: number;
        message: string;
        data: Transaction;
      }>(`/transactions/${transactionId}`);

      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch transaction details:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch transaction details'
      );
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<{
    totalTransactions: number;
    totalAmount: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
  }> {
    try {
      const response = await apiClient.get<{
        status_code: number;
        message: string;
        data: {
          totalTransactions: number;
          totalAmount: number;
          successfulTransactions: number;
          failedTransactions: number;
          pendingTransactions: number;
        };
      }>('/transactions/stats');

      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch transaction stats:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch transaction stats'
      );
    }
  }
}

export default TransactionService.getInstance();