import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import from AuthStore
import {
  useIsAuthenticated,
  useAuthUser,
} from '../stores/AuthStore';

// Customer auth
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Restaurant auth
import RestaurantLoginScreen from '../screens/restaurant/auth/LoginScreen';
import RestaurantSignupStep1 from '../screens/restaurant/auth/RestaurantSignupStep1';
import RestaurantSignupStep2 from '../screens/restaurant/auth/RestaurantSignupStep2';
import AwaitingApprovalScreen from '../screens/restaurant/auth/AwaitingApprovalScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// UserTypeSwitcher component removed - screens will handle their own navigation

interface AuthNavigatorProps {
  userType?: 'customer' | 'restaurant';
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({
  userType = 'customer',
}) => {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();

  // Check if restaurant is pending approval
  const isPendingRestaurant =
    isAuthenticated &&
    userType === 'restaurant' &&
    user?.role === 'restaurant' &&
    (user?.verificationStatus === 'PENDING_VERIFICATION' ||
      user?.verificationStatus === 'PENDING' ||
      user?.restaurant?.verificationStatus === 'PENDING_VERIFICATION' ||
      user?.restaurant?.verificationStatus === 'PENDING');

  // Pick login/signup screens based on userType
  const LoginComponent =
    userType === 'restaurant' ? RestaurantLoginScreen : LoginScreen;
  const SignupComponent =
    userType === 'restaurant' ? RestaurantSignupStep1 : SignupScreen;

  // Determine initial route
  const initialRouteName = isPendingRestaurant ? 'AwaitingApproval' : 'SignIn';

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false, // Remove default headers
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
      initialRouteName={initialRouteName}
    >
      <AuthStack.Screen
        name="SignIn"
        component={LoginComponent}
        options={{
          headerShown: false, // Let screens handle their own headers
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignupComponent}
        options={{
          headerShown: false, // Let screens handle their own headers
        }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false, // Let screens handle their own headers
        }}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: false, // Let screens handle their own headers
        }}
      />
      <AuthStack.Screen
        name="OTPVerification"
        component={OTPScreen}
        options={{
          gestureEnabled: false,
          headerShown: false, // Let screens handle their own headers
        }}
      />
      <AuthStack.Screen
        name="RestaurantSignupStep1"
        component={RestaurantSignupStep1}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="RestaurantSignupStep2"
        component={RestaurantSignupStep2}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="AwaitingApproval"
        component={AwaitingApprovalScreen}
        options={{
          headerShown: false, // Let screens handle their own headers
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
