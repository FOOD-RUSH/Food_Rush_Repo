// Main Stores Index
// This file exports all stores for easy import

// Core stores
export * from './AppStore';
export * from './AuthStore';

// Shared stores (used by both customer and restaurant)
export * from './shared';

// Customer-specific stores
export * from './customerStores/cartStore';
export * from './customerStores/notificationStore'; // Re-exports shared notification store
export * from './customerStores/paymentStore';
export * from './customerStores/addressStore';

// Restaurant-specific stores
export * from './restaurantStores';