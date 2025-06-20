import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RestaurantStackParamList } from './types';
import RestaurantTabNavigator from './RestaurantTabNavigator';
import FoodDetailsScreen from '@/app/(restaurant)/FoodDetailsScreen';
import AddFoodScreen from '@/app/(restaurant)/AddFoodScreen';
import EditFoodScreen from '@/app/(restaurant)/EditFoodScreen';
import OrderDetailsScreen from '@/app/(restaurant)/OrderDetailsScreen';
import OrderHistoryScreen from '@/app/(restaurant)/OrderHistoryScreen';
import NotificationsScreen from '@/app/(restaurant)/NotificationsScreen';
const Stack = createNativeStackNavigator<RestaurantStackParamList>();

const RestaurantNavigator = () => {
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
      name="RestaurantTabs"
      component={RestaurantTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
    <Stack.Screen name="AddFood" component={AddFoodScreen} />
    <Stack.Screen name="EditFood" component={EditFoodScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
  )
}

export default RestaurantNavigator