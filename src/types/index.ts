import { PickerProps } from '@react-native-picker/picker';
import { ReactNode } from 'react';
import { TextInputProps } from 'react-native';
// Basic props

export interface User {
  sub: string;
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePicture: string | null;
  role: string;
  status: string;
  // Remove old fields not in docs: isEmailVerified
}

export interface FoodProps {
  id: string;
  name: string;
  description: string;
  price: string; // Always string in API
  pictureUrl: string;
  isAvailable: boolean;
  restaurant: {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
  };
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
  distanceKm: number | null;
  // Remove old UI fields not in API: image, restaurantId, rating, distance, deliveryPrice
}

export interface MenuProps {
  id: string;
  name: string;
  description: string;
  price: string; // Always string in API
  image: string;
  restaurantId: string;
  isAvailable: boolean;
}

export interface RestaurantCard {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  isOpen: boolean;
  verificationStatus: 'PENDING_VERIFICATION' | 'APPROVED';
  menuMode: 'FIXED' | 'DAILY';
  createdAt: string;
  rating: number | null;
  ratingCount: number;
  // Remove old UI fields: image, deliveryPrice, distance, imageUrl, estimatedDeliveryTime, deliveryFee
}

// Onboarding slides
export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
}

//Restaurant profile
export interface RestaurantProfile {
  id: string;
  name: string;
  address: string;
  image: string | null;
  rating: number | null;
  ratingCount: number;
  menu: FoodProps[];
  // Remove old fields not in docs: description, phone, openTime, ratings, reviewCount, distance, deliveryFee, deliveryTime, discounts, specialOffers
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

// Order Types from backend
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: {
    foodId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    specialInstructions?: string;
  }[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  delivery: {
    id: string;
    status: string;
    deliveredAt: string | null;
    customerConfirmed: boolean;
    customerConfirmedAt: string | null;
    rider: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}
// Order item
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  imageUrl: string;
  description?: string;
}
// OrderMenuItem
export interface OrderMenuItem {
  item: OrderItem;
  quantity: number;
  totalPrice: number;
  specialInstructions?: string;
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

// Payment Types
export type PaymentMethod = 'mtn_mobile_money' | 'orange_money';

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
