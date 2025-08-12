import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  RestaurantAnalyticsStackParamList,
  RestaurantMenuStackParamList,
  RestaurantOrdersStackParamList,
  RestaurantTabParamList,
  RestaurantProfileStackParamList,
} from './types';

import ProfileScreen from '../screens/restaurant/profile/ProfileScreen';
import OrderScreen from '../screens/restaurant/orders/OrderScreen';
import MenuScreen from '../screens/restaurant/menu/MenuScreen';
import OrderHistoryScreen from '../screens/restaurant/orders/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/restaurant/orders/OrderDetailsScreen';
import { Platform } from 'react-native';
import AnalyticsScreen from '../screens/restaurant/analytics/AnalyticsScreen';
import DashboardScreen from '../screens/restaurant/analytics/DashboardScreen';
import ProfileEditScreen from '../screens/restaurant/profile/ProfileEditScreen';
import PaymentBillingScreen from '../screens/restaurant/profile/PaymentBillingScreen';
import NotificationScreen from '../screens/restaurant/profile/NotificationScreen';
import AccountSettingsScreen from '../screens/restaurant/profile/AccountSettingsScreen';
import SupportScreen from '../screens/restaurant/profile/SupportScreen';
import AboutScreen from '../screens/restaurant/profile/AboutScreen';
import RestaurantSettingsScreen from '../screens/restaurant/profile/RestaurantSettingsScreen';

// Import the menu-related screens
import AddFoodScreen from '../screens/restaurant/menu/AddFoodScreen';
import EditFoodScreen from '../screens/restaurant/menu/EditFoodScreen';
import FoodCategoriesScreen from '../screens/restaurant/menu/FoodCategoriesScreen';
import MenuListScreen from '../screens/restaurant/menu/MenuListScreen';
import MenuSettingsScreen from '../screens/restaurant/menu/MenuSettingsScreen';
import AddCategoryScreen from '../screens/restaurant/menu/AddCategoryScreen';

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
  return (
    <RestaurantOrdersStack.Navigator>
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
      <RestaurantOrdersStack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'Order History' }}
      />
    </RestaurantOrdersStack.Navigator>
  );
}

function RestaurantMenuStackScreen() {
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
  return (
    <RestaurantAnalyticsStack.Navigator>
      <RestaurantAnalyticsStack.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <RestaurantAnalyticsStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      {/* <RestaurantAnalyticsStack.Screen name="SalesReport" component={SalesReportScreen} />
      <RestaurantAnalyticsStack.Screen name="CustomerInsights" component={CustomerInsightsScreen} />
      <RestaurantAnalyticsStack.Screen name="PopularItems" component={PopularItemsScreen} /> */}
    </RestaurantAnalyticsStack.Navigator>
  );
}

function RestaurantProfileStackScreen() {
  return (
    <RestaurantProfileStack.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for a cleaner look since the edit screen has its own header
      }}
    >
      <RestaurantProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <RestaurantProfileStack.Screen
        name="ProfileEditProfile"
        component={ProfileEditScreen}
        options={{
          presentation: 'modal', // Modal style for a nice UX
          animation: 'slide_from_bottom', // Smooth animation
        }}
      />
      {/* New Profile Option Screens */}
      <RestaurantProfileStack.Screen
        name="PaymentBilling"
        component={PaymentBillingScreen}
        options={{ title: 'Payment & Billing', animation: 'slide_from_right' }}
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
        options={{ title: 'Restaurant Settings', animation: 'slide_from_right' }}
      />
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

          if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          height:( Platform.OS === 'ios' ? 90 : 70) + insets.bottom,
          paddingBottom: (Platform.OS === 'ios' ? 25 : 10)+ insets.bottom,
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
      <RestaurantTab.Screen
        name="Orders"
        component={RestaurantOrdersStackScreen}
      />
      <RestaurantTab.Screen name="Menu" component={RestaurantMenuStackScreen} />
      <RestaurantTab.Screen
        name="Analytics"
        component={RestaurantAnalyticsStackScreen}
      />
      <RestaurantTab.Screen
        name="Profile"
        component={RestaurantProfileStackScreen}
      />
    </RestaurantTab.Navigator>
  );
}