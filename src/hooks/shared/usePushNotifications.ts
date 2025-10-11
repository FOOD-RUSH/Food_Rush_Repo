import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useNotificationStore } from '@/src/stores/shared/notificationStore';
import { pushNotificationService } from '@/src/services/shared/pushNotificationService';

export const usePushNotifications = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setPushEnabled } = useNotificationStore();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize push notifications on mount
  useEffect(() => {
    const initPush = async () => {
      try {
        await pushNotificationService.init();
        setIsReady(true);
      } catch (err) {
        console.error('Error initializing push service:', err);
        setError('Failed to initialize push notifications');
        setIsReady(true); // Still mark as ready, just without push
      }
    };

    initPush();

    return () => {
      // Cleanup on unmount
      pushNotificationService.cleanup();
    };
  }, []);

  // Register device when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !isReady) return;

    const registerDevice = async () => {
      try {
        const token = await pushNotificationService.registerDevice();
        if (token) {
          setPushEnabled(true);
          setError(null);
        } else {
          setPushEnabled(false);
          console.warn('Failed to get push token');
        }
      } catch (err) {
        console.error('Error registering device:', err);
        setError('Failed to register device');
        setPushEnabled(false);
      }
    };

    registerDevice();

    return () => {
      // Cleanup on unmount
      pushNotificationService.unregisterDevice().catch(console.error);
    };
  }, [isAuthenticated, user?.id, isReady, setPushEnabled]);

  return {
    isReady,
    isEnabled: useNotificationStore((state) => state.pushEnabled),
    error,
  };
};
