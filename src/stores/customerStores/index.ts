// Customer Stores Index
// This file exports all customer stores for easy import

// Customer-specific stores
export * from './cartStore';
// Notification store moved to shared - use from '@/src/stores/shared/notificationStore'
// Payment store removed - using React Query for transaction history
export * from './addressStore';

// Re-export commonly used auth hooks for convenience
export {
  useAuthUser,
  useUser,
  useIsAuthenticated,
  useCustomerProfile,
} from '../AuthStore';
