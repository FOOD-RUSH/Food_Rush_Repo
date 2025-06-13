import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { TabCustomerParamList } from './types';
import HomeScreen from '@/app/(customer)/(tabs)/HomeScreen';
import ProfileScreen from '@/app/(customer)/(tabs)/ProfileScreen';
import CartScreen from '@/app/(customer)/(tabs)/CartScreen';
import NotificationScreen from '@/app/(customer)/(tabs)/NotificationScreen';
import { lightTheme } from '@/config/theme';

const Tab = createBottomTabNavigator<TabCustomerParamList>();

export default function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Notifcation':
              iconName = focused ? 'notifications' : 'notifications-outline';
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
      <Tab.Screen 
        name='Home' 
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarBadge: undefined, // Can show notification count
        }}
      />
      <Tab.Screen 
        name="Notifcation" 
        component={NotificationScreen}
        options={{
          title: 'Search',
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          title: 'Cart',
          // tabBarBadge: 3, // Example: show item count
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}