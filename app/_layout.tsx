import './globals.css';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import LoadingScreen from '@/components/common/LoadingScreen';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { lightTheme } from '@/config/theme';
import { AuthProvider } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter_900Black });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PaperProvider theme={lightTheme}>
        <StatusBar style="auto" />
          <RootLayout />
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
