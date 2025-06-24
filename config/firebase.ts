import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth , initializeAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import {  getReactNativePersistence } from 'firebase/auth/react-native';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

//firebase
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default {app };
