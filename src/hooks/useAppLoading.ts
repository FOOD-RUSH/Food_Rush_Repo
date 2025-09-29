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
  
  const [showCustomSplash, setShowCustomSplash] = useState(false); // Don't show until fonts are loaded
  const [appReady, setAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fontError) {
      setError('Failed to load fonts');
    } else if (fontsLoaded) {
      // Now that fonts are loaded, show the custom splash
      setShowCustomSplash(true);
    }
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