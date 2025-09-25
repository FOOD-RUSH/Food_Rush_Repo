// Customer Stores Index
// This file exports all customer stores for easy import

// Customer-specific stores
export * from './cartStore';
export * from './notificationStore';
export * from './paymentStore';
export * from './addressStore';

// Re-export commonly used auth hooks for convenience
export {
  useAuthUser,
  useUser,
  useIsAuthenticated,
  useCustomerProfile,
} from '../AuthStore';
