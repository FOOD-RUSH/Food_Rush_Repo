import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,

} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User } from '@/types/index';

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string, password: string, userType: 'customer' | 'restaurant'): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      
      // Verify user type matches
      if (userData.userType !== userType) {
        throw new Error(`Invalid account type. Expected ${userType}, got ${userData.userType}`);
      }

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        userType: userData.userType,
        profile: userData.profile,
        isEmailVerified: true,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signUp(
    email: string, 
    password: string, 
    userType: 'customer' | 'restaurant', 
    profile: any
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Send email verification removed for the moment


      // Create user profile in Firestore
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        userType,
        profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        userType,
        profile,
        isEmailVerified: true,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe();
        
        if (!firebaseUser) {
          resolve(null);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (!userDoc.exists()) {
            resolve(null);
            return;
          }

          const userData = userDoc.data();
          
          resolve({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            userType: userData.userType,
            profile: userData.profile,
            isEmailVerified: firebaseUser.emailVerified,
          });
        } catch (error) {
          resolve(null);
        }
      });
    });
  }

  async updateProfile(uid: string, profileUpdates: any): Promise<User> {
    try {
      const userRef = doc(db, 'users', uid);
      
      await updateDoc(userRef, {
        profile: profileUpdates,
        updatedAt: new Date().toISOString(),
      });

      // Get updated user data
      const updatedUser = await this.getCurrentUser();
      
      if (!updatedUser) {
        throw new Error('Failed to fetch updated user data');
      }

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      try {
        const user = await this.getCurrentUser();
        callback(user);
      } catch (error) {
        console.log(error)
        callback(null);
      }
    });
  }
}

export const authService = AuthService.getInstance();
