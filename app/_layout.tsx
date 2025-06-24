import '@/config/firebase';
import './globals.css';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import RootNavigator from '@/navigation/RootNavigator';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from '@/components/common/LoadingScreen';
import { persistor, store } from '@/store/store';
import { Provider as StateProvider } from 'react-redux';
import { ThemeProvider } from '@/components/ThemeProvider';


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
    <StateProvider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </StateProvider>
  );
}

// spash-screen-background color: rgba(6, 16, 43, 1)
