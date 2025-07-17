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
      />
      <RestaurantOrdersStack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
      />
    </RestaurantOrdersStack.Navigator>
  );
}

function RestaurantMenuStackScreen() {
  return (
    <RestaurantMenuStack.Navigator>
      <RestaurantMenuStack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{ title: 'Menu' }}
      />
      {/* <RestaurantMenuStack.Screen name="AddMenuItem" component={AddMenuItemScreen} />
      <RestaurantMenuStack.Screen name="EditMenuItem" component={EditMenuItemScreen} />
      <RestaurantMenuStack.Screen name="Categories" component={CategoriesScreen} />
      <RestaurantMenuStack.Screen name="AddCategory" component={AddCategoryScreen} />
      <RestaurantMenuStack.Screen name="EditCategory" component={EditCategoryScreen} /> */}
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
      {/* <RestaurantAnalyticsStack.Screen name="SalesReport" component={SalesReportScreen} />
      <RestaurantAnalyticsStack.Screen name="CustomerInsights" component={CustomerInsightsScreen} />
      <RestaurantAnalyticsStack.Screen name="PopularItems" component={PopularItemsScreen} /> */}
    </RestaurantAnalyticsStack.Navigator>
  );
}

function RestaurantProfileStackScreen() {
  return (
    <RestaurantProfileStack.Navigator>
      <RestaurantProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
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
