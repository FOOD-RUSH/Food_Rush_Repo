// src/types/bottomSheet.ts

export interface BottomSheetConfig {
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  detached?: boolean;
  title?: string;
  showHandle?: boolean;
  backdropOpacity?: number;
}

export interface BottomSheetContextType {
  present: (content: React.ReactNode, config?: BottomSheetConfig) => void;
  dismiss: () => void;
  isPresented: boolean;
}
