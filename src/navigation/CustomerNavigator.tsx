import { IoniconsIcon, IoniconsName } from '@/src/components/common/icons';
import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { FloatingTabBar } from '../components/common/FloatingTabBar';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { useAppNavigationTheme } from '../config/theme';

import {
  CustomerHomeStackParamList,
  CustomerProfileStackParamList,
  CustomerTabParamList,
  CustomerOrderStackParamList,
  CustomerHelpCenterStackParamList,
} from './types';

// Import screens
import HomeScreen from '../screens/customer/home/HomeScreen';
import ProfileHomeScreen from '../screens/customer/Profile/ProfileHomeScreen';
import CompletedOrderScreen from '../screens/customer/Order/CompletedOrderScreen';
import ActiveOrderScreen from '../screens/customer/Order/ActiveOrderScreen';
import CancelledOrderScreen from '../screens/customer/Order/CancelledOrderScreen';
import FAQ from '../screens/customer/Profile/FAQ';

// Import theme and assets
import { icons } from '@/assets/images';
import ContactUs from '../screens/customer/Profile/ContactUs';

// Create navigators
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const CustomerHomeStack =
  createNativeStackNavigator<CustomerHomeStackParamList>();
const CustomerOrderStack =
  createMaterialTopTabNavigator<CustomerOrderStackParamList>();
const CustomerProfileStack =
  createNativeStackNavigator<CustomerProfileStackParamList>();
const CustomerHelpStack =
  createMaterialTopTabNavigator<CustomerHelpCenterStackParamList>();

// Stack Screen Components
function CustomerHomeStackScreen() {
  return (
    <CustomerHomeStack.Navigator
      screenOptions={{
        headerShown: false,
        // Prevent going back to auth screens
        gestureEnabled: false,
      }}
    >
      <CustomerHomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          // Prevent going back to auth screens
          gestureEnabled: false,
        }}
      />
    </CustomerHomeStack.Navigator>
  );
}

function CustomerOrderStackScreen() {
  const navigationTheme = useAppNavigationTheme();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  return (
    <CustomerOrderStack.Navigator
      initialRouteName="CompletedOrdersScreen"
      screenOptions={{
        tabBarActiveTintColor: navigationTheme.colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: navigationTheme.colors.card,
          borderTopColor: navigationTheme.colors.card,
          // Platform-specific margin adjustment
          // marginBottom: Platform.OS === 'ios' ? -50 : -50,
        },
        tabBarIndicatorStyle: {
          backgroundColor: navigationTheme.colors.primary,
          height: Platform.OS === 'ios' ? 3 : 2,
        },
        tabBarLabelStyle: {
          fontFamily: 'Urbanist-SemiBold',
          fontSize: 12,
          textTransform: 'none',
        },
        lazy: true,
      }}
    >
      <CustomerOrderStack.Screen
        name="CompletedOrdersScreen"
        component={CompletedOrderScreen}
        options={{ title: t('completed') }}
      />
      <CustomerOrderStack.Screen
        name="PendingOrdersScreen"
        component={ActiveOrderScreen}
        options={{ title: t('pending') }}
      />
      <CustomerOrderStack.Screen
        name="CancelledOrdersScreen"
        component={CancelledOrderScreen}
        options={{ title: t('cancelled') }}
      />
    </CustomerOrderStack.Navigator>
  );
}

export function CustomerHelpCenterStackScreen() {
  const navigationTheme = useAppNavigationTheme();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <CustomerHelpStack.Navigator
      initialRouteName="FAQ"
      screenOptions={{
        tabBarActiveTintColor: navigationTheme.colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: navigationTheme.colors.card,
          borderTopColor: navigationTheme.colors.card,
          marginBottom: -50,
        },
        tabBarIndicatorStyle: {
          backgroundColor: navigationTheme.colors.primary,
        },
        tabBarLabelStyle: {
          fontFamily: 'Urbanist-SemiBold',
          fontSize: 14,
          textTransform: 'none',
        },
        lazy: true,
      }}
    >
      <CustomerHelpStack.Screen
        name="FAQ"
        component={FAQ}
        options={{ title: t('faq') }}
      />
      <CustomerHelpStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ title: t('contact_us') }}
      />
    </CustomerHelpStack.Navigator>
  );
}

function CustomerProfileStackScreen() {
  const navigationTheme = useAppNavigationTheme();
  const { t } = useTranslation('translation');

  return (
    <CustomerProfileStack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: navigationTheme.colors.card,
        },

        headerTitleStyle: {
          fontFamily: 'Urbanist-SemiBold',
          fontSize: 18,
          color: navigationTheme.colors.text,
        },
        contentStyle: {
          backgroundColor: navigationTheme.colors.background,
          marginTop: -39,
        },
      }}
    >
      <CustomerProfileStack.Screen
        name="ProfileHome"
        component={ProfileHomeScreen}
        options={({ navigation }) => ({
          headerTitle: t('profile'),
          headerTitleStyle: {
            fontFamily: 'Urbanist-SemiBold',
            fontSize: 18,
            color: navigationTheme.colors.text,
          },
          headerShadowVisible: true,

          headerLeft: () => (
            <Image
              source={icons.R_logo}
              style={{ height: 30, width: 30, marginLeft: 10, marginRight: 20 }}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'left',
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={{ marginRight: 8 }}>
              <IoniconsIcon
                name="settings-outline"
                size={25}
                color={navigationTheme.colors.text}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </CustomerProfileStack.Navigator>
  );
}

// Custom tab bar icon component for better performance
const TabBarIcon: React.FC<{
  routeName: keyof CustomerTabParamList;
  focused: boolean;
  color: string;
  size: number;
}> = React.memo(({ routeName, focused, color, size }) => {
  let iconName: IoniconsName;

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
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

  return <IoniconsIcon name={iconName} size={size} color={color} />;
});

TabBarIcon.displayName = 'TabBarIcon';

export default function CustomerNavigator() {
  const insets = useSafeAreaInsets();

  const navigationTheme = useAppNavigationTheme();
  //const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const headerStyle = useMemo(
    () => ({
      backgroundColor: navigationTheme.colors.card,
      height: Platform.OS === 'ios' ? 60 + insets.top : 60,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      elevation: 0,
    }),
    [navigationTheme.colors.card, insets.top],
  );

  return (
    <CustomerTab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} userType="customer" />}
      screenOptions={({ route }) => ({
        tabBarLabel: () => {
          let label = '';
          switch (route.name) {
            case 'Home':
              label = t('home');
              break;
            case 'Orders':
              label = t('orders');
              break;
            case 'Profile':
              label = t('profile');
              break;
            default:
              label = '';
          }
          return label;
        },
        headerStyle,
        headerTitleStyle: {
          fontFamily: 'Urbanist-Bold',
          fontSize: 18,
          color: navigationTheme.colors.text,
        },
        lazy: true,
        unmountOnBlur: false,
        tabBarHideOnKeyboard: true,
        gestureEnabled: false,
      })}
    >
      <CustomerTab.Screen
        name="Home"
        component={CustomerHomeStackScreen}
        options={{
          headerShown: false,
        }}
      />
      <CustomerTab.Screen
        name="Orders"
        component={CustomerOrderStackScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                const rootNavigation = navigation.getParent() as any;
                if (rootNavigation) {
                  rootNavigation.navigate('SearchScreen');
                }
              }}
              style={{ marginRight: 20 }}
            >
              <IoniconsIcon
                name="search-outline"
                size={25}
                color={navigationTheme.colors.primary}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <Image
              source={icons.R_logo}
              style={{ height: 30, width: 30, marginLeft: 12 }}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'left',
          headerTitleStyle: {
            marginLeft: 20,
            fontFamily: 'Urbanist-Medium',
            fontSize: 18,
            color: navigationTheme.colors.text,
          },
        })}
      />
      <CustomerTab.Screen
        name="Profile"
        component={CustomerProfileStackScreen}
        options={{
          headerShown: false,
        }}
      />
    </CustomerTab.Navigator>
  );
}
