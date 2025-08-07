import React, { useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './types';
import { navigationRef, handleDeepLink } from './navigationHelpers';
import { linking } from './linking';
import { Linking, Platform } from 'react-native';
// Import navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator, {
  CustomerHelpCenterStackScreen,
} from './CustomerNavigator';
import RestaurantNavigator from './RestaurantNavigator';

// // Import full-screen screens (no tabs)
import CheckOutScreen from '../screens/customer/home/CheckOutScreen';
import SearchScreen from '@/src/screens/customer/home/SearchScreen';
import { OnboardingSlides } from '@/src/utils/onboardingData';
import LoadingScreen from '../components/common/LoadingScreen';
import OnboardingScreen from '../components/onBoardingScreen';
import CartScreen from '../screens/customer/home/CartScreen';
import NotificationsScreen from '../screens/restaurant/profile/NotificationsScreen';
import FoodDetailsScreen from '../screens/customer/home/FoodDetailsScreen';
import RestaurantDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import EditProfileScreen from '../screens/customer/Profile/EditProfileScreen';
import FavoriteRestaurants from '../screens/customer/Profile/FavoriteRestaurants';
import PaymentScreen from '../screens/customer/Profile/PaymentScreen';
import LanguageScreen from '../screens/customer/Profile/LanguageScreen';
import { useAppStore } from '../stores/AppStore';
import { useAuthStore } from '../stores/AuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const _hasHydrated = useAppStore((state) => state._hasHydrated);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const isOnboardingComplete = useAppStore(
    (state) => state.isOnboardingComplete,
  );
  const userType = useAppStore((state) => state.userType);
  const setUserType = useAppStore((state) => state.setUserType);

  const handleOnboardingComplete = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      setUserType(selectedUserType);
      completeOnboarding();
    },
    [completeOnboarding, setUserType],
  );

  const handleLogin = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      setUserType(selectedUserType);
    },
    [setUserType],
  );

  const getInitialRouteName = useCallback((): keyof RootStackParamList => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      return 'CustomerApp';
    }
    
    switch (userType) {
      case 'customer':
        return 'CustomerApp';
      case 'restaurant':
        return 'RestaurantApp';
      default:
        return 'Auth';
    }
  }, [isAuthenticated, userType]);

  const handleNavigationReady = useCallback(() => {
    // Set up deep link listener
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  // Screen options for better performance and UX
  const screenOptions = {
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right' as const,
    // Optimize for performance
    lazy: true,
    unmountOnBlur: false,
    backgroundColor: 'white',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  };

  const modalOptions = {
    presentation: 'modal' as const,
    headerShown: true,
    headerTitleAlign: 'center' as const,
    animation: 'slide_from_bottom' as const,
  };

  const cardOptions = {
    presentation: 'card' as const,
    headerShown: true,
    headerTransparent: true,
    headerBackTitleVisible: false,
    animation: 'slide_from_right' as const,
  };

  if (!_hasHydrated) {
    return <LoadingScreen />;
  }

  if (!isOnboardingComplete) {
    return (
      <>
        <StatusBar style="auto" />
        <OnboardingScreen
          OnboardingSlides={OnboardingSlides}
          onComplete={handleOnboardingComplete}
          onLogin={handleLogin}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        fallback={<LoadingScreen />}
        onReady={handleNavigationReady}
      >
        <Stack.Navigator
          initialRouteName={getInitialRouteName()}
          screenOptions={screenOptions}
        >
          {/* Main App Navigators (with tabs) */}
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CustomerApp"
            component={CustomerNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RestaurantApp"
            component={RestaurantNavigator}
            options={{ headerShown: false }}
          />

          {/* FULL-SCREEN SCREENS (NO TABS) */}
          <Stack.Group screenOptions={modalOptions}>
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                headerTitle: 'Shopping Cart',
              }}
            />

            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerTitle: 'Notifications',
              }}
            />
            <Stack.Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
                gestureEnabled: true,
              }}
            />
          </Stack.Group>

          <Stack.Group screenOptions={cardOptions}>
            <Stack.Screen
              name="FoodDetails"
              component={FoodDetailsScreen}
              options={{
                headerTitle: '',
              }}
            />

            <Stack.Screen
              name="RestaurantDetails"
              component={RestaurantDetailScreen}
              options={{
                headerTitle: '',
              }}
            />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: 'card',
              headerShown: true,
              headerTitleAlign: 'center',
              animation: 'slide_from_left',
              sheetElevation: 0,
              headerShadowVisible: false,
              contentStyle: {
                marginBottom: -20,
              },
            }}
          >
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen
              name="Help"
              component={CustomerHelpCenterStackScreen}
            />
            <Stack.Screen
              name="FavoriteRestaurantScreen"
              component={FavoriteRestaurants}
            />
            <Stack.Screen name="PaymentMethods" component={PaymentScreen} />
            <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
          </Stack.Group>

          <Stack.Group
            screenOptions={{
              headerShown: true,
              headerTitleAlign: 'center' as const,
              animation: 'slide_from_right' as const,
            }}
          >
            <Stack.Screen
              name="Checkout"
              component={CheckOutScreen}
              options={{
                headerTitle: 'Checkout Order',
                gestureEnabled: true,
              }}
            />

            {/* 
            <Stack.Screen 
              name="OrderTracking" 
              component={OrderTrackingScreen}
              options={{
                headerTitle: 'Track Order',
                gestureEnabled: false, // Prevent swipe back during tracking
              }}
            />

*/}
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
