export interface OrderReceipt {
  id: string;
  orderNumber: string;
  date: string;
  status: 'completed' | 'cancelled' | 'processing' | 'delivered';
  restaurant: {
    name: string;
    address: string;
    image: any;
    phone?: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: any;
    category: string;
    description?: string;
  }[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  delivery: {
    address: string;
    estimatedTime: string;
    deliveredAt?: string;
    driver?: {
      name: string;
      rating: number;
      phone?: string;
    };
  };
  payment: {
    method: 'card' | 'cash' | 'mobile_money';
    lastFour?: string;
    provider?: string;
  };
  timeline?: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

// Mock data for development
export const mockOrderReceipt: OrderReceipt = {
  id: 'order_123456',
  orderNumber: '#FR-2024-001234',
  date: '2024-01-15T14:30:00Z',
  status: 'completed',
  restaurant: {
    name: 'Delicious Pizza Place',
    address: '123 Food Street, Yaoundé',
    image: require('@/assets/images/background.png'),
    phone: '+237 6XX XXX XXX'
  },
  items: [
    {
      id: 'item_1',
      name: 'Margherita Pizza',
      price: 4500,
      quantity: 2,
      image: require('@/assets/images/background.png'),
      category: 'Pizza',
      description: 'Classic margherita with fresh mozzarella'
    },
    {
      id: 'item_2',
      name: 'Chicken Burger',
      price: 3500,
      quantity: 1,
      image: require('@/assets/images/background.png'),
      category: 'Burgers',
      description: 'Grilled chicken breast with veggies'
    },
    {
      id: 'item_3',
      name: 'French Fries',
      price: 1500,
      quantity: 1,
      image: require('@/assets/images/background.png'),
      category: 'Sides',
      description: 'Crispy golden fries'
    }
  ],
  pricing: {
    subtotal: 14000,
    deliveryFee: 1000,
    tax: 700,
    discount: 500,
    total: 15200,
    currency: 'FCFA'
  },
  delivery: {
    address: '456 Customer Avenue, Yaoundé',
    estimatedTime: '30-45 min',
    deliveredAt: '2024-01-15T15:15:00Z',
    driver: {
      name: 'Jean Paul',
      rating: 4.8,
      phone: '+237 6XX XXX XXX'
    }
  },
  payment: {
    method: 'mobile_money',
    provider: 'Orange Money',
    lastFour: '7890'
  },
  timeline: [
    {
      status: 'ordered',
      timestamp: '2024-01-15T14:30:00Z',
      description: 'Order placed successfully'
    },
    {
      status: 'confirmed',
      timestamp: '2024-01-15T14:32:00Z',
      description: 'Restaurant confirmed order'
    },
    {
      status: 'preparing',
      timestamp: '2024-01-15T14:45:00Z',
      description: 'Food is being prepared'
    },
    {
      status: 'delivering',
      timestamp: '2024-01-15T15:00:00Z',
      description: 'Driver is on the way'
    },
    {
      status: 'delivered',
      timestamp: '2024-01-15T15:15:00Z',
      description: 'Order delivered successfully'
    }
  ]
};
