// Main Stores Index
// This file exports all stores for easy import

// Core stores
export * from './AppStore';
export * from './AuthStore';

// Shared stores (used by both customer and restaurant)
export * from './shared';

// Customer-specific stores
export * from './customerStores/cartStore';
export * from './customerStores/addressStore';
export * from './customerStores/paymentStore';

// Restaurant-specific stores (excluding notification store to avoid duplicates)
export { useRestaurantProfileStore } from './restaurantStores/restaurantProfileStore';
