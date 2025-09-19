import { useState, useEffect } from 'react';
import { loadFonts, areFontsLoaded } from '@/src/utils/fontLoader';

interface UseFontsReturn {
  fontsLoaded: boolean;
  fontError: Error | null;
  loadFonts: () => Promise<void>;
}

/**
 * Hook for managing font loading state
 */
export const useFonts = (): UseFontsReturn => {
  const [fontsLoaded, setFontsLoaded] = useState(areFontsLoaded());
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fontsLoaded) {
      loadFontsAsync();
    }
  }, []);

  const loadFontsAsync = async () => {
    try {
      setFontError(null);
      await loadFonts();
      setFontsLoaded(true);
    } catch (error) {
      setFontError(error as Error);
      console.error('Failed to load fonts:', error);
    }
  };

  return {
    fontsLoaded,
    fontError,
    loadFonts: loadFontsAsync,
  };
};