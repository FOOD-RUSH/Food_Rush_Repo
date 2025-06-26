import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import {  getReactNativePersistence } from 'firebase/auth/react-native';
import { getFunctions } from 'firebase/functions';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiRJDgzA3DJKFljxWHn94fPG6dNsiJ2wU",
  authDomain: "food-rushapp.firebaseapp.com",
  projectId: "food-rushapp",
  storageBucket: "food-rushapp.firebasestorage.app",
  messagingSenderId: "358809288798",
  appId: "1:358809288798:web:9a0a2115f59169b7d074cf",
  measurementId: "G-7C3R812G43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// WEB-specific auth initialization (uses default browser persistence)
const auth = getAuth(app);

//firebase
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export { auth, app }; 