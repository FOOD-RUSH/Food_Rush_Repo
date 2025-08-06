import { create } from "zustand";
import { User } from "../types";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    refreshToken: string | null;
    isLoading: boolean;
    userType: 'customer' | 'restaurant' | null
    error: null | string;

}

interface AuthActions {
    loginUser: (userType: 'restaurant' | 'customer' | undefined, email: string, password: string) => Promise<void>
    registerUser: (userData: User, password: string) => Promise<void>,
    logoutUser: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>,
    setUser: (user: User) => void;
    setIsAuthenticated: (value: boolean) => void;
    setToken: (token: string) => void;
    setIsLoading: (value: boolean) => void;
    setRefreshToken: (value: string) => void;
    setError: (error: string) => void




}


export const useAuthStore = create<AuthStore & AuthActions>()(devtools(persist((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    refreshToken: null,
    isLoading: false,
    userType: null,
    error: null,

    // actions
    loginUser: async (type, email, password) => { },
    registerUser: async (user) => { },
    logoutUser: () => {
        set({
            isAuthenticated: false,
            user: null,
            token: null,
            userType: null,
            refreshToken: null,
            error: null,
        })
    },
    updateProfile: async () => { },
    setUser: (user) => { set({ user: user }) },
    setIsAuthenticated: (value) => (set({ isAuthenticated: value })),
    setToken: (token) => { set({ token: token }) },
    setIsLoading: (value) => { set({ isLoading: value }) },
    setRefreshToken: (value) => (set({ refreshToken: value })),
    setError: (error) => (set({ error: error }))



}),
    {
        name: 'AuthState',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            userType: state.userType,
            token: state.token,
            refreshToken: state.refreshToken
        })
    }

)))