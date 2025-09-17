import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App Store State
interface AppState {
// Onboarding
isOnboardingComplete: boolean;

// User type selection
selectedUserType: 'customer' | 'restaurant' | null;

// App state
theme: 'light' | 'dark';
isFirstLaunch: boolean;
isHydrated: boolean;
}

// App Store Actions
interface AppActions {
// Onboarding
completeOnboarding: () => void;

// User type
setSelectedUserType: (type: 'customer' | 'restaurant') => void;
clearSelectedUserType: () => void;

// Theme
setTheme: (theme: 'light' | 'dark') => void;

// App lifecycle
setFirstLaunch: (isFirst: boolean) => void;
setHydrated: (hydrated: boolean) => void;

// Reset
reset: () => void;
}

const initialState: Omit<AppState, 'isHydrated'> = {
isOnboardingComplete: false,
selectedUserType: null,
theme: 'light',
isFirstLaunch: true,
};

export const useAppStore = create<AppState & AppActions>()(
persist(
subscribeWithSelector((set, get) => ({
...initialState,
isHydrated: false,

  // Complete onboarding
  completeOnboarding: () => {
    set({
      isOnboardingComplete: true,
      isFirstLaunch: false,
    });
  },

  // User type selection
  setSelectedUserType: (selectedUserType) => {
    set({ selectedUserType });
  },

  clearSelectedUserType: () => {
    set({ selectedUserType: null });
  },

  // Theme
  setTheme: (theme) => {
    set({ theme });
  },

  // App lifecycle
  setFirstLaunch: (isFirstLaunch) => {
    set({ isFirstLaunch });
  },

  setHydrated: (isHydrated) => {
    set({ isHydrated });
  },

  // Reset all app state
  reset: () => {
    set({
      ...initialState,
      isHydrated: true,
    });
  },
})),
{
  name: 'app-store',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    isOnboardingComplete: state.isOnboardingComplete,
    selectedUserType: state.selectedUserType,
    theme: state.theme,
    isFirstLaunch: state.isFirstLaunch,
  }),
  onRehydrateStorage: () => (state) => {
    state?.setHydrated(true);
  },
}
)
);

// Simple selector hooks
export const useApp = () => useAppStore();
export const useOnboardingComplete = () => useAppStore((state) => state.isOnboardingComplete);
export const useSelectedUserType = () => useAppStore((state) => state.selectedUserType);
export const useTheme = () => useAppStore((state) => state.theme);
export const useIsFirstLaunch = () => useAppStore((state) => state.isFirstLaunch);
export const useIsHydrated = () => useAppStore((state) => state.isHydrated);

// Computed selectors
export const useNeedsOnboarding = () =>
useAppStore((state) => state.isHydrated && !state.isOnboardingComplete);

export const useCanProceedToAuth = () =>
useAppStore((state) =>
state.isHydrated &&
state.isOnboardingComplete &&
state.selectedUserType !== null
);
