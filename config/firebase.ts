// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase services
export const auth = getAuth(app);
//firebase
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;