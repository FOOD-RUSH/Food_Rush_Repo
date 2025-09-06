import { PickerProps } from '@react-native-picker/picker';
import { ReactNode } from 'react';
import { TextInputProps } from 'react-native';
// Basic props

export interface User {


  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'customer' | 'restaurant';
  isEmailVerified: boolean;
  profilePicture?: null | any;
  // Restaurant-specific fields
  restaurantId?: string;
  restaurantName?: string;
  verificationStatus?: string;
  restaurant?: {
    id: string;
    name: string;
    verificationStatus: string;
  };
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
// {
//       "id": "4244d47c-0656-4515-bf31-80eb018c86cb",
//       "name": "Ndole",
//       "description": "Ndole with boiled plantains and stuffed bread with some pepper and complements",
//       "price": "1000.00",
//       "isAvailable": true,
//       "pictureUrl": "/uploads/menu/1755705024296-139753304.png",
//       "restaurant": {
//         "id": "cd28f1b3-0f2f-42fa-88ad-91fead122695",
//         "name": "Paulos",
//         "latitude": null,
//         "longitude": null
//       },
//       "startAt": null,
//       "endAt": null,
//       "createdAt": "2025-08-20T15:50:24.716Z",
//       "updatedAt": "2025-08-20T15:50:24.716Z",
//       "distanceKm": null
//     },
// restaurant/menu/browse 
// 
// 
// 
// 


export interface FoodProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: any;
  // category?: any;
  isAvailable?: boolean

  restaurant?: {
    id: string;
    name: string;
    latitude?: string,
    longitude?: string
  },
  rating?: number;
  distance?: number;
  deliveryPrice?: number;

}


export interface RestaurantCard {
  id: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  isOpen: boolean;
  verificationStatus?: string;
  menuMode?: string;
  createdAt?: string;
  // Future fields from backend
  deliveryPrice?: number;
  distance?: number;
  imageUrl?: string;
  estimatedDeliveryTime?: string;
  deliveryFee?: string;
  rating?: number;
  // Mapped fields for component compatibility
  restaurantId: string; // Will be mapped from id
  distanceFromUser?: number; // Will be mapped from distance
}


/* 
link: restaurants/browse
  DOCUMENTATION OF BROWSE RESTAURANTS 
    PARAMTERS: 
      menuMode: Enum
      isOpen: boolean
      verificationStatus: ENum
      nearLat: number
      nearLng: number


*/


/*
  Getting Menus
  link: menu/all/nearby
  params: nearLat: Number, nearLng: number

  link: menu/all/browse- contains filters for location and delivery srvices
  params {
    nearLat: Number;
    nearLng: number;
    minDistanceKm: number;
    maxDistanceKm: number;
    minDeliveryFee: number;
    maxDeliveryFee: number;
    radiusKm: Number 
}

*/
// Creating Orders

/*
body: {
    "customerId": String,
    "restaurantId": '',
    "items": [
        {
            menuItem_id: '',
            quantity: 2
        }
    ],
    'deliveryAddress': String,
    deliveryLatitude: ,
   deliveryLongitude: , 

}
   
returns :
  {
  "status_code": 201,
  "message": "Order created successfully",
  "data": {
    "id": "3ad88947-22af-48f7-b7fa-7c2b96a5e543",
    "customer": {
      "id": "2497ffd8-6242-4ba0-8922-902a0131cbd4",
      "fullName": "Paulo",
      "email": "tochukwupaul21@gmail.com",
      "phoneNumber": "+237677008986"
    },
    "restaurant": {
      "id": "cd28f1b3-0f2f-42fa-88ad-91fead122695",
      "name": "Paulos",
      "address": "Box officees",
      "phone": "",
      "isOpen": true,
      "latitude": null,
      "longitude": null,
      "verificationStatus": "APPROVED",
      "documentUrl": null,
      "ownerId": "826d1915-f0c1-4ea8-8b9d-ea732a5d9180",
      "menuMode": "FIXED",
      "timezone": "Africa/Douala",
      "deliveryBaseFee": null,
      "deliveryPerKmRate": null,
      "deliveryMinFee": null,
      "deliveryMaxFee": null,
      "deliveryFreeThreshold": null,
      "deliverySurgeMultiplier": null,
      "createdAt": "2025-08-20T15:06:52.277Z",
      "updatedAt": "2025-08-20T15:07:34.622Z"
    },
    "items": [
      {
        "id": "79f899fd-17ca-4aa9-9118-d3ddde328293",
        "menuItem": {
          "id": "c03629cc-aa1d-477f-b3f5-55725425454c",
          "name": "Ndole",
          "description": "Ndole with boiled plantains and stuffed bread with some pepper and complements",
          "price": "1000.00",
          "isAvailable": true,
          "pictureUrl": "/uploads/menu/1755705045654-507834508.png",
          "startAt": null,
          "endAt": null,
          "createdAt": "2025-08-20T15:50:46.073Z",
          "updatedAt": "2025-08-20T15:50:46.073Z"
        },
        "quantity": 2,
        "unitPrice": "1000.00"
      }
    ],
    "subtotal": "2000.00",
    "deliveryFee": "500.00",
    "deliveryDistanceKm": "0.000",
    "deliveryFeeBreakdown": {
      "base": 500,
      "perKmComponent": 0,
      "surgeMultiplier": 1,
      "capped": false,
      "freeApplied": false
    },
    "deliveryEtaMinutes": null,
    "deliveryFeeLocked": false,
    "deliveryFeeLockedAt": null,
    "total": "2500.00",
    "deliveryAddress": "BackerStreet",
    "deliveryLatitude": "51.5237710",
    "deliveryLongitude": "-0.1587500",
    "status": "pending",
    "rejectionReason": null,
    "completedAt": null,
    "createdAt": "2025-08-22T22:11:30.140Z",
    "updatedAt": "2025-08-22T22:11:30.140Z"
  }
}
*/


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
  openTime: string;
  isOpen: boolean;
  // ratings: number;
  ratings: string;
  reviewCount: string;
  distance: string;
  deliveryFee?: string;
  image: any;
  deliveryTime?: string;
  menu: FoodProps[];
  discounts?: FoodProps[];
  specialOffers?: FoodProps[];
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
  // deliveryAddress: AddressData;
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
