import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import LoginScreen from '@/app/screens/auth/LoginScreen';
import SignupScreen from '@/app/screens/auth/SignupScreen';
import ForgotPasswordScreen from '@/app/screens/auth/ForgotPasswordScreen';
import OTPScreen from '@/app/screens/auth/OTPScreen';
import ResetPasswordScreen from '@/app/screens/auth/ResetPasswordScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right', // iOS-style animation
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          // Custom design for login
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={SignupScreen}
        options={{
          title: 'Create Account',
          headerBackTitle: 'Back', // iOS specific
        }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
      <AuthStack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={{
          title: 'Verify Phone Number',
          headerBackTitle: 'Back', // iOS specific
        }}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'Reset Password',
          headerBackTitle: 'Back', // iOS specific
        }}
      />
    </AuthStack.Navigator>
  );
}
