import React, { useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
// import OrderDetailsScreen from '../screens/customer/Order/OrderDetailsScreen';
import FAQ from '../screens/customer/Profile/FAQ';
// import ContactUs from '../screens/customer/Profile/ContactUs';
// import AddressScreen from '../screens/customer/Profile/AddressScreen';
// import AddAddressScreen from '../screens/customer/Profile/AddAddressScreen';
// import PaymentMethodsScreen from '../screens/customer/Profile/PaymentMethodsScreen';
// import AddPaymentScreen from '../screens/customer/Profile/AddPaymentScreen';
// import SettingsScreen from '../screens/customer/Profile/SettingsScreen';
// import AboutScreen from '../screens/customer/Profile/AboutScreen';

// Import theme and assets
import { lightTheme } from '@/src/config/theme';
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

// Custom back button component



// Stack Screen Components
function CustomerHomeStackScreen() {
  return (
    <CustomerHomeStack.Navigator
      screenOptions={{
        headerShown: false,
        // Performance optimizations
      }}
    >
      <CustomerHomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </CustomerHomeStack.Navigator>
  );
}

function CustomerOrderStackScreen() {
  return (
    <CustomerOrderStack.Navigator
      initialRouteName="CompletedOrdersScreen"
      screenOptions={{
        tabBarActiveTintColor: lightTheme.colors.primary,
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          borderTopColor: 'white',
          marginBottom: -50,
        },
        lazy: true, // Performance optimization
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
      {/* <CustomerOrderStack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      /> */}
    </CustomerOrderStack.Navigator>
  );
}

export function CustomerHelpCenterStackScreen() {

  return (
    <CustomerHelpStack.Navigator
      initialRouteName="FAQ"
      screenOptions={{
        tabBarActiveTintColor: lightTheme.colors.primary,
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          borderTopColor: 'white',
        },
        lazy: true, // Performance optimization
      }}
    >
      <CustomerHelpStack.Screen
        name="FAQ"
        component={FAQ}
      />
      <CustomerHelpStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ title: 'Contact Us' }}
      />
    </CustomerHelpStack.Navigator>
  );
}

function CustomerProfileStackScreen() {
  

  return (
    <CustomerProfileStack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{contentStyle: {
        marginTop: -39
      }}}
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
            <TouchableOpacity
              onPress={() => {}}
              style={{ marginRight: 8 }}
            >
              <Ionicons
                name="settings-outline"
                size={25}
                color={lightTheme.colors.primary}
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

export default function CustomerNavigator() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = React.useMemo(
    () => ({
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      height: (Platform.OS === 'ios' ? 80 : 60) + insets.bottom,
      paddingBottom: (Platform.OS === 'ios' ? 25 : 10) + insets.bottom,
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
      marginTop: -50,
      paddingTop: 10,
    }),
    [insets.bottom],
  );

  const headerStyle = React.useMemo(
    () => ({
      backgroundColor: 'white',
      height: 60 + insets.top,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      elevation: 0,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 10,
    }),
    [insets.top],
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
        tabBarActiveTintColor: lightTheme.colors.primary,
        tabBarInactiveTintColor: '#808080',
        tabBarStyle,
        headerStyle,
        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'left',
        // Performance optimizations
        lazy: true,
        unmountOnBlur: false,
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
                // Navigate to search using the root navigation
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
                color={lightTheme.colors.primary}
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
