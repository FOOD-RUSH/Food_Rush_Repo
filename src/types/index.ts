import { PickerProps } from '@react-native-picker/picker';
import { ReactNode } from 'react';
import { TextInputProps } from 'react-native';

// Basic props

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
  language: 'Eng' | 'Fre';
  theme: "light" | "dark"

}

//Properties of Food
export interface FoodProps {
  id: string;
  restaurantID: string;
  restaurantName?: string;
  name?: string;
  price?: number;
  ratings?: number;
  addedOn?: Date;
  distance?: number;
  image?: any;
  category?: any;
  discount?: any;
  description: string;

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
  favoriteRestaurants?: RestaurantProfile[];
  favoriteFood?: FoodProps[];
}
//Restaurant profile
export interface RestaurantProfile {
  id: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  // address: Address
  cuisine: string;
  openTime: string;
  isOpen: boolean;
  isVerified?: boolean;
  // ratings: number;
  ratings: string;
  reviewCount: string;
  distance: string;
  deliveryFee?: string
  image: any;
  deliveryTime?: string;
  menu: FoodProps[];
  discounts?: FoodProps[];
  specialOffers?: string[];
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
  price: number;
}










export declare interface InputFieldProps extends TextInputProps {
  label?: string;

  error?: boolean;
  labelStyle?: string;
  inputStyle?: string;
  className?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerStyle?: string;

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



export interface SelectProps extends PickerProps {
  label?: string;
}


