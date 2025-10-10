import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './en/translation.json';
import fr from './fr/translation.json';
import enAuth from './en/auth.json';
import frAuth from './fr/auth.json';
import enGenerated from './en/generated.json';
import frGenerated from './fr/generated.json';

// Constants
const STORAGE_KEY = 'user-language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Language metadata
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
} as const;

// Simple language detector
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Check saved preference first
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (
        savedLanguage &&
        SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)
      ) {
        callback(savedLanguage);
        return;
      }

      // Fallback to device language
      const deviceLocales = Localization.getLocales();
      const deviceLanguage = deviceLocales[0]?.languageCode;
      const supportedLanguage = SUPPORTED_LANGUAGES.includes(
        deviceLanguage as SupportedLanguage,
      )
        ? (deviceLanguage as SupportedLanguage)
        : DEFAULT_LANGUAGE;

      callback(supportedLanguage);
    } catch {
      callback(DEFAULT_LANGUAGE);
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // Silent fail for MVP
    }
  },
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
        auth: enAuth,
        generated: enGenerated,
      },
      fr: {
        translation: fr,
        auth: frAuth,
        generated: frGenerated,
      },
    },
    ns: ['translation', 'auth', 'generated'],
    defaultNS: 'translation',
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false, // Keep false for MVP
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;