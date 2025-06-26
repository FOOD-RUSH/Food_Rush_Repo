import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
  authDomain: "food-rushapp.firebaseapp.com",
  projectId: "food-rushapp",
  storageBucket: "food-rushapp.appspot.com",
  messagingSenderId: "358809288798",
  appId: "1:358809288798:web:9a0a2115f59169b7d074cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a simple auth wrapper that handles the registration error
let authInstance: any = null;

export const getFirebaseAuth = () => {
  if (!authInstance) {
    try {
      authInstance = getAuth(app);
      
      // Fix the recaptcha config issue by adding a mock function
      if (authInstance && !authInstance._getRecaptchaConfig) {
        authInstance._getRecaptchaConfig = () => null;
      }
      
      console.log('Firebase: Auth created successfully');
    } catch (error) {
      console.error('Firebase: Error creating auth:', error);
      
      // Create a comprehensive mock auth object
      const mockUser = null;
      
      authInstance = {
        currentUser: mockUser,
        onAuthStateChanged: (callback: any) => {
          setTimeout(() => callback(mockUser), 0);
          return () => {};
        },
        signInWithEmailAndPassword: () => Promise.reject(new Error('Auth not available')),
        createUserWithEmailAndPassword: () => Promise.reject(new Error('Auth not available')),
        signOut: () => Promise.reject(new Error('Auth not available')),
        _getRecaptchaConfig: () => null,
        
        // Add missing properties that Firebase auth might need
        app: app,
        config: {},
        name: '[DEFAULT]',
        
        // Mock the recaptchaVerifier - this is likely what's causing the error
        _getRecaptchaVerifier: () => ({
          create: () => Promise.resolve({
            render: () => Promise.resolve('mock-widget-id'),
            clear: () => {},
            reset: () => {},
            getResponse: () => 'mock-response',
          }),
        }),
        
        // Alternative recaptcha mock locations
        recaptchaVerifier: {
          create: () => Promise.resolve({
            render: () => Promise.resolve('mock-widget-id'),
            clear: () => {},
            reset: () => {},
            getResponse: () => 'mock-response',
          }),
        },
        
        // Mock for reCAPTCHA enterprise
        _recaptchaConfig: {
          create: () => Promise.resolve({
            render: () => Promise.resolve('mock-widget-id'),
            clear: () => {},
            reset: () => {},
            getResponse: () => 'mock-response',
          }),
        },
      };
      
      // Add prototype methods that might be expected
      Object.setPrototypeOf(authInstance, {
        create: () => Promise.resolve({
          render: () => Promise.resolve('mock-widget-id'),
          clear: () => {},
          reset: () => {},
          getResponse: () => 'mock-response',
        }),
      });
    }
  }
  return authInstance;
};

// Export other Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export { app };



// import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from "firebase/auth";
// import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

// const firebaseConfig = {
//   apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
//   authDomain: "food-rushapp.firebaseapp.com",
//   projectId: "food-rushapp",
//   storageBucket: "food-rushapp.appspot.com",
//   messagingSenderId: "358809288798",
//   appId: "1:358809288798:web:9a0a2115f59169b7d074cf"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Create a simple auth wrapper that handles the registration error
// let authInstance: any = null;

// export const getFirebaseAuth = () => {
//   if (!authInstance) {
//     try {
//       authInstance = getAuth(app);
      
//       // Fix the recaptcha config issue by adding a mock function
//       if (authInstance && !authInstance._getRecaptchaConfig) {
//         authInstance._getRecaptchaConfig = () => null;
//       }
      
//       console.log('Firebase: Auth created successfully');
//     } catch (error) {
//       console.error('Firebase: Error creating auth:', error);
//       // Return a more complete mock auth object to prevent crashes
//       authInstance = {
//         onAuthStateChanged: (callback: any) => {
//           callback(null);
//           return () => {};
//         },
//         signInWithEmailAndPassword: () => Promise.reject(new Error('Auth not available')),
//         createUserWithEmailAndPassword: () => Promise.reject(new Error('Auth not available')),
//         signOut: () => Promise.reject(new Error('Auth not available')),
//         _getRecaptchaConfig: () => null,
//         // Add missing properties that Firebase auth might need
//         app: app,
//         config: {},
//         name: '[DEFAULT]',
//         // Mock the recaptchaVerifier
//         recaptchaVerifier: {
//           create: () => ({
//             render: () => Promise.resolve('mock-widget-id'),
//             clear: () => {},
//             reset: () => {},
//             getResponse: () => 'mock-response',
//           }),
//         },
//       };
//     }
//   }
//   return authInstance;
// };

// // Export other Firebase services
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const functions = getFunctions(app);
// export { app }; 