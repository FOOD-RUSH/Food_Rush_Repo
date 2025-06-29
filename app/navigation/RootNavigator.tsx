import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import OnboardingScreen from '@/components/onBoardingScreen';
import { OnboardingSlides } from '@/utils/onboardingData';
import { setOnboardingComplete } from '@/store/slices/appSlice';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigationHelpers';
import { linking } from '@/utils/linking';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import RestaurantNavigator from './RestaurantNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator: React.FC = () => {
  // add usertype in your setup: customer | user to vary the screen to be shown
  const { user, loading } = useAuth();
  const isAuthenticated = false;
  const isOnboardingComplete = useSelector(
    (state: RootState) => state.app.isOnboardingComplete,
  );
  const dispatch = useDispatch<AppDispatch>();

  if (loading) {
    console.log('USER STATE LOADING ....');
    return <LoadingScreen />;
  }

  if (!isOnboardingComplete) {
    // If onboarding is not complete, show onboarding screens
    return (
      <OnboardingScreen
        OnboardingSlides={OnboardingSlides}
        onComplete={(userType) => {
          // Handle completion with selected user type
          console.log('Onboarding completed with user type:', userType);
          // Dispatch action to set onboarding complete
          dispatch(setOnboardingComplete(true));
          // Navigate to appropriate screen based on userType
        }}
        onLogin={() => {
          // Handle login navigation
          console.log('Navigate to login screen');
        }}
      />
    );
  }

  const getIntialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) return 'Auth';
    // if (user?.userType === 'customer') return 'CustomerApp';
    // if (user?.userType === 'restaurant') return 'RestaurantApp';
    if (user) return 'CustomerApp';
    return 'Auth';
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<LoadingScreen />}
    >
      <Stack.Navigator
        initialRouteName={getIntialRouteName()}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
        <Stack.Screen name="Auth" component={RestaurantNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
