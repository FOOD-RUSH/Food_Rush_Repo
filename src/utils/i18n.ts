import * as Localization from 'expo-localization';
import { SupportedLanguage, LANGUAGES } from '@/src/locales/i18n';

/**
 * Get device locale information (simplified for MVP)
 */
export const getDeviceLocaleInfo = () => {
  const locales = Localization.getLocales();
  const primaryLocale = locales[0];
  
  return {
    languageCode: primaryLocale?.languageCode || 'en',
    languageTag: primaryLocale?.languageTag || 'en-US',
  };
};

/**
 * Get supported languages list
 */
export const getSupportedLanguagesList = () => {
  return Object.entries(LANGUAGES).map(([code, info]) => ({
    code: code as SupportedLanguage,
    ...info,
  }));
};

/**
 * Validate if a language code is supported
 */
export const isSupportedLanguage = (languageCode: string): languageCode is SupportedLanguage => {
  return Object.keys(LANGUAGES).includes(languageCode);
};