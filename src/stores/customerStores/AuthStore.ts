// AuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../../navigation/navigationHelpers';
import TokenManager from '@/src/services/customer/tokenManager';

// ✅ Export User interface so it can be imported in screens
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'restaurant';
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  phoneNumber: string;
  // Optional restaurant fields if role is restaurant
  restaurantId?: string;
  restaurantName?: string;
  verificationStatus?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: 'customer' | 'restaurant' | null;
  selectedUserType: 'customer' | 'restaurant' | null;
  error: string | null;
  registrationData: {
    email?: string;
    phoneNumber?: string;
    userId?: string;
  } | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedUserType: (userType: 'customer' | 'restaurant') => void;
  setRegistrationData: (data: AuthState['registrationData']) => void;
  logoutUser: () => Promise<void>;
  clearError: () => void;
  resetAuth: () => void;
  checkAuthStatus: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  userType: null,
  selectedUserType: null,
  error: null,
  registrationData: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setUser: (user) => {
          let processedUser = user;
          if (user?.role === 'restaurant' && user.restaurantId && user.restaurantName) {
            processedUser = { ...user };
          }
          set({
            user: processedUser,
            userType: processedUser?.role ?? null,
            error: null,
          });
        },
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated, error: isAuthenticated ? null : get().error }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setSelectedUserType: (selectedUserType) => set({ selectedUserType }),
        setRegistrationData: (registrationData) => set({ registrationData }),
        logoutUser: async () => {
          try {
            await TokenManager.clearAllTokens();
            set({ ...initialState, selectedUserType: get().selectedUserType });
            navigate('Auth');
          } catch (error) {
            console.error('Error during logout:', error);
            set({ ...initialState, selectedUserType: get().selectedUserType });
            navigate('Auth');
          }
        },
        checkAuthStatus: async () => {
          try {
            set({ isLoading: true });
            const accessToken = await TokenManager.getToken();
            const refreshToken = await TokenManager.getRefreshToken();
            if (accessToken && refreshToken) set({ isAuthenticated: true });
            else set({ isAuthenticated: false, user: null, userType: null });
          } catch {
            set({ isAuthenticated: false, user: null, userType: null });
          } finally {
            set({ isLoading: false });
          }
        },
        clearError: () => set({ error: null }),
        resetAuth: () => set({ ...initialState, selectedUserType: get().selectedUserType }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          userType: state.userType,
          selectedUserType: state.selectedUserType,
          registrationData: state.registrationData,
        }),
        version: 3,
        migrate: (persistedState: any, version: number) => {
          if (version < 2) return { ...persistedState, registrationData: null, error: null, isLoading: false };
          return persistedState;
        },
        onRehydrateStorage: () => (state) => state?.checkAuthStatus(),
      },
    ),
    { name: 'AuthStore' },
  ),
);

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserType = () => useAuthStore((state) => state.userType);
export const useSelectedUserType = () => useAuthStore((state) => state.selectedUserType);
export const useRegistrationData = () => useAuthStore((state) => state.registrationData);
export const useAuthStatus = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  user: state.user,
  error: state.error,
}));
export const useAuthActions = () => useAuthStore((state) => ({
  setUser: state.setUser,
  setIsAuthenticated: state.setIsAuthenticated,
  setError: state.setError,
  clearError: state.clearError,
  logoutUser: state.logoutUser,
  resetAuth: state.resetAuth,
  setRegistrationData: state.setRegistrationData,
}));
