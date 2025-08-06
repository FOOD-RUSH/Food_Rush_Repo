import { create } from 'zustand'
import { createJSONStorage, devtools, persist, } from 'zustand/middleware'
import AsyncStorage, { } from '@react-native-async-storage/async-storage'


export interface AppState {
    isOnboardingComplete: boolean;
    language: 'English' | 'French';
    theme: "light" | "dark"
    userType: "customer" | 'restaurant' | null;

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
        persist(
            (set) => ({
                userType: null,
                theme: 'light',
                language: 'English',
                isOnboardingComplete: false,
                _hasHydrated: false,

                // actio
                resetApp: () => set({
                    userType: null,
                    theme: 'light',
                    language: 'English',
                    isOnboardingComplete: false,
                }),
                completeOnboarding: () => set({ isOnboardingComplete: true }),
                setUserType: (type) => set({ userType: type }),
                setLanguage: (type) => set({ language: type }),
                setTheme: (theme) => set({ theme: theme }),
                setHydrated: (state) => set({ _hasHydrated: state })
            }),
            // Actions


            {
                name: 'AppStorage',
                storage: createJSONStorage(() => AsyncStorage
                ),
                onRehydrateStorage: () => (state) => { state?.setHydrated(true) }

            },

        )))
