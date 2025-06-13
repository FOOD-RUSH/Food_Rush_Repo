import { Provider as PaperProvider } from 'react-native-paper';
import './globals.css';
import { lightTheme } from '@/config/theme';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import RootNavigator from '@/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// spash-screen-background color: rgba(6, 16, 43, 1)
