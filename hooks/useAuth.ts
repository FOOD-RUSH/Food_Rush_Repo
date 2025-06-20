import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { signInUser, signUpUser, signOutUser, updateUserProfile } from '../store/slices/authSlice';
import { CustomerProfile, RestaurantProfile } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const signIn = (email: string, password: string, userType: 'customer' | 'restaurant') => {
    return dispatch(signInUser({ email, password, userType }));
  };

  const signUp = (email: string, password: string, userType: 'customer' | 'restaurant', profile: CustomerProfile  | RestaurantProfile) => {
    return dispatch(signUpUser({ email, password, userType, profile }));
  };

  const signOut = () => {
    return dispatch(signOutUser());
  };

  const updateProfile = (profile: CustomerProfile | RestaurantProfile ) => {
    return dispatch(updateUserProfile(profile));
  };

  const canAccess = (allowedUserTypes: ('customer' | 'restaurant')[]): boolean => {
    return auth.isAuthenticated && auth.user ? allowedUserTypes.includes(auth.user.userType) : false;
  };

  const isCustomer = (): boolean => {
    return auth.user?.userType === 'customer';
  };

  const isRestaurant = (): boolean => {
    return auth.user?.userType === 'restaurant';
  };

  return {
    ...auth,
    signIn,
    signUp,
    signOut,
    updateProfile,
    canAccess,
    isCustomer,
    isRestaurant,
  };
};