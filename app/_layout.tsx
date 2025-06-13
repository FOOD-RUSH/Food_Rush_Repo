import { Provider as PaperProvider } from 'react-native-paper';
import './globals.css';
import { lightTheme } from '@/config/theme';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

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
    <PaperProvider theme={lightTheme}>
      <StatusBar />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="(restaurant)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

// spash-screen-background color: rgba(6, 16, 43, 1)
