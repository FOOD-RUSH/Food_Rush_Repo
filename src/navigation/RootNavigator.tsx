import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { navigationRef } from './navigationHelpers';
import { linking } from './linking';
// Import navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import RestaurantNavigator from './RestaurantNavigator';
// Import screens
import OnboardingScreen from '@/src/components/onBoardingScreen';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import { OnboardingSlides } from '@/src/utils/onboardingData';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant' | null>(
    null,
  );

  useEffect(() => {
    // Simulate checking async storage or authentication state
    const checkAppState = async () => {
      try {
        // Check if onboarding is complete
        // const onboardingStatus = await AsyncStorage.getItem('onboardingComplete');
        // const authStatus = await AsyncStorage.getItem('isAuthenticated');
        // const storedUserType = await AsyncStorage.getItem('userType');

        // For now, using local state - replace with actual storage logic
        setIsOnboardingComplete(false); // Set to true if onboarding is complete
        setIsAuthenticated(false); // Set to true if user is authenticated
        setUserType(null); // Set to 'customer' or 'restaurant' based on stored data
      } catch (error) {
        console.error('Error checking app state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAppState();
  }, []);

  const handleOnboardingComplete = (
    selectedUserType: 'customer' | 'restaurant',
  ) => {
    console.log('Onboarding completed for user type:', selectedUserType);
    setUserType(selectedUserType);
    setIsOnboardingComplete(true);
    // Save to AsyncStorage
    // AsyncStorage.setItem('onboardingComplete', 'true');
    // AsyncStorage.setItem('userType', selectedUserType);
  };

  const handleLogin = () => {
    console.log('Login pressed from onboarding');
    // Navigate to auth screen - set onboarding complete first
    setIsOnboardingComplete(true);
    // The navigation will handle showing the Auth screen
  };

  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) {
      return 'Auth';
    }
    return userType === 'restaurant' ? 'RestaurantApp' : 'CustomerApp';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isOnboardingComplete) {
    return (
      <OnboardingScreen
        OnboardingSlides={OnboardingSlides}
        onComplete={handleOnboardingComplete}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<LoadingScreen />}
    >
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
        <Stack.Screen name="RestaurantApp" component={RestaurantNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
