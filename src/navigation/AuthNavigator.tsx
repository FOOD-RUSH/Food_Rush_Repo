import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
      initialRouteName="SignIn"
    >
      <AuthStack.Screen
        name="SignIn"
        component={LoginScreen}
        options={{
          gestureEnabled: true,
        }}
      />

      <AuthStack.Screen
        name="SignUp"
        component={SignupScreen}
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
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;

