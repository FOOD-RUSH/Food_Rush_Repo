/**
 * Event Bus Service
 * 
 * Provides a type-safe event system for cross-cutting concerns.
 * Uses React Native's DeviceEventEmitter for simplicity and performance.
 * 
 * @example
 * // Emit an event
 * eventBus.emit('user-logout');
 * 
 * // Listen to an event
 * const subscription = eventBus.on('user-logout', () => {
 *   console.log('User logged out');
 * });
 * 
 * // Clean up
 * subscription.remove();
 */

import { DeviceEventEmitter, EmitterSubscription } from 'react-native';

// Define all app events with their payload types
export interface AppEvents {
  'user-logout': void;
  'session-expired': void;
  'auth-state-changed': { isAuthenticated: boolean };
  'token-refreshed': void;
}

// Event names type
export type AppEventName = keyof AppEvents;

class EventBus {
  /**
   * Emit an event
   */
  emit<K extends AppEventName>(event: K, data?: AppEvents[K]): void {
    DeviceEventEmitter.emit(event, data);
  }

  /**
   * Listen to an event
   * Returns a subscription that can be removed
   */
  on<K extends AppEventName>(
    event: K,
    handler: (data: AppEvents[K]) => void,
  ): EmitterSubscription {
    return DeviceEventEmitter.addListener(event, handler);
  }

  /**
   * Listen to an event once
   * Automatically removes the listener after first call
   */
  once<K extends AppEventName>(
    event: K,
    handler: (data: AppEvents[K]) => void,
  ): EmitterSubscription {
    const subscription = DeviceEventEmitter.addListener(event, (data) => {
      handler(data);
      subscription.remove();
    });
    return subscription;
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: AppEventName): void {
    DeviceEventEmitter.removeAllListeners(event);
  }
}

// Export singleton instance
export const eventBus = new EventBus();
