import './src/locales/i18n';
import './globals.css';
import React, { useEffect, Suspense } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppContextProvider } from '@/src/contexts/AppContextProvider';
import RootNavigator from '@/src/navigation/RootNavigator';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { useAppLoading } from '@/src/hooks/useAppLoading';
import CustomSplashScreen from '@/src/components/common/CustomSplashScreen';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry with error handling to prevent startup crashes
try {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || undefined,

    // Only send PII in production if explicitly required
    sendDefaultPii: !__DEV__,

    // Disable debug logging in production for performance and security
    debug: __DEV__,
    enableLogs: __DEV__,

    // Configure Session Replay - lower sample rate in production
    replaysSessionSampleRate: __DEV__ ? 0.1 : 0.01,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.mobileReplayIntegration(),
      Sentry.feedbackIntegration(),
    ],

    // Set environment from env variable
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'production',

    // Enable Spotlight only in development
    spotlight: __DEV__,

    // Add error handling callback
    beforeSend(event, hint) {
      if (__DEV__) {
        console.log('Sentry Event:', event);
      }
      return event;
    },
  });
  if (__DEV__) {
    console.log('✓ Sentry initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Sentry:', error);
  // App continues without Sentry rather than crashing
}

// Prevent the default Expo splash screen from auto-hiding
try {
  SplashScreen.preventAutoHideAsync();
} catch (error) {
  console.warn('SplashScreen.preventAutoHideAsync failed:', error);
  // Continue - this is not critical for app functionality
}

// Loading fallback component with font loading
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => {
  // Use a neutral background that works for both themes during loading
  // Since we can't access theme context here, use a safe neutral color
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Use light background as default
      }}
    >
      <ActivityIndicator size="large" color="#007aff" />
      <Text
        style={{
          marginTop: 16,
          color: '#1e293b', // Dark text for light background
          fontSize: 16,
          fontFamily: 'system',
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default Sentry.wrap(function App() {
  const {
    showCustomSplash,
    appReady,
    error,
    fontsLoaded,
    handleSplashAnimationComplete,
    handleSplashTransitionStart,
  } = useAppLoading();

  useEffect(() => {
    const hideExpoSplash = async () => {
      try {
        // Hide the default Expo splash screen once fonts are loaded
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error hiding Expo splash screen:', error);
      }
    };

    hideExpoSplash();
  }, [fontsLoaded]);

  // Show loading fallback while fonts are loading
  if (!fontsLoaded || error) {
    return <LoadingFallback message={error || 'Loading fonts...'} />;
  }

  // Show custom splash screen after fonts are loaded
  if (showCustomSplash) {
    return (
      <CustomSplashScreen
        onAnimationComplete={handleSplashAnimationComplete}
        onTransitionStart={handleSplashTransitionStart}
      />
    );
  }

  // Show loading fallback if app isn't ready after splash
  if (!appReady) {
    return <LoadingFallback message="Loading app..." />;
  }

  return (
    <ErrorBoundary>
      <AppContextProvider>
        <Suspense fallback={<LoadingFallback />}>
          <StatusBar style="auto" />
          <RootNavigator />
          <Toast />
        </Suspense>
      </AppContextProvider>
    </ErrorBoundary>
  );
});
