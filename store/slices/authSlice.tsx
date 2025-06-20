import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { authService } from '@/services/firebase/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  hasHydrated: false,
};

// Async thunks
export const signInUser = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password, userType }: { email: string; password: string; userType: 'customer' | 'restaurant' },
    { rejectWithValue }
  ) => {
    try {
      const user = await authService.signIn(email, password, userType);
      await AsyncStorage.setItem('userToken', user.uid);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// sign up user

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (
    {
      email,
      password,
      userType,
      profile,
    }: {
      email: string;
      password: string;
      userType: 'customer' | 'restaurant';
      profile: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const user = await authService.signUp(email, password, userType, profile);
      await AsyncStorage.setItem('userToken', user.uid);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
      await AsyncStorage.removeItem('userToken');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const hydrateAuth = createAsyncThunk(
  'auth/hydrate',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const user = await authService.getCurrentUser();
        return user;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profile: Partial<User['profile']>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.user) throw new Error('No user found');
      
      const updatedUser = await authService.updateProfile(state.auth.user.uid, profile);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Sign Out
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Hydrate
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.hasHydrated = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.hasHydrated = true;
      })
      
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;