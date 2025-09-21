// Restaurant hooks index
export * from './useAuthhooks';
export * from './useMenuApi';
export * from './useOrderApi';
// Export useRestaurantProfile from useRestaurantApi.ts and useRestaurantProfile.ts separately
export { useToggleRestaurantStatus, useUpdateRestaurantLocation } from './useRestaurantApi';
export { useRestaurantProfile, useRestaurantStatus } from './useRestaurantProfile';
export * from './useRestaurantReviews';
export * from './useAnalytics';

// Notification hooks now use shared implementation
// Import from: @/src/hooks/shared/useNotifications