import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerStackParamList } from './types';
import CustomerTabNavigator from './CustomerTabNavigator';
import SearchScreen from '@/app/(customer)/SearchScreen';
import FavoritesScreen from '@/app/(customer)/FavoritesScreen';
import FoodDetailScreen from '@/app/(customer)/FoodDetailScreen';
import OrderHistoryScreen from '@/app/(customer)/(tabs)/OrderHistoryScreen';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Tabs" 
        component={CustomerTabNavigator}
        options={{
          headerShown: false, // Tabs will show their own headers
        }}
      />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options= {{
          title: 'Your Favorites'
        }}
      />
      <Stack.Screen 
        name="FoodDetails" 
        component={FoodDetailScreen}
        options={{
          title: 'Food Details',
          presentation: 'modal', // iOS modal presentation
          gestureEnabled: false, // Prevent swipe to dismiss
        }}
      />
      <Stack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
        }}
      />
       <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          title: 'Search Food',
        }}
      />
    </Stack.Navigator>
  );
}