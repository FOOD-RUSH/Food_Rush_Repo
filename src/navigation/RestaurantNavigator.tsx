import { IoniconsIcon } from '@/src/components/common/icons';
import React, {useMemo} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getPlatformTabBarStyle } from './platformNavigation';
import {
  RestaurantAnalyticsStackParamList,
  RestaurantMenuStackParamList,
  RestaurantOrdersStackParamList,
  RestaurantTabParamList,
  RestaurantAccountStackParamList,
} from './types';

// Import tab-level screens only
import OrdersList from '../screens/restaurant/orders/OrdersList';
import MenuItemsList from '../screens/restaurant/menu/MenuItemsList';
import AnalyticsOverview from '../screens/restaurant/analytics/AnalyticsOverview';
import AccountHome from '../screens/restaurant/account/AccountHome';
// Only import screens that actually exist and are used in the tab navigation

// Create navigators
const RestaurantTab = createBottomTabNavigator<RestaurantTabParamList>();
const RestaurantOrdersStack =
  createNativeStackNavigator<RestaurantOrdersStackParamList>();
const RestaurantMenuStack =
  createNativeStackNavigator<RestaurantMenuStackParamList>();
const RestaurantAnalyticsStack =
  createNativeStackNavigator<RestaurantAnalyticsStackParamList>();
const RestaurantAccountStack =
  createNativeStackNavigator<RestaurantAccountStackParamList>();

// Stack Screen Components - Only tab-level screens
function RestaurantOrdersStackScreen() {
  return (
    <RestaurantOrdersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RestaurantOrdersStack.Screen
        name="OrdersList"
        component={OrdersList}
        options={{ title: 'Orders' }}
      />
    </RestaurantOrdersStack.Navigator>
  );
}

function RestaurantMenuStackScreen() {
  return (
    <RestaurantMenuStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RestaurantMenuStack.Screen
        name="MenuItemsList"
        component={MenuItemsList}
        options={{ title: 'Menu Items' }}
      />
    </RestaurantMenuStack.Navigator>
  );
}

function RestaurantAnalyticsStackScreen() {
  return (
    <RestaurantAnalyticsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RestaurantAnalyticsStack.Screen
        name="AnalyticsOverview"
        component={AnalyticsOverview}
        options={{ title: 'Analytics' }}
      />
    </RestaurantAnalyticsStack.Navigator>
  );
}

function RestaurantAccountStackScreen() {
  return (
    <RestaurantAccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RestaurantAccountStack.Screen
        name="AccountHome"
        component={AccountHome}
        options={{ title: 'Account' }}
      />
    </RestaurantAccountStack.Navigator>
  );
}

export default function RestaurantNavigator() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const tabBarStyle = useMemo(
     () => getPlatformTabBarStyle(colors.surface, insets),
     [colors.surface, insets],
   );
  return (
   <RestaurantTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof IoniconsIconName;

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
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <IoniconsIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        headerShown: false,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Urbanist-Medium',
         // marginBottom: Platform.OS === 'ios' ? 2 : 0,
        },
        lazy: true,
        unmountOnBlur: false,
        tabBarHideOnKeyboard: true,
        gestureEnabled: false,
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
        name="Account"
        component={RestaurantAccountStackScreen}
        options={{
          tabBarLabel: t('account'),
        }}
      />
    </RestaurantTab.Navigator>
  );
}
