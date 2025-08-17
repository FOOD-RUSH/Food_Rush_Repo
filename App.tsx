// App.tsx (yours, with one key addition)
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/services/customer/queryClient';
import './globals.css';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from '@/src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/src/components/ThemeProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BottomSheetProvider } from './src/components/common/BottomSheet/BottomSheetContext';
import { NetworkProvider } from '@/src/contexts/NetworkContext';
import { LanguageProvider } from '@/src/contexts/LanguageContext';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <NetworkProvider>
            <LanguageProvider>
              <SafeAreaProvider>
                <BottomSheetModalProvider>
                  <BottomSheetProvider>
                    <StatusBar style="auto" />
                    <RootNavigator />
                    <Toast />
                  </BottomSheetProvider>
                </BottomSheetModalProvider>
              </SafeAreaProvider>
            </LanguageProvider>
          </NetworkProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
