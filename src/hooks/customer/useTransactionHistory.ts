import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import transactionService, { TransactionFilters } from '@/src/services/customer/transaction.service';

/**
 * Hook to fetch transaction history with pagination
 */
export const useTransactionHistory = (filters: TransactionFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['transactions', 'history', filters],
    queryFn: ({ pageParam = 1 }) => transactionService.getTransactionHistory({
      ...filters,
      page: pageParam,
      limit: 20,
    }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};



/**
 * Hook to fetch transaction statistics
 */
export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transaction-stats'],
    queryFn: () => transactionService.getTransactionStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch individual transaction details
 */
export const useTransaction = (transactionId: string, enabled = true) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => transactionService.getTransactionById(transactionId),
    enabled: !!transactionId && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get recent transactions (last 10)
 */
export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => transactionService.getTransactionHistory({ limit: 10 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};