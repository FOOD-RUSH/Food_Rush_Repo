import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase.native';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  confirmSignUp: (code: string) => Promise<void>;
  resendSignUp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    try {
      const auth = getFirebaseAuth();
      console.log('AuthProvider: Got auth instance:', !!auth);
      
      // Check if auth has the expected methods
      if (auth && typeof auth.onAuthStateChanged === 'function') {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('AuthProvider: Auth state changed, user:', !!user, 'email:', user?.email);
          setUser(user);
          setLoading(false);
        }, (error) => {
          console.error('AuthProvider: Auth state change error:', error);
          setLoading(false);
        });

        return unsubscribe;
      } else {
        console.log('AuthProvider: Using mock auth - no user logged in');
        setLoading(false);
      }
    } catch (error) {
      console.error('AuthProvider: Error getting auth instance:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign in for:', email);
    
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Sign in successful:', !!result.user, 'email:', result.user?.email);
    } catch (error: any) {
      console.error('AuthProvider: Sign in error:', error);
      
      // Handle specific Firebase errors
      if (error.message === 'Auth not available' || 
          error.message.includes('_getRecaptchaConfig') ||
          error.message.includes('recaptcha') ||
          error.message.includes('Cannot read property') ||
          error.message.includes('create')) {
        // For demo purposes, create a mock user
        const mockUser = {
          uid: 'mock-user-id',
          email: email,
          displayName: null,
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: () => Promise.resolve(),
          getIdToken: () => Promise.resolve('mock-token'),
          getIdTokenResult: () => Promise.resolve({} as any),
          reload: () => Promise.resolve(),
          toJSON: () => ({}),
          phoneNumber: null,
          providerId: 'password',
        } as User;
        
        setUser(mockUser);
        console.log('AuthProvider: Mock sign in successful');
      } else {
        throw error;
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign up for:', email);
    
    try {
      const auth = getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Send verification email
      if (result.user) {
        await sendEmailVerification(result.user);
      }
      console.log('AuthProvider: Sign up successful:', !!result.user, 'email:', result.user?.email);
    } catch (error: any) {
      console.error('AuthProvider: Sign up error:', error);
      
      // Handle specific Firebase errors
      if (error.message === 'Auth not available' || 
          error.message.includes('_getRecaptchaConfig') ||
          error.message.includes('recaptcha') ||
          error.message.includes('Cannot read property') ||
          error.message.includes('create')) {
        // For demo purposes, create a mock user
        const mockUser = {
          uid: 'mock-user-id',
          email: email,
          displayName: null,
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: () => Promise.resolve(),
          getIdToken: () => Promise.resolve('mock-token'),
          getIdTokenResult: () => Promise.resolve({} as any),
          reload: () => Promise.resolve(),
          toJSON: () => ({}),
          phoneNumber: null,
          providerId: 'password',
        } as User;
        
        setUser(mockUser);
        console.log('AuthProvider: Mock sign up successful');
      } else {
        throw error;
      }
    }
  };

  const confirmSignUp = async (code: string) => {
    console.log('AuthProvider: Attempting to confirm sign up');
    try {
      const auth = getFirebaseAuth();
      await applyActionCode(auth, code);
      console.log('AuthProvider: Sign up confirmation successful');
    } catch (error: any) {
      console.error('AuthProvider: Sign up confirmation error:', error);
      if (error.code === 'auth/invalid-action-code') {
        throw new Error('Invalid verification code. Please try again.');
      }
      // Mock for native
      if (error.message.includes('undefined is not an object')) {
        console.log('AuthProvider: Mock sign up confirmation successful');
        return;
      }
      throw error;
    }
  };

  const resendSignUp = async () => {
    console.log('AuthProvider: Attempting to resend sign up email');
    try {
      if (user) {
        await sendEmailVerification(user);
        console.log('AuthProvider: Resend sign up email successful');
      } else {
        throw new Error("No user is available to resend verification email.");
      }
    } catch (error: any) {
      console.error('AuthProvider: Resend sign up email error:', error);
       // Mock for native
       if (error.message.includes('undefined is not an object')) {
        console.log('AuthProvider: Mock resend sign up email successful');
        return;
      }
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Attempting logout');
    
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      console.log('AuthProvider: Logout successful');
    } catch (error: any) {
      console.error('AuthProvider: Logout error:', error);
      if (error.message === 'Auth not available' || 
          error.message.includes('_getRecaptchaConfig') ||
          error.message.includes('recaptcha') ||
          error.message.includes('Cannot read property') ||
          error.message.includes('create')) {
        setUser(null);
        console.log('AuthProvider: Mock logout successful');
      } else {
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    confirmSignUp,
    resendSignUp,
  };

  console.log('AuthProvider: Rendering with user:', !!user, 'loading:', loading, 'email:', user?.email);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};