import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

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
import FAQ from '../screens/customer/Profile/FAQ';

// Import theme and assets
import { icons } from '@/assets/images';
import ContactUs from '../screens/customer/Profile/ContactUs';
import { useAppTheme } from '../config/theme';
import { useAppStore } from '../stores/customerStores/AppStore';

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
      }}
    >
      <CustomerHomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </CustomerHomeStack.Navigator>
  );
}

function CustomerOrderStackScreen() {
  const { colors } = useTheme();
  return (
    <CustomerOrderStack.Navigator
      initialRouteName="CompletedOrdersScreen"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onBackground,
        tabBarStyle: {
          borderTopColor: colors.background,
          marginBottom: -50,
          backgroundColor: colors.background,
        },

        lazy: true,
      }}
    >
      <CustomerOrderStack.Screen
        name="CompletedOrdersScreen"
        component={CompletedOrderScreen}
        options={{ title: 'Completed' }}
      />
      <CustomerOrderStack.Screen
        name="PendingOrdersScreen"
        component={ActiveOrderScreen}
        options={{ title: 'Pending' }}
      />
    </CustomerOrderStack.Navigator>
  );
}

export function CustomerHelpCenterStackScreen() {
  const { colors } = useTheme();

  return (
    <CustomerHelpStack.Navigator
      initialRouteName="FAQ"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          borderTopColor: colors.background,
          backgroundColor: colors.background,
        },
        lazy: true,
      }}
    >
      <CustomerHelpStack.Screen name="FAQ" component={FAQ} />
      <CustomerHelpStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ title: 'Contact Us' }}
      />
    </CustomerHelpStack.Navigator>
  );
}

function CustomerProfileStackScreen() {
  const { colors } = useTheme();

  return (
    <CustomerProfileStack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        contentStyle: {
          marginTop: -39,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <CustomerProfileStack.Screen
        name="ProfileHome"
        component={ProfileHomeScreen}
        options={({ navigation }) => ({
          headerTitle: 'Profile',
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
              <Ionicons
                name="settings-outline"
                size={25}
                color={colors.onBackground}
              />
            </TouchableOpacity>
          ),
          headerTitleStyle: { color: colors.onBackground },
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
  let iconName: keyof typeof Ionicons.glyphMap;

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

  return <Ionicons name={iconName} size={size} color={color} />;
});

TabBarIcon.displayName = 'TabBarIcon';

export default function CustomerNavigator() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const tabBarStyle = React.useMemo(
    () => ({
      backgroundColor: colors.background,
      borderColor: colors.background,
      height: (Platform.OS === 'ios' ? 80 : 60) + insets.bottom,
      paddingBottom: (Platform.OS === 'ios' ? 25 : 10) + insets.bottom,
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
      marginTop: -50,
      paddingTop: 10,
    }),
    [colors.background, insets.bottom],
  );

  const headerStyle = React.useMemo(
    () => ({
      backgroundColor: colors.surface,
      height: 60 + insets.top,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      elevation: 0,
    }),
    [colors.surface, insets.top],
  );

  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarStyle,
        headerStyle,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.onSurface,
        },
        headerTitleAlign: 'left',
        lazy: true,
        unmountOnBlur: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <CustomerTab.Screen
        name="Home"
        component={CustomerHomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />

      <CustomerTab.Screen
        name="Orders"
        component={CustomerOrderStackScreen}
        options={({ navigation }) => ({
          tabBarLabel: 'Orders',
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
              <Ionicons
                name="search-outline"
                size={25}
                color={colors.primary}
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
            fontWeight: 'normal',
            color: colors.onSurface,
          },
        })}
      />

      <CustomerTab.Screen
        name="Profile"
        component={CustomerProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
        }}
      />
    </CustomerTab.Navigator>
  );
}
