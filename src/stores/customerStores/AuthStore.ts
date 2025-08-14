import { apiClient } from '../../services/customer/apiClient';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';
import {
  authApi,
  OTPCredentials,
  RegisterRequest,
} from '../../services/customer/authApi';
import { navigate } from '../../navigation/navigationHelpers';
// Register Request

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: 'customer' | 'restaurant' | null;
  selectedUserType: 'customer' | 'restaurant' | null;
  error: string | null;
}

interface AuthActions {
  // Authentication actions
  loginUser: (
    userType: 'restaurant' | 'customer',
    email: string,
    password: string,
  ) => Promise<void>;
  registerUser: (userData: RegisterRequest) => Promise<void>;
  logoutUser: () => void;
  refreshAuthToken: () => Promise<void>;
  verifyOTP: (
    OTPinfo: OTPCredentials & {
      email: string;
      phoneNumber: string;
      userType: 'customer';
    },
  ) => Promise<void>;
  // Profile actions
  updateProfile: (userData: Partial<User>) => Promise<void>;

  // State setters
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedUserType?: (userType: 'customer' | 'restaurant') => void;

  // Utility actions
  clearError: () => void;
  resetAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  userType: null,
  selectedUserType: null,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Authentication actions
        loginUser: async (userType, email, password) => {
          try {
            set({ isLoading: true, error: null });

            // TODO: Implement actual API call
            const response = await authApi.login({ email, password });
            console.log(response.data);
            apiClient.setAuthToken(response.data.accessToken);
            // const NewUser: User = {
            //   email: response.data.user.email,
            //   isEmailVerified: response.data.user.isEmailVerified,
            //   userType: response.data.user.role,
            //   uid: response.data.user.id,
            //   profile: {
            //     addresses: [],
            //     phoneNumber: '+237682946873',
            //     userName: response.data.fullName,
            //     // image: null,

            //     favoriteRestaurants: [],
            //     preferences: { dietary: [], cuisineTypes: [] }

            //   }
            // };
            // console.log(NewUser);
            set({
              user: response.data.user,
              token: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              isAuthenticated: true,
              userType,
              isLoading: false,
              error: null,
            });

            console.log('Login attempted for:', { userType, email });
          } catch (error) {
            console.log(error);
            set({
              error: error instanceof Error ? error.message : 'Login failed',

              isLoading: false,
            });
            throw error;
          }
        },

        registerUser: async (userData) => {
          try {
            set({ isLoading: true, error: null });

            // TODO: Implement actual API call
            const response = await authApi.register({ ...userData });
            console.log(
              'Registration attempted for:' +
                userData +
                'Registeration succesful redirecting to OTP for verification' +
                response.data,
            );
            navigate('Auth', {
              screen: 'OTPVerification',
              params: {
                type: 'email',
                userId: response.data.userId,
                email: response.data.email,
                phone: response.data.phoneNumber,
                userType: response.data.role,
              },
            });
          } catch (error) {
            set({
              error:
                error instanceof Error ? error.message : 'Registration failed',
              isLoading: false,
            });
            throw error;
          }
        },

        verifyOTP: async (OTPdata) => {
          try {
            const response = await authApi.verifyOTP({
              otp: OTPdata.otp,
              type: OTPdata.type,
              userId: OTPdata.userId,
            });
            const NewUser: User = {
              email: response.data.user.email,
              isEmailVerified: response.data.user.isEmailVerified,
              userType: response.data.user.role,
              uid: response.data.user.id,
              profile: {
                addresses: [],
                phoneNumber: OTPdata.phoneNumber,
                userName: response.data.fullName,
                // image: null,

                favoriteRestaurants: [],
                preferences: { dietary: [], cuisineTypes: [] },
              },
            };
            apiClient.setAuthToken(response.data.accessToken);
            set({
              isAuthenticated: true,
              refreshToken: response.data.refreshToken,
              token: response.data.accessToken,
              user: NewUser,
            });
            // navigate to home screeen
            navigate('CustomerApp', {
              screen: 'Home',
              params: {
                screen: 'HomeScreen',
              },
            });
            // bottom taps to show verification complete
          } catch (Registererror) {
            // distinguish the error requests
            console.log(Registererror);
          }
        },

        refreshAuthToken: async () => {
          try {
            const { refreshToken } = get();
            if (!refreshToken) throw new Error('No refresh token available');

            set({ isLoading: true });

            // TODO: Implement actual API call
            // const response = await authAPI.refreshToken(refreshToken);

            // set({
            //   token: response.token,
            //   refreshToken: response.refreshToken,
            //   isLoading: false,
            // });
          } catch (error) {
            // If refresh fails, logout user
            get().logoutUser();
            throw error;
          }
        },

        logoutUser: () => {
          apiClient.setAuthToken(null);
          set({
            ...initialState,
          });
          navigate('Auth');
        },

        // Profile actions
        updateProfile: async (userData) => {
          try {
            set({ isLoading: true, error: null });

            // TODO: Implement actual API call
            // const updatedUser = await userAPI.updateProfile(userData);

            const currentUser = get().user;
            if (currentUser) {
              set({
                user: { ...currentUser, ...userData },
                isLoading: false,
              });
            }
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : 'Profile update failed',
              isLoading: false,
            });
            throw error;
          }
        },

        // State setters
        setUser: (user) => set({ user }),

        setTokens: (token, refreshToken) => {
          apiClient.setAuthToken(token);
          set({
            token,
            refreshToken,
            isAuthenticated: true,
          });
        },

        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

        setIsLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        // Utility actions
        clearError: () => set({ error: null }),

        resetAuth: () => set({ ...initialState }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
          userType: state.userType,
        }),
        version: 1,
      },
    ),
    { name: 'AuthStore' },
  ),
);

// Selector hooks for better performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserType = () => useAuthStore((state) => state.userType);
