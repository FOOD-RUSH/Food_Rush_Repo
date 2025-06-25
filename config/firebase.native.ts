import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, Auth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
  authDomain: "food-rushapp.firebaseapp.com",
  projectId: "food-rushapp",
  storageBucket: "food-rushapp.appspot.com",
  messagingSenderId: "358809288798",
  appId: "1:358809288798:web:9a0a2115f59169b7d074cf"
};

const app = initializeApp(firebaseConfig);

let auth: Auth;
let authInitialized = false;
let authInitializationPromise: Promise<Auth> | null = null;

export const initializeFirebaseAuth = async (): Promise<Auth> => {
  if (!authInitializationPromise) {
    authInitializationPromise = (async () => {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      
      // Wait for auth state to be ready
      await new Promise<void>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(() => {
          unsubscribe();
          resolve();
        });
      });
      
      authInitialized = true;
      return auth;
    })();
  }
  return authInitializationPromise;
};

export const getAuth = (): Auth => {
  if (!authInitialized) {
    throw new Error('Firebase Auth not initialized. Call initializeFirebaseAuth() first.');
  }
  return auth;
};

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export { app };




// import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
// import { initializeAuth } from "firebase/auth";
// import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getReactNativePersistence } from 'firebase/auth/react-native';

// const firebaseConfig = {
//   apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
//   authDomain: "food-rushapp.firebaseapp.com",
//   projectId: "food-rushapp",
//   storageBucket: "food-rushapp.firebasestorage.app",
//   messagingSenderId: "358809288798",
//   appId: "1:358809288798:web:9a0a2115f59169b7d074cf",
//   measurementId: "G-7C3R812G43"
// };

// const app = initializeApp(firebaseConfig);

// // Initialize Auth with persistence
// let auth: ReturnType<typeof initializeAuth>;
// export const getAuth = () => {
//   if (!auth) {
//     auth = initializeAuth(app, {
//       persistence: getReactNativePersistence(AsyncStorage),
//     });
//   }
//   return auth;
// };

// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const functions = getFunctions(app);
// export { app };




// import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
// import { initializeAuth, getAuth } from "firebase/auth";
// import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getReactNativePersistence } from 'firebase/auth/react-native';

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
//   authDomain: "food-rushapp.firebaseapp.com",
//   projectId: "food-rushapp",
//   storageBucket: "food-rushapp.firebasestorage.app",
//   messagingSenderId: "358809288798",
//   appId: "1:358809288798:web:9a0a2115f59169b7d074cf",
//   measurementId: "G-7C3R812G43"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Auth with persistence
// let auth: any = null;

// try {
//   // Try to get existing auth instance
//   auth = getAuth(app);
// } catch (error) {
//   // If no auth instance exists, create one with persistence
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage)
//   });
// }

// // Initialize other Firebase services
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const functions = getFunctions(app);

// // Export auth and app
// export { auth, app }; 