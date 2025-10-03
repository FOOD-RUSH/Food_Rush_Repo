import { PickerProps } from '@react-native-picker/picker';
import { ReactNode } from 'react';
import { TextInputProps } from 'react-native';
// Basic props

// Restaurant interface for detailed restaurant information
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  isOpen: boolean;
  latitude: number | null;
  longitude: number | null;
  verificationStatus: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  documentUrl: string | null;
  pictureUrl: string | null;
  rating: number | null;
  ratingCount: number;
  ownerId: string;
  menuMode: 'FIXED' | 'DAILY';
  timezone: string;
  deliveryBaseFee: number | null;
  deliveryPerKmRate: number | null;
  deliveryMinFee: number | null;
  deliveryMaxFee: number | null;
  deliveryFreeThreshold: number | null;
  deliverySurgeMultiplier: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  sub?: string;
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string; // Made required since it's always present in API responses
  role: 'customer' | 'restaurant';
  isEmailVerified: boolean;
  isPhoneVerified?: boolean;
  profilePicture?: string | null;
  status?: 'active' | 'pending_verification' | 'suspended' | 'inactive';

  // Restaurant-specific fields
  restaurantId?: string;
  restaurantName?: string;
  verificationStatus?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  restaurants?: Restaurant[];
  defaultRestaurantId?: string;

  // Legacy restaurant field for backward compatibility
  restaurant?: {
    id: string;
    name: string;
    verificationStatus: string;
  };
}

export interface FoodProps {
  id: string;
  name: string;
  description: string;
  price: string; // Backend returns price as string
  pictureUrl: string | null;
  image?: any; // For backward compatibility
  category: string;
  isAvailable: boolean;
  restaurant: {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
  };
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  deliveryFee: number | null;
  // Backend-calculated distance from user's location (in kilometers)
  distance?: number | null;
  distanceKm?: number | null;
  // Backend-calculated delivery info (when available)
  estimatedDeliveryTime?: string;
  deliveryPrice?: number;
}

export interface MenuProps {
  id: string;
  name: string;
  description: string;
  price: string; // Always string in API
  image: string;
  restaurantId: string;
  isAvailable: boolean;
  category: string;
}

export interface RestaurantCard {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  isOpen: boolean;
  verificationStatus: string;
  menuMode: string;
  createdAt: string;
  distanceKm: number;
  deliveryPrice: number;
  estimatedDeliveryTime: string;
  rating: number | null;
  ratingCount: number;
  // Optional fields for backward compatibility
  phone?: string;
  documentUrl?: string | null;
  ownerId?: string;
  timezone?: string;
  deliveryBaseFee?: number | null;
  deliveryPerKmRate?: number | null;
  deliveryMinFee?: number | null;
  deliveryMaxFee?: number | null;
  deliveryFreeThreshold?: number | null;
  deliverySurgeMultiplier?: number | null;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  distance?: number; // Legacy field - use distanceKm instead
  image?: string | null; // Restaurant image
  menu?: any[]; // Restaurant menu items
}

// Onboarding slides
export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
}

// Restaurant profile with backend-calculated location data
export interface RestaurantProfile {
  id: string;
  name: string;
  address: string;
  image: string | null;
  rating: number | null;
  ratingCount: number;
  // Backend-calculated fields based on user's location
  distance: number; // Distance in kilometers from user's location (calculated by backend)
  deliveryPrice: number; // Delivery fee (calculated by backend)
  estimatedDeliveryTime: string; // e.g., "10-20 mins" (calculated by backend)
  menu: FoodProps[];
  // Additional restaurant details
  phone?: string;
  isOpen?: boolean;
  latitude?: number;
  longitude?: number;
}

// Auth response types for different user types
export interface BaseAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CustomerAuthResponse extends BaseAuthResponse {
  // Customer-specific fields (if any)
}

export interface RestaurantAuthResponse extends BaseAuthResponse {
  restaurants: Restaurant[];
  defaultRestaurantId: string;
}

export type AuthResponse = CustomerAuthResponse | RestaurantAuthResponse;

// Type guard to check if response is restaurant auth response
export function isRestaurantAuthResponse(
  response: AuthResponse,
): response is RestaurantAuthResponse {
  return 'restaurants' in response && 'defaultRestaurantId' in response;
}

//  Auth state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  hasHydrated: boolean;
  authStateChecked: boolean;
  // Restaurant-specific state
  restaurants?: Restaurant[];
  defaultRestaurantId?: string;
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
  | 'ready_for_pickup'
  | 'out_for_delivery'
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

// Restaurant Review Types
export interface RestaurantReview {
  id: string;
  score: number;
  review: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    profilePicture: string | null;
  };
}

export interface RestaurantReviewsResponse {
  status_code: number;
  message: string;
  data: RestaurantReview[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'system' | 'promotion' | 'alert';
  priority?: 'low' | 'medium' | 'high';
  data?: {
    restaurantId?: string;
    orderId?: string;
    [key: string]: any;
  };
  readAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationResponse {
  status_code: number;
  message: string;
  data: {
    items: Notification[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  status_code: number;
  message: string;
  data: number;
}

// Re-export analytics types
export * from './analytics';
