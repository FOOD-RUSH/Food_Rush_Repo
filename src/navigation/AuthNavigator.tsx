import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from './types';

// Import from AppStore (where RootNavigator saves userType)
import { useAppUserType, useAppStore } from '../stores/customerStores/AppStore';
import { useIsAuthenticated, useAuthUser } from '../stores/customerStores/AuthStore';

// Customer auth
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Restaurant auth
import RestaurantLoginScreen from '../screens/restaurant/auth/LoginScreen';
import RestaurantSignupScreen from '../screens/restaurant/auth/SignupScreen';
import AwaitingApprovalScreen from '../screens/restaurant/auth/AwaitingApprovalScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Component for switching user types
const UserTypeSwitcher: React.FC = () => {
  const navigation = useNavigation();
  const userType = useAppUserType();
  const { setUserType } = useAppStore();
  
  const switchUserType = () => {
    // Switch to the opposite user type
    setUserType(userType === 'restaurant' ? 'customer' : 'restaurant');
    // @ts-ignore
    navigation.navigate('UserTypeSelection');
  };
  
  return (
    <TouchableOpacity 
      onPress={switchUserType}
      style={{ 
        marginRight: 16, 
        paddingHorizontal: 12, 
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F0F0F0'
      }}
    >
      <Text style={{ 
        fontSize: 12, 
        color: '#666',
        fontWeight: '500'
      }}>
        {userType === 'restaurant' ? 'Switch to Customer' : 'Switch to Restaurant'}
      </Text>
    </TouchableOpacity>
  );
};

const AuthNavigator: React.FC = () => {
  const userType = useAppUserType();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();

  console.log('AuthNavigator - userType from store:', userType);
  console.log('AuthNavigator - isAuthenticated:', isAuthenticated);

  // Check if restaurant is pending approval
  const isPendingRestaurant =
    isAuthenticated &&
    userType === 'restaurant' &&
    user?.role === 'restaurant' &&
    (
      user?.verificationStatus === 'PENDING_VERIFICATION' ||
      user?.verificationStatus === 'PENDING' ||
      user?.restaurant?.verificationStatus === 'PENDING_VERIFICATION' ||
      user?.restaurant?.verificationStatus === 'PENDING'
    );

  // Pick login/signup screens based on userType
  const LoginComponent = userType === 'restaurant' ? RestaurantLoginScreen : LoginScreen;
  const SignupComponent = userType === 'restaurant' ? RestaurantSignupScreen : SignupScreen;

  console.log('AuthNavigator - Using login component for:', userType);

  // Determine initial route
  const initialRouteName = isPendingRestaurant ? 'AwaitingApproval' : 'SignIn';

  return (
    <AuthStack.Navigator
      screenOptions={{ 
        headerShown: true, // Show header to display user type switcher
        gestureEnabled: true, 
        animation: 'slide_from_right',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#333333',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
      initialRouteName={initialRouteName}
    >
      <AuthStack.Screen 
        name="SignIn" 
        component={LoginComponent}
        options={{
          title: userType === 'restaurant' ? 'Restaurant Login' : 'Customer Login',
          headerRight: () => <UserTypeSwitcher />
        }}
      />
      <AuthStack.Screen 
        name="SignUp" 
        component={SignupComponent}
        options={{
          title: userType === 'restaurant' ? 'Restaurant Signup' : 'Customer Signup',
          headerRight: () => <UserTypeSwitcher />
        }}
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
      <AuthStack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{ title: 'Set New Password' }}
      />
      <AuthStack.Screen 
        name="OTPVerification" 
        component={OTPScreen} 
        options={{ 
          gestureEnabled: false,
          title: 'Verify Code'
        }} 
      />
      <AuthStack.Screen 
        name="AwaitingApproval" 
        component={AwaitingApprovalScreen}
        options={{ 
          title: 'Pending Approval',
          headerLeft: () => null, // Remove back button for pending approval
          gestureEnabled: false
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;