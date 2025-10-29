import { useState, useCallback } from 'react';

export interface UseTermsModalReturn {
  isVisible: boolean;
  showTerms: () => void;
  hideTerms: () => void;
  toggleTerms: () => void;
}

/**
 * Hook to manage Terms & Conditions modal state
 *
 * @returns Object with modal state and control functions
 */
export const useTermsModal = (): UseTermsModalReturn => {
  const [isVisible, setIsVisible] = useState(false);

  const showTerms = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideTerms = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggleTerms = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    isVisible,
    showTerms,
    hideTerms,
    toggleTerms,
  };
};
