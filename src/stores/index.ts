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
// Payment store removed - using React Query for transaction history

// Restaurant-specific stores (excluding notification store to avoid duplicates)
export { useRestaurantProfileStore } from './restaurantStores/restaurantProfileStore';
