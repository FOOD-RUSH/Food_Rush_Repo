import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

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
import ConfirmOrder from '../screens/restaurant/orders/ConfirmOrder';
import RejectOrder from '../screens/restaurant/orders/RejectOrder';
import { Platform } from 'react-native';

import { AnalyticsScreen } from '../screens/restaurant/analytics/AnalyticsScreen';
import { DashboardScreen } from '../screens/restaurant/analytics/DashboardScreen';
import ProfileEditScreen from '../screens/restaurant/profile/ProfileEditScreen';
import NotificationScreen from '../screens/restaurant/profile/NotificationScreen';
import AccountSettingsScreen from '../screens/restaurant/profile/AccountSettingsScreen';
import SupportScreen from '../screens/restaurant/profile/SupportScreen';
import AboutScreen from '../screens/restaurant/profile/AboutScreen';
import RestaurantSettingsScreen from '../screens/restaurant/profile/RestaurantSettingsScreen';

// Import the menu-related screens
import { AddFoodScreen } from '../screens/restaurant/menu/AddFoodScreen';
import { EditFoodScreen } from '../screens/restaurant/menu/EditFoodScreen';
import FoodCategoriesScreen from '../screens/restaurant/menu/FoodCategoriesScreen';
import MenuListScreen from '../screens/restaurant/menu/MenuListScreen';
import MenuSettingsScreen from '../screens/restaurant/menu/MenuSettingsScreen';
import AddCategoryScreen from '../screens/restaurant/menu/AddCategoryScreen';

// Create navigators
const RestaurantTab = createBottomTabNavigator<RestaurantTabParamList>();
const RestaurantOrdersStack =
  createNativeStackNavigator<RestaurantOrdersStackParamList>();
const RestaurantMenuStack =
  createNativeStackNavigator<RestaurantMenuStackParamList>();
const RestaurantAnalyticsStack =
  createNativeStackNavigator<RestaurantAnalyticsStackParamList>();
const RestaurantProfileStack =
  createNativeStackNavigator<RestaurantProfileStackParamList>();

// Stack Screen Components
function RestaurantOrdersStackScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  return (
    <RestaurantOrdersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
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
        options={{ title: 'Order Details' }}
      />

      {/* Added screens for Confirm / Reject flows */}
      <RestaurantOrdersStack.Screen
        name="ConfirmOrder"
        component={ConfirmOrder}
        options={{
          title: 'Confirm Order',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <RestaurantOrdersStack.Screen
        name="RejectOrder"
        component={RejectOrder}
        options={{
          title: 'Reject Order',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      <RestaurantOrdersStack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'Order History' }}
      />
    </RestaurantOrdersStack.Navigator>
  );
}

function RestaurantMenuStackScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  return (
    <RestaurantMenuStack.Navigator
      screenOptions={{
        headerShown: false, // Hide default headers since screens have custom headers
      }}
    >
      <RestaurantMenuStack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{ title: 'Menu Management' }}
      />
      <RestaurantMenuStack.Screen
        name="AddMenuItem"
        component={AddFoodScreen}
        options={{
          title: 'Add Menu Item',
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <RestaurantMenuStack.Screen
        name="EditMenuItem"
        component={EditFoodScreen}
        options={{
          title: 'Edit Menu Item',
          presentation: 'modal',
        }}
      />
      <RestaurantMenuStack.Screen
        name="Categories"
        component={FoodCategoriesScreen}
        options={{
          title: 'Menu Categories',
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <RestaurantMenuStack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{
          title: 'Add Category',
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <RestaurantMenuStack.Screen
        name="EditCategory"
        component={FoodCategoriesScreen} // Can reuse or create EditCategoryScreen
        options={{
          title: 'Edit Category',
          presentation: 'modal',
        }}
      />
      <RestaurantMenuStack.Screen
        name="MenuSettings"
        component={MenuSettingsScreen}
        options={{
          title: 'Menu Settings',
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <RestaurantMenuStack.Screen
        name="MenuList"
        component={MenuListScreen}
        options={{
          title: 'Menu Items',
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </RestaurantMenuStack.Navigator>
  );
}

function RestaurantAnalyticsStackScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  return (
    <RestaurantAnalyticsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <RestaurantAnalyticsStack.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{ title: t('analytics') }}
      />
      <RestaurantAnalyticsStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      {/* <RestaurantAnalyticsStack.Screen name="SalesReport" component={SalesReportScreen} /> */}
    </RestaurantAnalyticsStack.Navigator>
  );
}

function RestaurantProfileStackScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  return (
    <RestaurantProfileStack.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for a cleaner look since the edit screen has its own header
      }}
    >
      <RestaurantProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: t('profile') }}
      />
      <RestaurantProfileStack.Screen
        name="ProfileEditProfile"
        component={ProfileEditScreen}
        options={{
          presentation: 'modal', // Modal style for a nice UX
          animation: 'slide_from_bottom', // Smooth animation
        }}
      />
      <RestaurantProfileStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ title: 'Notifications', animation: 'slide_from_right' }}
      />
      <RestaurantProfileStack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{ title: 'Account & Settings', animation: 'slide_from_right' }}
      />
      <RestaurantProfileStack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'Support', animation: 'slide_from_right' }}
      />
      <RestaurantProfileStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About', animation: 'slide_from_right' }}
      />
      <RestaurantProfileStack.Screen
        name="RestaurantSettings"
        component={RestaurantSettingsScreen}
        options={{
          title: 'Restaurant Settings',
          animation: 'slide_from_right',
        }}
      />
    </RestaurantProfileStack.Navigator>
  );
}

export default function RestaurantNavigator() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryContainer,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.background,
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
          tabBarLabel: t('orders'),
        }}
      />

      <RestaurantTab.Screen
        name="Menu"
        component={RestaurantMenuStackScreen}
        options={{
          tabBarLabel: t('menu'),
        }}
      />

      <RestaurantTab.Screen
        name="Analytics"
        component={RestaurantAnalyticsStackScreen}
        options={{
          tabBarLabel: t('analytics'),
        }}
      />

      <RestaurantTab.Screen
        name="Profile"
        component={RestaurantProfileStackScreen}
        options={{
          tabBarLabel: t('profile'),
        }}
      />
    </RestaurantTab.Navigator>
  );
}
