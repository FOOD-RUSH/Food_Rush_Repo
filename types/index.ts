export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  userName: string,
  userType: 'customer' | 'restaurant' | 'delivery';
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  location: Location;
  images: string[];
  menu: MenuItem[];
}

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

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
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