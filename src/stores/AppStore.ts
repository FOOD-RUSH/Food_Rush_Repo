import { create } from 'zustand';
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';
type UserType = 'customer' | 'restaurant' | null;

interface AppState {
  // Onboarding
  isOnboardingComplete: boolean;

  // User type selection
  selectedUserType: UserType;

  // User preferences
  theme: Theme;

  // App state
  isFirstLaunch: boolean;
  lastActiveTimestamp: number;

  // Hydration state
  _hasHydrated: boolean;
}

interface AppActions {
  // Onboarding
  completeOnboarding: () => void;

  // User type selection
  setSelectedUserType: (userType: UserType) => void;
  clearSelectedUserType: () => void;

  // User preferences
  setTheme: (theme: Theme) => void;

  // App lifecycle
  setFirstLaunch: (isFirst: boolean) => void;
  updateLastActive: () => void;

  // Hydration
  setHydrated: (hydrated: boolean) => void;

  // Reset
  resetApp: () => void;
}

const initialState: Omit<AppState, '_hasHydrated'> = {
  isOnboardingComplete: false,
  selectedUserType: null,
  theme: 'light',
  isFirstLaunch: true,
  lastActiveTimestamp: Date.now(),
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          ...initialState,
          _hasHydrated: false,

          // Onboarding actions
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

          // Theme actions
          setTheme: (theme) => {
            const currentTheme = get().theme;
            if (currentTheme !== theme) {
              set({ theme });
            }
          },

          // App lifecycle actions
          setFirstLaunch: (isFirstLaunch) => {
            set({ isFirstLaunch });
          },

          updateLastActive: () => {
            set({ lastActiveTimestamp: Date.now() });
          },

          // Hydration actions
          setHydrated: (hydrated) => {
            set({ _hasHydrated: hydrated });
          },

          // Reset action
          resetApp: () => {
            set({
              ...initialState,
              _hasHydrated: true, // Keep hydration state
            });
          },
        }),
        {
          name: 'app-storage',
          storage: createJSONStorage(() => AsyncStorage),
          partialize: (state) => ({
            isOnboardingComplete: state.isOnboardingComplete,
            selectedUserType: state.selectedUserType,
            theme: state.theme,
            isFirstLaunch: state.isFirstLaunch,
            lastActiveTimestamp: state.lastActiveTimestamp,
          }),
          version: 3,
          migrate: (persistedState: any, version: number) => {
            // Handle migration from older versions
            if (version < 3) {
              return {
                ...persistedState,
                selectedUserType: persistedState.selectedUserType || null,
                _hasHydrated: false,
              };
            }
            return persistedState;
          },
          onRehydrateStorage: () => (state) => {
            state?.setHydrated(true);
          },
        },
      ),
    ),
    { name: 'AppStore' },
  ),
);

// Performance-optimized selector hooks
export const useTheme = () => useAppStore((state) => state.theme);
export const useSelectedUserType = () =>
  useAppStore((state) => state.selectedUserType);
export const useOnboardingComplete = () =>
  useAppStore((state) => state.isOnboardingComplete);
export const useIsFirstLaunch = () =>
  useAppStore((state) => state.isFirstLaunch);
export const useHasHydrated = () => useAppStore((state) => state._hasHydrated);

// Computed selectors
export const useIsAppReady = () =>
  useAppStore((state) => state._hasHydrated && state.isOnboardingComplete);

export const useNeedsOnboarding = () =>
  useAppStore((state) => state._hasHydrated && !state.isOnboardingComplete);

export const useCanProceedToAuth = () =>
  useAppStore(
    (state) =>
      state._hasHydrated &&
      state.isOnboardingComplete &&
      state.selectedUserType !== null,
  );

// Subscribe to theme changes for system integration
export const subscribeToThemeChanges = (callback: (theme: Theme) => void) => {
  return useAppStore.subscribe((state) => state.theme, callback);
};

// Backward compatibility exports
export const useApp = () => useAppStore();
export const useIsHydrated = () => useAppStore((state) => state._hasHydrated);
