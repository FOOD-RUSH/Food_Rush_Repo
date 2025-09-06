import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { useSelectedUserType, useIsAuthenticated, useAuthUser } from '../stores/customerStores/AuthStore';

// Import customer screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Import restaurant screens
import RestaurantLoginScreen from '../screens/restaurant/auth/LoginScreen';
import RestaurantSignupScreen from '../screens/restaurant/auth/SignupScreen';
import AwaitingApprovalScreen from '../screens/restaurant/auth/AwaitingApprovalScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const selectedUserType = useSelectedUserType();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();

  // Check if user is authenticated restaurant with pending approval
  const isPendingRestaurant = isAuthenticated &&
    user?.role === 'restaurant' &&
    (user?.verificationStatus === 'PENDING_VERIFICATION' ||
     user?.verificationStatus === 'PENDING' ||
     user?.restaurant?.verificationStatus === 'PENDING_VERIFICATION' ||
     user?.restaurant?.verificationStatus === 'PENDING');

  // Use restaurant screens if user type is restaurant, otherwise use customer screens
  const LoginComponent = selectedUserType === 'restaurant' ? RestaurantLoginScreen : LoginScreen;
  const SignupComponent = selectedUserType === 'restaurant' ? RestaurantSignupScreen : SignupScreen;

  // Set initial route based on authentication status
  const initialRouteName = isPendingRestaurant ? 'AwaitingApproval' : 'SignIn';

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
      initialRouteName={initialRouteName}
    >
      <AuthStack.Screen
        name="SignIn"
        component={LoginComponent}
        options={{
          gestureEnabled: true,
        }}
      />

      <AuthStack.Screen
        name="SignUp"
        component={SignupComponent}
        options={{
          gestureEnabled: true,
        }}
      />

      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          gestureEnabled: true,
        }}
      />

      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          gestureEnabled: true,
        }}
      />

      <AuthStack.Screen
        name="OTPVerification"
        component={OTPScreen}
        options={{
          gestureEnabled: false, // Prevent going back during OTP verification
        }}
      />

      <AuthStack.Screen
        name="AwaitingApproval"
        component={AwaitingApprovalScreen}
        options={{
          gestureEnabled: true,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
