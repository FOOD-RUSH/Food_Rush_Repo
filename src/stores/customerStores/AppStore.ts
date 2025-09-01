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

  // User preferences
  theme: Theme;
  userType: UserType;

  // App state
  isFirstLaunch: boolean;
  lastActiveTimestamp: number;

  // Hydration state
  _hasHydrated: boolean;
}

interface AppActions {
  // Onboarding
  completeOnboarding: () => void;

  // User preferences
  setUserType: (type: Exclude<UserType, null>) => void;
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
  theme: 'light',
  userType: null,
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

          // User preference actions
          setUserType: (userType) => {
            const currentUserType = get().userType;
            if (currentUserType !== userType) {
              set({ userType });
            }
          },

          
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
            theme: state.theme,
            userType: state.userType,
            isFirstLaunch: state.isFirstLaunch,
            lastActiveTimestamp: state.lastActiveTimestamp,
          }),
          version: 2,
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
export const useAppUserType = () => useAppStore((state) => state.userType);
export const useOnboardingComplete = () =>
  useAppStore((state) => state.isOnboardingComplete);
export const useIsFirstLaunch = () =>
  useAppStore((state) => state.isFirstLaunch);
export const useHasHydrated = () => useAppStore((state) => state._hasHydrated);

// Computed selectors
export const useIsAppReady = () =>
  useAppStore((state) => state._hasHydrated && state.isOnboardingComplete);

// Subscribe to theme changes for system integration
export const subscribeToThemeChanges = (callback: (theme: Theme) => void) => {
  return useAppStore.subscribe((state) => state.theme, callback);
};
