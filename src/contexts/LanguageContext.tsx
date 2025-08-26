import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, SupportedLanguage } from '@/src/locales/i18n';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  availableLanguages: typeof LANGUAGES;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language state
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        if (i18n.isInitialized) {
          setCurrentLanguage(i18n.language as SupportedLanguage);
        } else {
          await i18n.init();
          setCurrentLanguage(i18n.language as SupportedLanguage);
        }
      } catch (error) {
        console.warn('Language initialization failed:', error);
        setCurrentLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [i18n]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng as SupportedLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      try {
        setIsLoading(true);
        await i18n.changeLanguage(language);
        setCurrentLanguage(language);
      } catch (error) {
        console.error('Failed to change language:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [i18n],
  );

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages: LANGUAGES,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
