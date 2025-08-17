// API Services Index
// This file exports all customer API services for easy import

export * from './apiClient';
export * from './authApi';
export * from './restaurant.service';
export * from './address.service';
export * from './geolocation.service';
export * from './payment.service';
export * from './notification.service';

// Export order service separately since it's not in the customer folder
export { OrderApi } from '../orders.service';