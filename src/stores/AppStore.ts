mport { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppState {
  isOnboardingComplete: boolean;
  language: 'English' | 'French';
  theme: 'light' | 'dark';
  userType: 'customer' | 'restaurant' | null;
}

interface AppActions {
  completeOnboarding: () => void;
  setUserType: (type: 'customer' | 'restaurant') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'French' | 'English') => void;
  _hasHydrated: boolean;
  setHydrated: (type: boolean) => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          userType: null,
          theme: 'light',
          language: 'English',
          isOnboardingComplete: false,
          _hasHydrated: false,

          // Actions
          resetApp: () =>
            set({
              userType: null,
              theme: 'light',
              language: 'English',
              isOnboardingComplete: false,
            }),

          completeOnboarding: () => {
            set({ isOnboardingComplete: true });
          },

          setUserType: (type) => {
            const currentUserType = get().userType;
            if (currentUserType !== type) {
              set({ userType: type });
            }
          },

          setLanguage: (language) => {
            const currentLanguage = get().language;
            if (currentLanguage !== language) {
              set({ language });
            }
          },

          setTheme: (theme) => {
            const currentTheme = get().theme;
            if (currentTheme !== theme) {
              set({ theme });
            }
          },

          setHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
          name: 'AppStorage',
          storage: createJSONStorage(() => AsyncStorage),
          onRehydrateStorage: () => (state) => {
            state?.setHydrated(true);
          },
        },
      ),
    ),
  ),
);

// Selector hooks for better performance
export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
export const useUserType = () => useAppStore((state) => state.userType);
