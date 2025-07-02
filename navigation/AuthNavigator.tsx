import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import Login from '../app/screens/auth/login';
import Signup from '../app/screens/auth/signup';
import ResetPasswordScreen from '../app/screens/auth/reset-password';
import Otp from '../app/screens/auth/otp';
import ForgotPassword from '../app/screens/auth/forgot-password';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="SignIn"
    >
      <AuthStack.Screen name="SignIn" component={Login} />
      <AuthStack.Screen name="SignUp" component={Signup} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="OTPVerification" component={Otp} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
