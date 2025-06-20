import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabRestaurantStackParamList } from "./types";
import DashboardScreen from "@/app/(restaurant)/(tabs)/DashboardScreen";
import OrderScreen from "@/app/(restaurant)/(tabs)/OrderScreen";
import ProfileScreen from "@/app/(restaurant)/(tabs)/ProfileScreen";
import MenuScreen from "@/app/(restaurant)/(tabs)/MenuScreen";
import { lightTheme } from "@/config/theme";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";



 const Tab = createBottomTabNavigator<TabRestaurantStackParamList>();

const RestaurantTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={
        ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
                iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Menu':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
            case 'Orders':
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
      })
      }
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
      />
       <Tab.Screen
        name="Menu"
        component={MenuScreen}
      />
        <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
  
  
}

export default RestaurantTabNavigator