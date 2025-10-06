import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import TransactionService, { TransactionFilters } from '@/src/services/customer/transaction.service';
import { Transaction } from '@/src/types/transaction';

/**
 * Hook to fetch transaction history with pagination
 */
export const useTransactionHistory = (filters: TransactionFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['transactions', 'history', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return TransactionService.getTransactionHistory({
        ...filters,
        page: pageParam,
        limit: filters.limit || 20,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a specific transaction by ID
 */
export const useTransaction = (transactionId: string, enabled = true) => {
  return useQuery({
    queryKey: ['transactions', transactionId],
    queryFn: () => TransactionService.getTransactionById(transactionId),
    enabled: !!transactionId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch transaction statistics
 */
export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transactions', 'stats'],
    queryFn: () => TransactionService.getTransactionStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get recent transactions (last 10)
 */
export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => TransactionService.getTransactionHistory({ limit: 10, page: 1 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.data.transactions,
  });
};