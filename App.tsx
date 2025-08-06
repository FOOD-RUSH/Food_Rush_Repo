import './globals.css';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from '@/src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from './src/config/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
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
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={lightTheme}>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </>
  );
}
