import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { BottomSheetConfig, BottomSheetContextType } from '@/src/types/bottomSheet';
import GlobalBottomSheet, { GlobalBottomSheetRef } from '@/src/components/common/BottomSheet/GlobalBottomSheet';

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within BottomSheetProvider');
  }
  return context;
};

interface BottomSheetProviderProps {
  children: React.ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
  const bottomSheetRef = useRef<GlobalBottomSheetRef>(null);
  const [isPresented, setIsPresented] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [config, setConfig] = useState<BottomSheetConfig>({});

  const present = useCallback((newContent: React.ReactNode, newConfig?: BottomSheetConfig) => {
    setContent(newContent);
    setConfig(newConfig || {});
    setIsPresented(true);
    bottomSheetRef.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleDismiss = useCallback(() => {
    setIsPresented(false);
    setContent(null);
    setConfig({});
  }, []);

  const value: BottomSheetContextType = {
    present,
    dismiss,
    isPresented,
  };

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
      <GlobalBottomSheet
        ref={bottomSheetRef}
        content={content}
        config={config}
        onDismiss={handleDismiss}
      />
    </BottomSheetContext.Provider>
  );
};