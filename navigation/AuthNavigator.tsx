import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import  LoginScreen from '@/app/(auth)/LoginScreen';
// import  RegisterScreen from '@/app/(auth)';
import SignupScreen from '@/app/(auth)/SignupScreen';
import ForgotPasswordScreen from '@/app/(auth)/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
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
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          headerShown: false, // Custom design for login
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          title: 'Create Account',
          headerBackTitle: 'Back', // iOS specific
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack.Navigator>
  );
}