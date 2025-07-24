import { RootStackParamList } from "./types";
import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params as never);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function resetToScreen(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: name as never, params: params as never }],
    });
  }
}

export function push(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function replace(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

export function popToTop() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
}

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}

export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return null;
}

// Deep linking helpers
export function navigateToRestaurant(restaurantId: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('CustomerApp', {
      screen: 'Home',
      params: {
        screen: 'RestaurantDetails',
        params: { restaurantId }
      }
    } as never);
  }
}
export function navigateToEditProfile(){
  if (navigationRef.isReady()) {
    navigationRef.navigate('CustomerApp', {
      screen: 'Profile',
      params: {
        screen: 'EditProfile'
      }
    } as never);
  }
}
export function navigateToSearch() {
  if (navigationRef.isReady()) {
    console.log('moving to search screen')

    navigationRef.navigate('CustomerApp', {
      screen: 'Home',
      params: {
        screen: 'SearchScreen'
      }
    } as never);
  }
}
export function navigateToOrder(orderId: string, userType: 'customer' | 'restaurant') {
  if (navigationRef.isReady()) {
    if (userType === 'customer') {
      navigationRef.navigate('CustomerApp', {
        screen: 'Orders',
        params: {
          screen: 'OrderDetails',
          params: { orderId }
        }
      } as never);
    } else {
      navigationRef.navigate('RestaurantApp', {
        screen: 'Orders',
        params: {
          screen: 'OrderDetails',
          params: { orderId }
        }
      } as never);
    }
  }
}

export function navigateToFood(foodId: string, restaurantId: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('CustomerApp', {
      screen: 'Home',
      params: {
        screen: 'FoodDetails',
        params: { foodId, restaurantId }
      }
    } as never);
  }
}

export function navigateToAuth(userType?: 'customer' | 'restaurant') {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Auth', {
      screen: 'SignIn',
      params: { userType }
    } as never);
  }
}

export function navigateToHome(userType: 'customer' | 'restaurant') {
  if (navigationRef.isReady()) {
    const screenName = userType === 'customer' ? 'CustomerApp' : 'RestaurantApp';
    navigationRef.navigate(screenName as never);
  }
}

// Authentication helpers
export function resetToAuth() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Auth' as never }],
    });
  }
}

export function resetToCustomerApp() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'CustomerApp' as never }],
    });
  }
}

export function resetToRestaurantApp() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'RestaurantApp' as never }],
    });
  }
} 
