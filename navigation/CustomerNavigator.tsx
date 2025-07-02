import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CustomerHomeStackParamList,
  CustomerSearchStackParamList,
  CustomerProfileStackParamList,
  CustomerTabParamList,
  CustomerOrderStackParamList,
} from './types';
import HomeScreen from '@/app/screens/customer/home/HomeScreen';
import FoodDetailScreen from '@/app/screens/customer/home/FoodDetailScreen';
import FavoritesScreen from '@/app/screens/customer/Profile/FavoritesScreen';
import ProfileScreen from '@/app/screens/customer/Profile/ProfileScreen';
import SearchScreen from '@/app/screens/customer/search/SearchScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// order is top bar stack Navigator

import { Platform } from 'react-native';
import { lightTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import ProfileHomeScreen from '../app/screens/customer/Profile/ProfileHomeScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompletedOrderScreen from '@/app/screens/customer/Order/CompletedOrderScreen';
import ActiveOrderScreen from '@/app/screens/customer/Order/ActiveOrderScreen';

const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const CustomerHomeStack =
  createNativeStackNavigator<CustomerHomeStackParamList>();
const CustomerOrderStack =
  createMaterialTopTabNavigator<CustomerOrderStackParamList>();
const CustomerProfileStack =
  createNativeStackNavigator<CustomerProfileStackParamList>();
const CustomerSearchStack =
  createNativeStackNavigator<CustomerSearchStackParamList>();

//  Stack Screens for Customer Home
function CustomerHomeStackScreen() {
  return (
    <CustomerHomeStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerHomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <CustomerHomeStack.Screen
        name="FoodDetails"
        component={FoodDetailScreen}
      />
      {/* TODO: to add more files */}
    </CustomerHomeStack.Navigator>
  );
}

// Stack Screens for Customer Orders

function CustomerOrderStackScreen() {
  return (
    <CustomerOrderStack.Navigator initialRouteName="CompletedOrdersScreen">
      <CustomerOrderStack.Screen
        name="CompletedOrdersScreen"
        component={CompletedOrderScreen}
      />
      <CustomerOrderStack.Screen
        name="PendingOrdersScreen"
        component={ActiveOrderScreen}
      />

      {/* Add more screens related to cart if needed */}
    </CustomerOrderStack.Navigator>
  );
}
// Stack Screens for Customer Profile

function CustomerProfileStackScreen() {
  return (
    <CustomerProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <CustomerProfileStack.Screen
        name="FavoriteRestaurantScreen"
        component={FavoritesScreen}
      />
      <CustomerProfileStack.Screen
        name="ProfileHome"
        component={ProfileHomeScreen}
      />
      {/* Add more screens related to profile if needed */}
    </CustomerProfileStack.Navigator>
  );
}

// Stack Screens for Customer Search

function CustomerSearchStackScreen() {
  return (
    <CustomerSearchStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerSearchStack.Screen
        name="SearchScreen"
        component={SearchScreen}
      />
      {/* Add more screens related to search if needed */}
    </CustomerSearchStack.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Orders':
              iconName = focused ? 'bookmark' : 'bookmark-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: lightTheme.colors.primary,
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      })}
    >
      <CustomerTab.Screen
        name="Home"
        component={CustomerHomeStackScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <CustomerTab.Screen
        name="Search"
        component={CustomerSearchStackScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <CustomerTab.Screen
        name="Orders"
        component={CustomerOrderStackScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <CustomerTab.Screen
        name="Profile"
        component={CustomerProfileStackScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </CustomerTab.Navigator>
  );
}
