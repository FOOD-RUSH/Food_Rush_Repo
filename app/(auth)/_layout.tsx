import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login';
import Signup from './Signup';
import forgotPassword from './forgotPassword';
import resetPassword from './resetPassword';
import Otp from './Otp';

const Stack = createNativeStackNavigator();

const AuthLayout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginUser" component={LoginScreen} />
      <Stack.Screen name="SigninUser" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={forgotPassword} />
      <Stack.Screen name="ResetPasswordUser" component={resetPassword} />
      <Stack.Screen name="OTP" component={Otp} />
    </Stack.Navigator>
  );
};

export default AuthLayout;
