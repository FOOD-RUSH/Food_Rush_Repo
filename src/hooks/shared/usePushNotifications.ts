import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import pushNotificationService, {
  registerForPushNotifications,
  unregisterPushNotifications,
  checkNotificationPermissions,
  requestNotificationPermissions,
} from '@/src/services/shared/pushNotificationService';

export interface UsePushNotificationsReturn {
  isRegistered: boolean;
  isLoading: boolean;
  hasPermission: boolean;
  error: string | null;
  register: () => Promise<boolean>;
  unregister: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<boolean>;
}

/**
 * Hook to manage push notification registration and permissions
 * Automatically registers/unregisters based on authentication state
 */
export const usePushNotifications = (
  autoRegister: boolean = true,
): UsePushNotificationsReturn => {
  const { isAuthenticated, user } = useAuthStore();
  const { error: storeError } = useNotificationStore();
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permissions on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Auto register/unregister based on authentication
  useEffect(() => {
    if (autoRegister) {
      if (isAuthenticated && user) {
        register();
      } else {
        unregister();
      }
    }
  }, [isAuthenticated, user, autoRegister]);

  const checkPermission = async (): Promise<boolean> => {
    try {
      const permission = await checkNotificationPermissions();
      setHasPermission(permission);
      return permission;
    } catch (err) {
      console.error('Error checking notification permissions:', err);
      setHasPermission(false);
      return false;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Notification permission denied');
      }
      
      return granted;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to request notification permission';
      setError(errorMessage);
      console.error('Error requesting notification permission:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError('User not authenticated');
        return false;
      }
      
      // Request permission if not granted
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          return false;
        }
      }
      
      // Register for push notifications
      const token = await registerForPushNotifications();
      const success = !!token;
      
      setIsRegistered(success);
      
      if (!success) {
        setError('Failed to register for push notifications');
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register for push notifications';
      setError(errorMessage);
      console.error('Error registering for push notifications:', err);
      setIsRegistered(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unregister = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await unregisterPushNotifications();
      setIsRegistered(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to unregister push notifications';
      setError(errorMessage);
      console.error('Error unregistering push notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isRegistered,
    isLoading,
    hasPermission,
    error: error || storeError,
    register,
    unregister,
    requestPermission,
    checkPermission,
  };
};

export default usePushNotifications;