import { TextInputProps } from "react-native-paper";

export interface User {
  uid: string;
  email: string;
  userType: 'customer' | 'restaurant';
  profile?: CustomerProfile | RestaurantProfile;
  isEmailVerified: boolean;

}
// app state
export interface AppState {
  isOnboardingComplete: boolean;
  language: string;

}
//Properties of Food

export interface FoodProps {
  id?: string;
  restaurantID?: string;
  name?: string;
  price?: number;
  ratings?: number;
  addedOn?: Date;
  distance?: number;
  image?: any;

}

// Onboarding slides 
export interface OnboardingSlide {
  id: number,
  title: string,
  description: string;
  image: any,

}

// Customer profile
export interface CustomerProfile {
  userName: string;
  phoneNumber: string;
  addresses?: Address[];
  preferences?: {
    dietary: string[];
    cuisineTypes: string[];
  };
}
//Restaurant profile
export interface RestaurantProfile {
  id: string;
  name: string;
  description: string;
  phone: string;
  address: Address;
  cuisine: string[];
  hours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  isVerified: boolean;
  rating: number;
  images: [];
  deliveryTime: number;
  deliveryFee: number;
  menu: MenuItem[]
}
// MENU ITEM INTERFace
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  dietaryInfo: string[];
}


// Order Types
export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  deliveryPersonId?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDeliveryTime: Date;
}
//  Auth state 
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  hasHydrated: boolean;
  authStateChecked: boolean;
}
// Order item
export interface OrderItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
}
export declare interface InputFieldProps extends TextInputProps {
    label?: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  landmark?: string;
  instructions?: string;
}

// Payment Types
export type PaymentMethod =
  | 'mtn_mobile_money'
  | 'orange_money'

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

interface FoodClass {
  id: string;
  restaurantId: string;
  name: string;
  price: string;
  category: string;
  description: string;
  ingredient: string;
}


