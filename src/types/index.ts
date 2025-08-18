import { PickerProps } from '@react-native-picker/picker';
import { ReactNode } from 'react';
import { TextInputProps } from 'react-native';
import { AddressData } from '../components/customer/AddressEditModal';
// Basic props

export interface User {


  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'customer';
  isEmailVerified: boolean;
  profilePicture?: null | any
}
// {
//   "status_code": 200,
//   "message": "Authentication request successful",
//   "data": {
//     "sub": "9a14155d-5b82-44bf-b196-9dcec0f50be7",
//     "id": "9a14155d-5b82-44bf-b196-9dcec0f50be7",
//     "email": "tochukwupaul21@gmail.com",
//     "fullName": "Dhdjsn",
//     "phoneNumber": "+237239767981",
//     "profilePicture": null,
//     "role": "customer",
//     "status": "active"
//   }
// }

// app state

//Properties of Food
export interface FoodProps {
  id: string;
  restaurantID: string;
  name?: string;
  price?: number;
  ratings?: number;
  addedOn?: Date;
  distance?: number;
  image?: any;
  category?: any;
  discount?: any;
  description: string;
  startAt?: any;
  endAt?: any

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
  deliveryFee?: string;
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
  deliveryAddress: AddressData;
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
  restaurantId: string;
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
