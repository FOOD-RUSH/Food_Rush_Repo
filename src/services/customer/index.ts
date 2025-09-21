// API Services Index
// This file exports all customer API services for easy import

export * from './authApi';
export * from './restaurant.service';
export * from './cartReminderService';
export * from './orders.service';
export * from './payment.service';

// Notification service now uses shared implementation
// Import from: @/src/services/shared/notificationApi

// Location service is now available at @/src/location
// export { LocationService } from '@/src/location';
