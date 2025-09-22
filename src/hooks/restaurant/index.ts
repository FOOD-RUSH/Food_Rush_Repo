// Restaurant hooks index
export * from './useAuthhooks';
export * from './useMenuApi';
export * from './useOrderApi';
// Export useRestaurantProfile from useRestaurantApi.ts and useRestaurantProfile.ts separately
export { useToggleRestaurantStatus, useUpdateRestaurantLocation } from './useRestaurantApi';
export { useRestaurantProfile, useRestaurantStatus } from './useRestaurantProfile';
export * from './useRestaurantReviews';
export * from './useAnalytics';
export * from './useRestaurantNotifications';

// Shared notification hooks available at:
// @/src/hooks/shared/useNotifications