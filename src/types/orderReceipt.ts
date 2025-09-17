import { Order, OrderStatus } from '@/src/types';

// OrderReceipt interface that extends the real Order type
export interface OrderReceipt extends Order {
  // Additional fields that might be needed for receipt display
  orderNumber?: string;
  restaurant?: {
    name: string;
    address: string;
    phone?: string;
  };
  delivery?: {
    address: string;
    estimatedTime?: string;
    deliveredAt?: string;
    rider?: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

// Helper function to format order number
export const formatOrderNumber = (orderId: string): string => {
  return `#FR-${orderId.slice(-8).toUpperCase()}`;
};

// Helper function to get currency symbol
export const getCurrencySymbol = (): string => {
  return 'FCFA';
};

// Helper function to get placeholder image for food items
export const getFoodPlaceholderImage = () => {
  return require('@/assets/images/background.png');
};
