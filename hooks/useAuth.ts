import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { signInUser, signUpUser, signOutUser } from '../store/slices/authSlice';
// import { CustomerProfile, RestaurantProfile } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const signIn = (email: string, password: string) => {
    return dispatch(signInUser({ email, password }));
  };

  const signUp = (email: string, password: string) => {
    return dispatch(signUpUser({ email, password }));
  };

  const signOut = () => {
    return dispatch(signOutUser());
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
    canAccess,
    isCustomer,
    isRestaurant,
  };
};