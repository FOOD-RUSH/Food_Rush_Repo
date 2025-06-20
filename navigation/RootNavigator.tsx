import React, { useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { hydrateAuth } from '@/store/slices/authSlice';
import RestaurantNavigator from './RestaurantNavigator';
import LoadingScreen from '@/components/common/LoadingScreen';
import OnboardingScreen from '@/components/onBoardingScreen';
import { OnboardingSlides } from '@/app/data/onboardingData';
import { setOnboardingComplete } from '@/store/slices/appSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>()
  // problem

  const {user, isAuthenticated, hasHydrated} = useSelector((state: RootState) => state.auth)
  const isOnboardingComplete = useSelector((state: RootState) => state.app.isOnboardingComplete);

 
  useEffect(()=> {
    dispatch(hydrateAuth());
  }, [dispatch])
  if (!hasHydrated)
  {
   return  <LoadingScreen />
  }
  
  if (!isOnboardingComplete) {
    // If onboarding is not complete, show onboarding screens 
    return (
      <OnboardingScreen
        OnboardingSlides={OnboardingSlides}
        onComplete={() => dispatch(setOnboardingComplete(true))}
      />
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
  {!isAuthenticated ? (
          // Show login/signup screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.userType === 'customer' ? (
          // Show customer app
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        ) 
        : (
          // Show restaurant app
          <Stack.Screen name="Restaurant" component={RestaurantNavigator} />
          // to fix
        
        )
        }
    </Stack.Navigator>
  );
}


