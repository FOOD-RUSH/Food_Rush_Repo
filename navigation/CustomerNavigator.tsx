import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CustomerHomeStackParamList,
  CustomerCartStackParamList,
  CustomerProfileStackParamList,
  CustomerTabsParamList,
  CustomerSearchParamList,
} from './types';
import HomeScreen from '@/app/screens/customer/home/HomeScreen';
import FoodDetailScreen from '@/app/screens/customer/home/FoodDetailScreen';
import CartScreen from '@/app/screens/customer/home/CartScreen';
import FavoritesScreen from '@/app/screens/customer/Profile/FavoritesScreen';
import OrderHistoryScreen from '@/app/screens/customer/Profile/OrderHistoryScreen';
import ProfileScreen from '@/app/screens/customer/Profile/ProfileScreen';
import SearchScreen from '@/app/screens/customer/search/SearchScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { lightTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';

const CustomerTab = createBottomTabNavigator<CustomerTabsParamList>();
const CustomerHomeStack =
  createNativeStackNavigator<CustomerHomeStackParamList>();
const CustomerCartStack =
  createNativeStackNavigator<CustomerCartStackParamList>();
const CustomerProfileStack =
  createNativeStackNavigator<CustomerProfileStackParamList>();
const CustomerSearchStack =
  createNativeStackNavigator<CustomerSearchParamList>();

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

// Stack Screens for Customer Cart

function CustomerCartStackScreen() {
  return (
    <CustomerCartStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerCartStack.Screen name="CartScreen" component={CartScreen} />
      {/* Add more screens related to cart if needed */}
    </CustomerCartStack.Navigator>
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
        name="Favorites"
        component={FavoritesScreen}
      />
      <CustomerProfileStack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
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

export default function CustomerNavigator ()
{
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
            case 'Cart':
              iconName = focused ? 'bag' : 'bag-outline';
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
        headerTitleAlign: 'center'
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
        name="Cart"
        component={CustomerCartStackScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <CustomerTab.Screen
        name="Profile"
        component={CustomerProfileStackScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </CustomerTab.Navigator>
  )
  
}