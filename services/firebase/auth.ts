import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updateProfile, User, sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/config/firebase";


export const authService = {
    //sign up with email and password
    signUp: async (email: string, password: string, displayName: string) => {
        const userCrendentails = await createUserWithEmailAndPassword(auth,email, password);
    
        await updateProfile (userCrendentails.user, {displayName})
    }, 
    signIn: async (email: string, password: string) => {
        const userCrendentails = await signInWithEmailAndPassword(auth, email, password);
        return userCrendentails.user;
    }, 
    signOut: async () => {
        await signOut(auth);
        //clears app state too
    },
    resetPassword: async (email: string) =>
    {
        await sendPasswordResetEmail(auth, email)
    },
     getCurrentUser: (): User | null => {
        return auth.currentUser;
    }

    }
   















    

