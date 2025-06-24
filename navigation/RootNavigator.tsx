import React, { useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {RootStackParamList } from './types';
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
const RootStack = createNativeStackNavigator<RootStackParamList>();


export default function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>()

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
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}> 
  {!isAuthenticated ? (
          // Show login/signup screens
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.userType === 'customer' ? (
          // Show customer app
          <RootStack.Screen name="CustomerApp" component={CustomerNavigator} />
        ) 
        : (
          // Show restaurant app
          <RootStack.Screen name="RestaurantApp" component={RestaurantNavigator} />
          // to fix
        
        )
        }
    </RootStack.Navigator>
  );
}



