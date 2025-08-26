
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/contexts/LanguageContext';

/**
 * Hook for localization utilities (simplified for MVP)
 * Provides basic translation functions
 */
export const useLocalization = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();

  return {
    // Translation functions
    t,
    i18n,
    
    // Language info
    currentLanguage,
  };
};