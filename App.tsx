import './src/locales/i18n';
import './globals.css';
import React, { useEffect, Suspense, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppContextProvider } from '@/src/contexts/AppContextProvider';
import RootNavigator from '@/src/navigation/RootNavigator';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import { useFonts } from '@/src/hooks/useFonts';

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
  const { fontsLoaded, fontError } = useFonts();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Wait for fonts to load
        if (fontsLoaded && !fontError) {
          setAppReady(true);
          // Hide splash screen after fonts are loaded
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error preparing app:', error);
        // Still show app even if fonts fail to load
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (!appReady) {
    return (
      <LoadingFallback
        message={fontError ? 'Loading app...' : 'Loading fonts...'}
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
