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

Sentry.init({
  dsn: 'https://5dd2a75ca59d510bd578ee70fc5e0898@o4509617549344768.ingest.us.sentry.io/4509617551835136',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,
  debug: true,
  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Prevent the default Expo splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

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