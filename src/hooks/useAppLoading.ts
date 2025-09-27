import { useState, useEffect } from 'react';
import { useFonts } from './useFonts';

export interface AppLoadingState {
  isLoading: boolean;
  showCustomSplash: boolean;
  appReady: boolean;
  error: string | null;
}

export const useAppLoading = () => {
  const { fontsLoaded, fontError } = useFonts();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Wait for fonts to load
        if (fontsLoaded && !fontError) {
          // Fonts are loaded, but keep showing custom splash
          // The custom splash will handle its own timing
        } else if (fontError) {
          setError('Failed to load fonts');
          // Still continue with app loading
        }
      } catch (err) {
        console.error('Error preparing app:', err);
        setError('Failed to initialize app');
      }
    };

    prepareApp();
  }, [fontsLoaded, fontError]);

  const handleSplashAnimationComplete = () => {
    setShowCustomSplash(false);
    setAppReady(true);
  };

  const handleSplashTransitionStart = () => {
    // This can be used to start preloading other resources
    // while the splash animation is transitioning
  };

  return {
    isLoading: !fontsLoaded || showCustomSplash,
    showCustomSplash,
    appReady,
    error,
    fontsLoaded,
    fontError,
    handleSplashAnimationComplete,
    handleSplashTransitionStart,
  };
};