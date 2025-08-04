import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import {
  RestaurantAnalyticsStackParamList,
  RestaurantMenuStackParamList,
  RestaurantOrdersStackParamList,
  RestaurantTabParamList,
  RestaurantProfileStackParamList,
} from './types';

// Import screens
import ProfileScreen from '../screens/restaurant/profile/ProfileScreen';
import OrderScreen from '../screens/restaurant/orders/OrderScreen';
import MenuScreen from '../screens/restaurant/menu/MenuScreen';
import OrderHistoryScreen from '../screens/restaurant/orders/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/restaurant/orders/OrderDetailsScreen';
import AnalyticsScreen from '../screens/restaurant/analytics/AnalyticsScreen';

// Create navigators
const RestaurantTab = createBottomTabNavigator<RestaurantTabParamList>();
const RestaurantOrdersStack = createNativeStackNavigator<RestaurantOrdersStackParamList>();
const RestaurantMenuStack = createNativeStackNavigator<RestaurantMenuStackParamList>();
const RestaurantAnalyticsStack = createNativeStackNavigator<RestaurantAnalyticsStackParamList>();
const RestaurantProfileStack = createNativeStackNavigator<RestaurantProfileStackParamList>();

// Stack Screen Components
function RestaurantOrdersStackScreen() {
  return (
    <RestaurantOrdersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <RestaurantOrdersStack.Screen
        name="OrdersScreen"
        component={OrderScreen}
        options={{ title: 'Orders' }}
      />
      <RestaurantOrdersStack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={({ route }) => ({
          title: `Order #${route.params.orderId.slice(-6)}`, // Show last 6 chars of order ID
        })}
      />
      <RestaurantOrdersStack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'Order History' }}
      />
      {/* 
      <RestaurantOrdersStack.Screen
        name="LiveOrders"
        component={LiveOrdersScreen}
        options={{ title: 'Live Orders' }}
      />
      */}
    </RestaurantOrdersStack.Navigator>
  );
}

function RestaurantMenuStackScreen() {
  return (
    <RestaurantMenuStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <RestaurantMenuStack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{ title: 'Menu' }}
      />
      {/* Add other menu screens as they're implemented */}
      {/*
      <RestaurantMenuStack.Screen name="AddMenuItem" component={AddMenuItemScreen} />
      <RestaurantMenuStack.Screen name="EditMenuItem" component={EditMenuItemScreen} />
      <RestaurantMenuStack.Screen name="Categories" component={CategoriesScreen} />
      <RestaurantMenuStack.Screen name="AddCategory" component={AddCategoryScreen} />
      <RestaurantMenuStack.Screen name="EditCategory" component={EditCategoryScreen} />
      <RestaurantMenuStack.Screen name="MenuSettings" component={MenuSettingsScreen} />
      */}
    </RestaurantMenuStack.Navigator>
  );
}

function RestaurantAnalyticsStackScreen() {
  return (
    <RestaurantAnalyticsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <RestaurantAnalyticsStack.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      {/* Add other analytics screens as they're implemented */}
      {/*
      <RestaurantAnalyticsStack.Screen name="SalesReport" component={SalesReportScreen} />
      <RestaurantAnalyticsStack.Screen name="CustomerInsights" component={CustomerInsightsScreen} />
      <RestaurantAnalyticsStack.Screen name="PopularItems" component={PopularItemsScreen} />
      <RestaurantAnalyticsStack.Screen name="PerformanceMetrics" component={PerformanceMetricsScreen} />
      */}
    </RestaurantAnalyticsStack.Navigator>
  );
}

function RestaurantProfileStackScreen() {
  return (
    <RestaurantProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <RestaurantProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      {/* Add other profile screens as they're implemented */}
      {/*
      <RestaurantProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <RestaurantProfileStack.Screen name="RestaurantSettings" component={RestaurantSettingsScreen} />
      <RestaurantProfileStack.Screen name="BusinessHours" component={BusinessHoursScreen} />
      <RestaurantProfileStack.Screen name="DeliverySettings" component={DeliverySettingsScreen} />
      <RestaurantProfileStack.Screen name="Notifications" component={NotificationsScreen} />
      <RestaurantProfileStack.Screen name="Help" component={HelpScreen} />
      <RestaurantProfileStack.Screen name="BusinessSettings" component={BusinessSettingsScreen} />
      <RestaurantProfileStack.Screen name="PayoutSettings" component={PayoutSettingsScreen} />
      */}
    </RestaurantProfileStack.Navigator>
  );
}

export default function RestaurantNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <RestaurantTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Orders':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Menu':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          height: (Platform.OS === 'ios' ? 90 : 70) + insets.bottom,
          paddingBottom: (Platform.OS === 'ios' ? 25 : 10) + insets.bottom,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <RestaurantTab.Screen
        name="Orders"
        component={RestaurantOrdersStackScreen}
        options={{
          tabBarLabel: 'Orders',
        }}
      />
      
      <RestaurantTab.Screen 
        name="Menu" 
        component={RestaurantMenuStackScreen}
        options={{
          tabBarLabel: 'Menu',
        }}
      />
      
      <RestaurantTab.Screen
        name="Analytics"
        component={RestaurantAnalyticsStackScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      
      <RestaurantTab.Screen
        name="Profile"
        component={RestaurantProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </RestaurantTab.Navigator>
  );
}
