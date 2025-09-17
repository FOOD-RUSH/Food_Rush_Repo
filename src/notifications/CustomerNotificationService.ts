// Customer-specific notification service
import NotificationService, { OrderNotification } from './NotficationService';

class CustomerNotificationService extends NotificationService {
  constructor(userId?: string) {
    super({ userType: 'customer', userId });
  }

  // Customer-specific order notifications
  async notifyOrderPlaced(orderId: string, restaurantName: string): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'pending',
      restaurantName,
    });
  }

  async notifyOrderConfirmed(orderId: string, restaurantName: string, estimatedTime?: number): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'confirmed',
      restaurantName,
      estimatedTime,
    });
  }
  

  async notifyOrderPreparing(orderId: string, restaurantName: string): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'preparing',
      restaurantName,
    });
  }

  async notifyOrderReady(orderId: string, restaurantName: string): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'ready',
      restaurantName,
    });
  }

  async notifyOrderOutForDelivery(orderId: string, restaurantName: string): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'picked_up',
      restaurantName,
    });
  }

  async notifyOrderDelivered(orderId: string, restaurantName: string): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'delivered',
      restaurantName,
    });
  }

  async notifyOrderCancelled(orderId: string, restaurantName: string): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'cancelled',
      restaurantName,
    });
  }

  // Customer-specific promotions
  async notifySpecialOffer(title: string, message: string, promotionId?: string): Promise<string> {
    return this.sendPromotionNotification(title, message, promotionId);
  }

  async notifyDeliveryPromotion(discountPercent: number, validUntil: string): Promise<string> {
    return this.sendPromotionNotification(
      'Free Delivery!',
      `Get ${discountPercent}% off delivery fees. Valid until ${validUntil}`,
    );
  }

  // Customer-specific reminders
  async remindAboutCart(minutesFromNow: number = 30): Promise<string> {
    return this.scheduleReminder(
      'Cart Reminder',
      'You have items in your cart. Complete your order now!',
      minutesFromNow,
      { type: 'cart_reminder' }
    );
  }

  async remindToReorder(favoriteRestaurant: string, minutesFromNow: number = 60): Promise<string> {
    return this.scheduleReminder(
      'Time to Eat!',
      `Craving something from ${favoriteRestaurant}? Order now!`,
      minutesFromNow,
      { type: 'reorder_reminder', restaurant: favoriteRestaurant }
    );
  }

  // Cancel order-related notifications
  async cancelOrderNotifications(orderId: string): Promise<void> {
    await this.cancelNotificationsByData({ orderId, type: 'order' });
  }

  // Cancel cart reminders
  async cancelCartReminders(): Promise<void> {
    await this.cancelNotificationsByData({ type: 'cart_reminder' });
  }
}

// Export singleton instance
export const customerNotifications = new CustomerNotificationService();
export default CustomerNotificationService;