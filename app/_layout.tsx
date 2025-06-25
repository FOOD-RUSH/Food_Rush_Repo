import { Provider as PaperProvider } from 'react-native-paper';
import './globals.css';
import { lightTheme } from '@/config/theme';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from '@/components/common/LoadingScreen';
// import { persistor, store } from '@/store';
import { Provider as StateProvider, useDispatch } from 'react-redux';
import { Slot } from 'expo-router';
import { initializeFirebaseAuth } from '@/config/firebase.native';
import { checkAuthState } from '@/store/slices/authSlice';
import { persistor, store, AppDispatch } from '@/store';

SplashScreen.preventAutoHideAsync();

// Create a separate component for the authenticated part of the app
function AuthenticatedApp() {
  const dispatch = useDispatch<AppDispatch>();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // 1. Initialize Firebase Auth first
        await initializeFirebaseAuth();
        
        // 2. Wait for routes to be registered (Expo Router needs time)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 3. Set routes ready flag
        const { setRoutesReady } = await import('@/services/firebase/authService');
        setRoutesReady(true);
        
        // 4. Wait a bit more to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 5. Then check auth state
        const resultAction = await dispatch(checkAuthState());
        
        if (checkAuthState.fulfilled.match(resultAction)) {
          setAppReady(true);
        } else {
          console.error('Auth check failed:', resultAction.error);
          setAppReady(true); // Continue anyway
        }
      } catch (error) {
        console.error('App initialization failed:', error);
        setAppReady(true); // Continue anyway
      }
    };

    prepareApp();
  }, [dispatch]);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return <Slot />;
}

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
    <StateProvider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <PaperProvider theme={lightTheme}>
            <AuthenticatedApp />
          </PaperProvider>
        </SafeAreaProvider>
      </PersistGate>
    </StateProvider>
  );
}










// import { Provider as PaperProvider } from 'react-native-paper';
// import './globals.css';
// import { lightTheme } from '@/config/theme';
// import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
// import * as SplashScreen from 'expo-splash-screen';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { useEffect, useState } from 'react';
// import { PersistGate } from 'redux-persist/integration/react';
// import LoadingScreen from '@/components/common/LoadingScreen';
// import { persistor, store } from '@/store';
// import { Provider as StateProvider } from 'react-redux';
// import { Slot } from 'expo-router';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     Inter_900Black,
//   });
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const initializeApp = async () => {
//       try {
//         // Initialize Firebase auth
//         await import('@/config/firebase.native');
        
//         // Wait a bit for routes to register
//         await new Promise(resolve => setTimeout(resolve, 200));
        
//         // Set routes ready in auth service
//         const { setRoutesReady } = await import('@/services/firebase/authService');
//         setRoutesReady(true);
        
//         setIsReady(true);
//       } catch (error) {
//         console.error('App initialization error:', error);
//         setIsReady(true); // Continue anyway
//       }
//     };

//     initializeApp();
//   }, []);

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   // Wait for fonts, Firebase, and route registration
//   if (!loaded || !isReady) {
//     return <LoadingScreen />;
//   }

//   return (
//     <StateProvider store={store}>
//       <PersistGate loading={<LoadingScreen />} persistor={persistor}>
//         <SafeAreaProvider>
//           <PaperProvider theme={lightTheme}>
//             <Slot />
//           </PaperProvider>
//         </SafeAreaProvider>
//       </PersistGate>
//     </StateProvider>
//   );
// }

// // spash-screen-background color: rgba(6, 16, 43, 1)
