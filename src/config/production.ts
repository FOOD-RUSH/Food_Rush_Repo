import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface ProductionConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  location: {
    highAccuracyTimeout: number;
    lowAccuracyTimeout: number;
    cacheTimeout: number;
    fallbackCoordinates: {
      latitude: number;
      longitude: number;
      city: string;
    };
  };
  notifications: {
    cartReminderDelay: number; // minutes
    abandonedCartDelay: number; // hours
    maxNotificationsPerDay: number;
  };
  performance: {
    enableHermes: boolean;
    enableFlipper: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  features: {
    enableCrashReporting: boolean;
    enableAnalytics: boolean;
    enablePushNotifications: boolean;
    enableBackgroundLocation: boolean;
  };
}

const getProductionConfig = (): ProductionConfig => {
  const isProduction =
    Constants.appOwnership === 'expo' ||
    Constants.appOwnership === 'standalone' ||
    process.env.NODE_ENV === 'production';

  return {
    api: {
      baseUrl:
        process.env.EXPO_PUBLIC_API_URL ||
        'https://foodrush-be.onrender.com/api/v1',
      timeout: isProduction ? 30000 : 15000, // Longer timeout in production
      retryAttempts: isProduction ? 5 : 3,
      retryDelay: 1000,
    },
    location: {
      highAccuracyTimeout: isProduction ? 20000 : 15000,
      lowAccuracyTimeout: isProduction ? 30000 : 20000,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      fallbackCoordinates: {
        latitude: 3.848,
        longitude: 11.5021,
        city: 'Yaoundé',
      },
    },
    notifications: {
      cartReminderDelay: 30, // 30 minutes
      abandonedCartDelay: 2, // 2 hours
      maxNotificationsPerDay: 10,
    },
    performance: {
      enableHermes: true,
      enableFlipper: !isProduction,
      logLevel: isProduction ? 'error' : 'debug',
    },
    features: {
      enableCrashReporting: isProduction,
      enableAnalytics: isProduction,
      enablePushNotifications: true,
      enableBackgroundLocation: false, // Disabled for now
    },
  };
};

export const productionConfig = getProductionConfig();

// Environment checks
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__ && Constants.appOwnership === 'standalone';
export const isExpoClient = Constants.appOwnership === 'expo';

// Platform-specific configurations
export const platformConfig = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  supportsBackgroundLocation:
    Platform.OS === 'ios' ? Platform.Version >= '14' : Platform.Version >= '23',
  supportsAdvancedNotifications:
    Platform.OS === 'ios' ? Platform.Version >= '10' : Platform.Version >= '21',
};

// Error monitoring configuration
export const errorConfig = {
  enableConsoleLogging: !isProduction,
  enableRemoteLogging: isProduction,
  enableUserFeedback: isProduction,
  maxErrorLogs: 100,
};

// Performance monitoring
export const performanceConfig = {
  enablePerformanceMonitoring: isProduction,
  sampleRate: isProduction ? 0.1 : 1.0,
  enableMemoryWarnings: true,
  enableNetworkTracking: true,
};

export default productionConfig;
