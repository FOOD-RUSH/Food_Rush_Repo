import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { authService } from '@/services/firebase/authService';
import { getAuth } from '@/config/firebase.native';
import { AuthErrorCodes } from 'firebase/auth';

// Improved initial state with more detailed status tracking
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  hasHydrated: false,
  authStateChecked: false // New flag for Firebase auth state
};

// Helper function to handle Firebase auth errors
const handleAuthError = (error: any) => {
  switch (error.code) {
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Invalid email address';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Invalid password';
    case AuthErrorCodes.USER_DELETED:
      return 'User not found';
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return 'Network error. Please check your connection';
    default:
      return error.message || 'Authentication failed';
  }
};

// Enhanced signInUser with proper error handling
export const signInUser = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Ensure auth is ready
      const { initializeFirebaseAuth } = await import('@/config/firebase.native');
      await initializeFirebaseAuth();
      const user = await authService.signIn(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Enhanced signUpUser with proper error handling
export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Ensure auth is ready
      const { initializeFirebaseAuth } = await import('@/config/firebase.native');
      await initializeFirebaseAuth();
      const user = await authService.signUp(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Enhanced signOutUser with proper error handling
export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      // Ensure auth is ready
      const { initializeFirebaseAuth } = await import('@/config/firebase.native');
      await initializeFirebaseAuth();
      await authService.signOut();
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// New thunk to check initial auth state
export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { rejectWithValue }) => {
    try {
      // Ensure Firebase Auth is initialized
      const { initializeFirebaseAuth } = await import('@/config/firebase.native');
      await initializeFirebaseAuth();
      
      const auth = getAuth();
      return new Promise<User | null>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            resolve({
              uid: user.uid,
              email: user.email || '',
              userType: 'customer',
              profile: {
                userName: '',
                phoneNumber: '',
                addresses: [],
                preferences: {
                  dietary: [],
                  cuisineTypes: [],
                },
              },
              isEmailVerified: user.emailVerified
            });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error: any) {
      return rejectWithValue(handleAuthError(error));
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
    setAuthStateChecked: (state, action: PayloadAction<boolean>) => {
      state.authStateChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign In cases
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
      
      // Sign Up cases
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
      
      // Sign Out cases
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Auth State Check cases
      .addCase(checkAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.authStateChecked = true;
        state.error = null;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.isLoading = false;
        state.authStateChecked = true;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setAuthStateChecked } = authSlice.actions;
export default authSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { AuthState } from '../../types';
// import { authService } from '@/services/firebase/authService';

// const initialState: AuthState = {
//   user: null,
//   isLoading: false,
//   isAuthenticated: false,
//   error: null,
//   hasHydrated: false,
// };

// export const signInUser = createAsyncThunk(
//   'auth/signIn',
//   async (
//     { email, password }: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const user = await authService.signIn(email, password);
//       return user;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const signUpUser = createAsyncThunk(
//   'auth/signUp',
//   async (
//     { email, password }: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const user = await authService.signUp(email, password);
//       return user;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const signOutUser = createAsyncThunk(
//   'auth/signOut',
//   async (_, { rejectWithValue }) => {
//     try {
//       await authService.signOut();
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signInUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(signInUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(signInUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(signUpUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(signUpUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(signUpUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(signOutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       });
//   },
// });

// export const { clearError } = authSlice.actions;
// export default authSlice.reducer;