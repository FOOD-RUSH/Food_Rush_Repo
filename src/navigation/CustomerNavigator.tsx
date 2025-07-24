import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CustomerHomeStackParamList,
  CustomerProfileStackParamList,
  CustomerTabParamList,
  CustomerOrderStackParamList,
  CustomerHelpCenterStackParamsList,
} from './types';
import HomeScreen from '../screens/customer/home/HomeScreen';
import FavoritesFoodScreen from '../screens/customer/Profile/FavoritesFoodScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// order is top bar stack Navigator

import {
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { lightTheme } from '@/src/config/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompletedOrderScreen from '../screens/customer/Order/CompletedOrderScreen';
import ActiveOrderScreen from '../screens/customer/Order/ActiveOrderScreen';
import { icons } from '@/assets/images';
import CategoryItems from '../screens/customer/home/CategoryItems';
import { goBack } from './navigationHelpers';
import FoodDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import FAQ from '../screens/customer/Profile/FAQ';
import ContactUs from '../screens/customer/Profile/ContactUs';
import SearchScreen from '../screens/customer/home/SearchScreen';
import ProfileHomeScreen from '../screens/customer/Profile/ProfileHomeScreen';
import Language from '../screens/customer/Profile/Language';
import EditProfileScreen from '../screens/customer/Profile/EditProfileScreen';
import CartScreen from '../screens/customer/home/CartScreen';
import FavoriteRestaurants from '../screens/customer/Profile/FavoriteRestaurants';

const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const CustomerHomeStack =
  createNativeStackNavigator<CustomerHomeStackParamList>();
const CustomerOrderStack =
  createMaterialTopTabNavigator<CustomerOrderStackParamList>();
const CustomerProfileStack =
  createNativeStackNavigator<CustomerProfileStackParamList>();
// const CustomerSearchStack =
//   createNativeStackNavigator<CustomerSearchStackParamList>();
const CustomerHelpStack =
  createNativeStackNavigator<CustomerHelpCenterStackParamsList>();
//  Stack Screens for Customer Home
function CustomerHomeStackScreen() {
  return (
    <CustomerHomeStack.Navigator>
      <CustomerHomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <CustomerHomeStack.Screen
        name="FoodDetails"
        component={FoodDetailScreen}
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable onPress={() => {}}>
              <MaterialIcons name="arrow-back" size={20} color={'white'} />
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row">
              <Ionicons
                name="heart-circle-outline"
                color={'white'}
                size={18}
                className="mr-1"
              />
              <MaterialIcons
                name="telegram"
                color={'white'}
                size={18}
                className="mr-2"
              />
            </View>
          ),
        }}
      />
      {/* TODO: to add more files */}
      <CustomerHomeStack.Screen
        name="Category"
        component={CategoryItems}
        options={{
          headerTitle: 'More Category',
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={goBack}>
              <Ionicons name="arrow-back" />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <CustomerHomeStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          presentation: 'fullScreenModal',
          animationTypeForReplace: 'push',
          headerShown: false,
        }}
      />
      <CustomerHomeStack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerTitle: 'My Cart',
          headerLeft: () => (
            <TouchableOpacity
              onPress={goBack}
              className="rounded-full p-3 mr-3 focus:bg-gray-400"
            >
              <MaterialIcons
                name={
                  Platform.OS === 'ios' ? 'arrow-back-ios-new' : 'arrow-back'
                }
                size={20}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity className="rounded-full p-3 mr-2 focus:bg-primaryColor">
              <Image
                source={icons.more}
                tintColor={'#007aff'}
                className="h-5 w-5 "
              />
            </TouchableOpacity>
          ),
        }}
      />
    </CustomerHomeStack.Navigator>
  );
}

// Stack Screens for Customer Orders

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

      {/* Add more screens related to cart if needed */}
    </CustomerOrderStack.Navigator>
  );
}
// Stack Screens for Customer Profile
function CustomerHelpCenterStackScreen() {
  return (
    <CustomerHelpStack.Navigator initialRouteName="FAQ">
      <CustomerHelpStack.Screen name="FAQ" component={FAQ} />
      <CustomerHelpStack.Screen name="ContactUs" component={ContactUs} />
    </CustomerHelpStack.Navigator>
  );
}

function CustomerProfileStackScreen() {
  return (
    <CustomerProfileStack.Navigator initialRouteName="ProfileHome">
      <CustomerProfileStack.Screen
        name="ProfileHome"
        component={ProfileHomeScreen}
        options={{
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
            <Ionicons
              name="settings-outline"
              size={25}
              style={{ marginRight: 8 }}
            />
          ),
        }}
      />
      <CustomerProfileStack.Screen
        name="FavoriteRestaurantScreen"
        component={FavoriteRestaurants}
        options={{
          headerTitle: 'Your Favorite Restaurants ',
          headerRight: () => (
            <TouchableOpacity onPress={goBack} activeOpacity={0.7}>
              <MaterialIcons
                name={
                  Platform.OS === 'ios' ? 'arrow-back-ios-new' : 'arrow-back'
                }
                size={20}
                selectionColor={'#007aff'}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <CustomerProfileStack.Screen
        name="Help"
        component={CustomerHelpCenterStackScreen}
        options={{
          headerTitle: 'Help Center',
          headerRight: () => <MaterialIcons name="more" size={18} />,
        }}
      />
      <CustomerProfileStack.Screen
        name="LanguageScreen"
        component={Language}
        options={{
          headerTitle: 'Language',
        }}
      />
      <CustomerProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: 'Edit Profile',
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={goBack} className="mx-2 ">
              <Ionicons name="arrow-back" size={28} />
            </TouchableWithoutFeedback>
          ),
          headerTitleAlign: 'center',
        }}
      />
      {/* Add more screens related to profile if needed */}
    </CustomerProfileStack.Navigator>
  );
}

// Stack Screens for Customer Search

export default function CustomerNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline'; // antesign home is cool
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
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
        },
        tabBarActiveTintColor: lightTheme.colors.primary,
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderColor: '#e0e0e0',
          height: (Platform.OS === 'ios' ? 90 : 70) + insets.bottom,
          paddingBottom: (Platform.OS === 'ios' ? 25 : 10) + insets.bottom,
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          marginTop: -50, // Adjust this value to control the overlap with the header
          paddingTop: 10, // Add padding to the top of the tab bar
        },
        headerStyle: {
          backgroundColor: 'white',
          height: 60 + insets.top,
          borderBottomWidth: 0, // Remove bottom border
          shadowColor: 'transparent', // Remove shadow on Android
          elevation: 0, // Remove shadow on Android
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 10,
        },

        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'left',
      })}
    >
      <CustomerTab.Screen
        name="Home"
        component={CustomerHomeStackScreen}
        options={{ tabBarLabel: 'Home', headerShown: false }}
      />
      {/* <CustomerTab.Screen
        name="Search"
        component={CustomerSearchStackScreen}
        options={{ tabBarLabel: 'S', headerShown: false }}
      /> */}
      <CustomerTab.Screen
        name="Orders"
        component={CustomerOrderStackScreen}
        options={{
          tabBarLabel: 'Orders',
          headerRight: () => (
            <Ionicons
              name="search-outline"
              size={25}
              style={{ marginRight: 20 }}
              onPress={() => {
                // Replace this with your desired action, e.g., open a modal
                console.log('Search icon pressed');
              }}
            />
          ),
          headerLeft: () => (
            <Image
              source={icons.R_logo}
              className="h-[30px] w-[30px] ml-3"
              resizeMode="contain"
            />
          ),

          headerTitleAlign: 'left',
          headerTitleStyle: {
            marginLeft: 20,
            fontWeight: 'light',
          },
        }}
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
