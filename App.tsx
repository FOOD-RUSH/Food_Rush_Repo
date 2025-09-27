import './src/locales/i18n';
import './globals.css';
import React, { useEffect, Suspense } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppContextProvider } from '@/src/contexts/AppContextProvider';
import RootNavigator from '@/src/navigation/RootNavigator';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import { useAppLoading } from '@/src/hooks/useAppLoading';
import CustomSplashScreen from '@/src/components/common/CustomSplashScreen';

// Prevent the default Expo splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Loading fallback component with font loading
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#06102b',
    }}
  >
    <ActivityIndicator size="large" color="#007aff" />
    <Text
      style={{
        marginTop: 16,
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'system',
      }}
    >
      {message}
    </Text>
  </View>
);

export default function App() {
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

  // Show custom splash screen while app is loading
  if (showCustomSplash) {
    return (
      <CustomSplashScreen
        onAnimationComplete={handleSplashAnimationComplete}
        onTransitionStart={handleSplashTransitionStart}
      />
    );
  }

  // Show loading fallback if there's an error or app isn't ready
  if (!appReady || error) {
    return (
      <LoadingFallback
        message={error || 'Loading app...'}
      />
    );
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
}
