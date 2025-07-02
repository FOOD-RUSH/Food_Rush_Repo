import { RootStackParamList } from "./types";
import { createNavigationContainerRef, StackActions } from "@react-navigation/native";

export const navigationRef =  createNavigationContainerRef<RootStackParamList> ();
export function navigate(name: keyof RootStackParamList, params?: any)
{
    if (navigationRef.isReady())
    {
        navigationRef.navigate(name, params);
    }
}
export function goBack() {
    if (navigationRef.isReady()){
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

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}

// Deep linking helpers
export function navigateToRestaurant(restaurantId: string) {
  navigate('CustomerApp', {
    screen: 'Home',
    params: {
      screen: 'RestaurantDetails',
      params: { restaurantId }
    }
  });
}

export function navigateToOrder(orderId: string, userType: 'customer' | 'restaurant') {
  if (userType === 'customer') {
    navigate('CustomerApp', {
      screen: 'Orders',
      params: {
        screen: 'OrderDetails',
        params: { orderId }
      }
    });
  } else {
    navigate('RestaurantApp', {
      screen: 'Orders',
      params: {
        screen: 'OrderDetails',
        params: { orderId }
      }
    });
  }
}

export function navigateToFood(foodId: string, restaurantId: string) {
  navigate('CustomerApp', {
    screen: 'Home',
    params: {
      screen: 'FoodDetails',
      params: { foodId, restaurantId }
    }
  });
}


