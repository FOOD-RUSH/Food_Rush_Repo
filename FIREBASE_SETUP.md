# Firebase Setup Instructions

## 1. Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click "Add app" and select "Web"
6. Copy the config object

## 2. Update Firebase Config

Replace the placeholder values in `config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 3. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save

## 4. Test the App

1. Run `npm start` or `expo start`
2. Try creating an account with email/password
3. Try logging in with the created account

## What We Built

✅ Simple Firebase Auth setup
✅ Clean AuthContext (no Redux complexity)
✅ Basic Login screen
✅ Basic Signup screen  
✅ Simple Home screen with logout
✅ Proper navigation flow

The app will automatically redirect users based on their authentication state! 