import { getAuth, initializeFirebaseAuth } from '@/config/firebase.native';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  AuthErrorCodes
} from 'firebase/auth';

// Simple global flag for routes ready
let routesReady = false;
export const setRoutesReady = (ready: boolean) => {
  routesReady = ready;
};

const waitForRoutes = async (maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    if (routesReady) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
};

export const authService = {
  async signIn(email: string, password: string) {
    try {
      // Ensure auth is initialized
      await initializeFirebaseAuth();
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? '',
        userType: 'customer' as const,
        profile: {
          userName: '',
          phoneNumber: '',
          addresses: [],
          preferences: {
            dietary: [],
            cuisineTypes: [],
          },
        },
        isEmailVerified: userCredential.user.emailVerified,
      };
    } catch (error: any) {
      let message = 'Failed to sign in';
      if (error.code === AuthErrorCodes.INVALID_EMAIL) {
        message = 'Invalid email address';
      } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
        message = 'Invalid password';
      } else if (error.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
        message = 'Network error. Please check your connection';
      }
      throw new Error(message);
    }
  },

  async signUp(email: string, password: string) {
    try {
      // Ensure auth is initialized
      await initializeFirebaseAuth();
      const auth = getAuth();
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? '',
        userType: 'customer' as const,
        profile: {
          userName: '',
          phoneNumber: '',
          addresses: [],
          preferences: {
            dietary: [],
            cuisineTypes: [],
          },
        },
        isEmailVerified: userCredential.user.emailVerified,
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  },
  
  async signOut() {
    try {
      // Ensure auth is initialized
      await initializeFirebaseAuth();
      const auth = getAuth();
      
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  },
};







// import { getAuth } from '@/config/firebase.native';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// // Simple global flag for routes ready
// let routesReady = false;
// export const setRoutesReady = (ready: boolean) => {
//   routesReady = ready;
// };

// const waitForRoutes = async (maxAttempts = 10) => {
//   for (let i = 0; i < maxAttempts; i++) {
//     if (routesReady) {
//       return true;
//     }
//     await new Promise(resolve => setTimeout(resolve, 100));
//   }
//   return false;
// };

// export const authService = {
//   async signIn(email: string, password: string) {
//     try {
//       // Wait for routes to be ready
//       const routesReady = await waitForRoutes();
//       if (!routesReady) {
//         throw new Error('Routes not ready yet');
//       }

//       const auth = getAuth();
//       if (!auth) {
//         throw new Error('Firebase Auth not initialized');
//       }
      
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       return {
//         uid: userCredential.user.uid,
//         email: userCredential.user.email ?? '',
//         userType: 'customer' as const,
//         profile: {
//           userName: '',
//           phoneNumber: '',
//           addresses: [],
//           preferences: {
//             dietary: [],
//             cuisineTypes: [],
//           },
//         },
//         isEmailVerified: userCredential.user.emailVerified,
//       };
//     } catch (error: any) {
//       console.error('Sign in error:', error);
//       throw new Error(error.message || 'Failed to sign in');
//     }
//   },
  
//   async signUp(email: string, password: string) {
//     try {
//       // Wait for routes to be ready
//       const routesReady = await waitForRoutes();
//       if (!routesReady) {
//         throw new Error('Routes not ready yet');
//       }

//       const auth = getAuth();
//       if (!auth) {
//         throw new Error('Firebase Auth not initialized');
//       }
      
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       return {
//         uid: userCredential.user.uid,
//         email: userCredential.user.email ?? '',
//         userType: 'customer' as const,
//         profile: {
//           userName: '',
//           phoneNumber: '',
//           addresses: [],
//           preferences: {
//             dietary: [],
//             cuisineTypes: [],
//           },
//         },
//         isEmailVerified: userCredential.user.emailVerified,
//       };
//     } catch (error: any) {
//       console.error('Sign up error:', error);
//       throw new Error(error.message || 'Failed to sign up');
//     }
//   },
  
//   async signOut() {
//     try {
//       // Wait for routes to be ready
//       const routesReady = await waitForRoutes();
//       if (!routesReady) {
//         throw new Error('Routes not ready yet');
//       }

//       const auth = getAuth();
//       if (!auth) {
//         throw new Error('Firebase Auth not initialized');
//       }
      
//       await signOut(auth);
//     } catch (error: any) {
//       console.error('Sign out error:', error);
//       throw new Error(error.message || 'Failed to sign out');
//     }
//   },
// }; 