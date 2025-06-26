import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('Firebase config: Starting initialization');

const firebaseConfig = {
    apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
    authDomain: "food-rushapp.firebaseapp.com",
    projectId: "food-rushapp",
    storageBucket: "food-rushapp.appspot.com",
    messagingSenderId: "358809288798",
    appId: "1:358809288798:web:9a0a2115f59169b7d074cf"
};

console.log('Firebase config: Config loaded, initializing app');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase config: App initialized');

// Initialize Auth with proper error handling
let auth: Auth;

try {
  console.log('Firebase config: Attempting to initialize auth with persistence');
  // Try to initialize auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('Firebase config: Auth initialized with persistence successfully');
} catch (error) {
  console.log('Firebase config: Auth already initialized, getting existing instance');
  console.log('Firebase config: Error was:', error);
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
  console.log('Firebase config: Got existing auth instance');
}

// Verify auth is properly initialized
if (!auth) {
  console.error('Firebase config: Failed to initialize Firebase auth');
  throw new Error('Firebase auth initialization failed');
}

console.log('Firebase config: Firebase auth ready:', !!auth);
console.log('Firebase config: Auth object:', auth);

export { auth };
export default app; 