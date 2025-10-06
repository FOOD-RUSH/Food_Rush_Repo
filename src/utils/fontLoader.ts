import * as Font from 'expo-font';
import { FONT_ASSETS } from '@/src/config/fonts';

// Font loading state
let fontsLoaded = false;
let fontLoadingPromise: Promise<void> | null = null;

/**
 * Load all Urbanist font variants
 */
export const loadFonts = async (): Promise<void> => {
  if (fontsLoaded) {
    return;
  }

  if (fontLoadingPromise) {
    return fontLoadingPromise;
  }

  fontLoadingPromise = Font.loadAsync(FONT_ASSETS);

  try {
    await fontLoadingPromise;
    fontsLoaded = true;
  } catch (error) {
    console.error('❌ Error loading Urbanist fonts:', error);
    throw error;
  } finally {
    fontLoadingPromise = null;
  }
};

/**
 * Check if fonts are loaded
 */
export const areFontsLoaded = (): boolean => {
  return fontsLoaded;
};

/**
 * Reset font loading state (useful for testing)
 */
export const resetFontLoadingState = (): void => {
  fontsLoaded = false;
  fontLoadingPromise = null;
};

/**
 * Get font loading status
 */
export const getFontLoadingStatus = () => {
  return {
    loaded: fontsLoaded,
    loading: fontLoadingPromise !== null,
  };
};
