import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import Login from '../screens/auth/login';
import Signup from '../screens/auth/signup';
import ResetPasswordScreen from '../screens/auth/reset-password';
import Otp from '../screens/auth/otp';
import ForgotPassword from '../screens/auth/forgot-password';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false , gestureEnabled: true}}
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
