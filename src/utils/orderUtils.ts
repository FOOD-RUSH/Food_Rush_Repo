import { Order } from '../services/restaurant/orderApi';

/**
 * Utility functions for order management and display
 */

export const ORDER_STATUS_PRIORITY = {
  pending: 1,
  confirmed: 2,
  preparing: 3,
  ready_for_pickup: 4,
  out_for_delivery: 5,
  delivered: 6,
  cancelled: 7,
} as const;

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const;

export const ORDER_STATUS_COLORS = {
  pending: '#F59E0B', // Amber
  confirmed: '#10B981', // Emerald
  preparing: '#3B82F6', // Blue
  ready_for_pickup: '#8B5CF6', // Violet
  out_for_delivery: '#06B6D4', // Cyan
  delivered: '#059669', // Green
  cancelled: '#EF4444', // Red
} as const;

/**
 * Get customer name from order data with fallback
 */
export const getCustomerName = (order: Order): string => {
  return order.customer?.fullName || order.customerName || 'Unknown Customer';
};

/**
 * Get customer phone from order data with fallback
 */
export const getCustomerPhone = (order: Order): string => {
  return order.customer?.phoneNumber || order.customerPhone || 'No phone';
};

/**
 * Get customer email from order data with fallback
 */
export const getCustomerEmail = (order: Order): string => {
  return order.customer?.email || 'No email';
};

/**
 * Calculate time since order was created
 */
export const getTimeSinceOrder = (order: Order): string => {
  const orderTime = new Date(order.createdAt || order.time);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - orderTime.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const hours = Math.floor(diffInMinutes / 60);
  if (hours < 24) return `${hours}h ${diffInMinutes % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/**
 * Check if order is overdue (pending for more than 5 minutes)
 */
export const isOrderOverdue = (order: Order): boolean => {
  if (order.status !== 'pending') return false;
  const orderTime = new Date(order.createdAt || order.time);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - orderTime.getTime()) / (1000 * 60),
  );
  return diffInMinutes > 5;
};

/**
 * Sort orders by priority (pending first, then by creation time)
 */
export const sortOrdersByPriority = (orders: Order[]): Order[] => {
  return [...orders].sort((a, b) => {
    // First sort by status priority
    const priorityDiff = ORDER_STATUS_PRIORITY[a.status] - ORDER_STATUS_PRIORITY[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by creation time (newest first)
    const timeA = new Date(a.createdAt || a.time).getTime();
    const timeB = new Date(b.createdAt || b.time).getTime();
    return timeB - timeA;
  });
};

/**
 * Format order total with currency
 */
export const formatOrderTotal = (total: number, currency: string = 'XAF'): string => {
  return `${total.toLocaleString()} ${currency}`;
};

/**
 * Get order items summary text
 */
export const getOrderItemsSummary = (order: Order): string => {
  if (!order.items || order.items.length === 0) return 'No items';
  
  const summary = order.items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(', ');
    
  // Truncate if too long
  return summary.length > 100 ? `${summary.substring(0, 97)}...` : summary;
};

/**
 * Check if order can be confirmed
 */
export const canConfirmOrder = (order: Order): boolean => {
  return order.status === 'pending';
};

/**
 * Check if order can be rejected
 */
export const canRejectOrder = (order: Order): boolean => {
  return order.status === 'pending';
};

/**
 * Check if order can be marked as preparing
 */
export const canMarkAsPreparing = (order: Order): boolean => {
  return order.status === 'confirmed';
};

/**
 * Check if order can be marked as ready
 */
export const canMarkAsReady = (order: Order): boolean => {
  return order.status === 'preparing';
};

/**
 * Get next possible status for an order
 */
export const getNextOrderStatus = (currentStatus: Order['status']): Order['status'] | null => {
  const statusFlow: Record<Order['status'], Order['status'] | null> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready_for_pickup',
    ready_for_pickup: 'out_for_delivery',
    out_for_delivery: 'delivered',
    delivered: null,
    cancelled: null,
  };
  
  return statusFlow[currentStatus];
};

/**
 * Validate order data structure
 */
export const validateOrderData = (order: any): order is Order => {
  return (
    order &&
    typeof order.id === 'string' &&
    typeof order.status === 'string' &&
    typeof order.total === 'number' &&
    Array.isArray(order.items)
  );
};

/**
 * Log order data for debugging
 */
export const logOrderData = (order: Order, context: string = ''): void => {
  console.log(`📋 [ORDER ${context}]`, {
    id: order.id,
    status: order.status,
    customer: getCustomerName(order),
    total: formatOrderTotal(order.total),
    itemsCount: order.items?.length || 0,
    timeSince: getTimeSinceOrder(order),
    isOverdue: isOrderOverdue(order),
  });
};

/**
 * Create order summary for logging
 */
export const createOrderSummary = (orders: Order[]): object => {
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const overdueCount = orders.filter(isOrderOverdue).length;

  return {
    totalOrders: orders.length,
    statusBreakdown: statusCounts,
    totalValue: formatOrderTotal(totalValue),
    overdueOrders: overdueCount,
    averageOrderValue: orders.length > 0 ? formatOrderTotal(totalValue / orders.length) : '0 XAF',
  };
};