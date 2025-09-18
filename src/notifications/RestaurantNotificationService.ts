// Restaurant-specific notification service
import NotificationService, { OrderNotification } from './NotficationService';

class RestaurantNotificationService extends NotificationService {
  constructor(userId?: string) {
    super({ userType: 'restaurant', userId });
  }

  // Restaurant-specific order notifications
  async notifyNewOrder(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'pending',
      customerName,
    });
  }

  async notifyOrderConfirmed(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'confirmed',
      customerName,
    });
  }

  async notifyOrderPreparing(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'preparing',
      customerName,
    });
  }

  async notifyOrderReady(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'ready',
      customerName,
    });
  }

  async notifyOrderPickedUp(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'picked_up',
      customerName,
    });
  }

  async notifyOrderDelivered(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'delivered',
      customerName,
    });
  }

  async notifyOrderCancelled(
    orderId: string,
    customerName?: string,
  ): Promise<string> {
    return this.sendOrderNotification({
      orderId,
      status: 'cancelled',
      customerName,
    });
  }

  // Restaurant-specific business notifications
  async notifyDailyReport(
    totalOrders: number,
    totalRevenue: number,
  ): Promise<string> {
    return this.sendLocalNotification({
      title: '📊 Daily Report',
      body: `Today: ${totalOrders} orders, $${totalRevenue.toFixed(2)} revenue`,
      data: {
        type: 'daily_report',
        totalOrders,
        totalRevenue,
        userType: this.config.userType,
      },
    });
  }

  async notifyLowStock(itemName: string): Promise<string> {
    return this.sendLocalNotification({
      title: '⚠️ Low Stock Alert',
      body: `${itemName} is running low. Update your inventory.`,
      data: {
        type: 'low_stock',
        itemName,
        userType: this.config.userType,
      },
    });
  }

  async notifyPeakHours(expectedOrders: number): Promise<string> {
    return this.sendLocalNotification({
      title: '🔥 Peak Hours Starting',
      body: `Expecting ${expectedOrders} orders in the next hour. Get ready!`,
      data: {
        type: 'peak_hours',
        expectedOrders,
        userType: this.config.userType,
      },
    });
  }

  // Restaurant-specific promotions
  async notifyPromotionPerformance(
    promotionName: string,
    ordersCount: number,
  ): Promise<string> {
    return this.sendPromotionNotification(
      'Promotion Update',
      `Your "${promotionName}" promotion has generated ${ordersCount} orders today!`,
    );
  }

  // Restaurant-specific reminders
  async remindToUpdateMenu(minutesFromNow: number = 60): Promise<string> {
    return this.scheduleReminder(
      'Menu Update',
      'Remember to update your menu for today!',
      minutesFromNow,
      { type: 'menu_reminder' },
    );
  }

  async remindToCheckOrders(minutesFromNow: number = 15): Promise<string> {
    return this.scheduleReminder(
      'Check Orders',
      'You have pending orders that need attention.',
      minutesFromNow,
      { type: 'order_check_reminder' },
    );
  }

  async remindBusinessHours(minutesFromNow: number = 30): Promise<string> {
    return this.scheduleReminder(
      'Business Hours',
      'Your restaurant will close soon. Prepare for closing.',
      minutesFromNow,
      { type: 'business_hours_reminder' },
    );
  }

  // Cancel order-related notifications
  async cancelOrderNotifications(orderId: string): Promise<void> {
    await this.cancelNotificationsByData({ orderId, type: 'order' });
  }

  // Cancel business reminders
  async cancelBusinessReminders(): Promise<void> {
    await this.cancelNotificationsByData({
      userType: 'restaurant',
      type: 'menu_reminder',
    });
  }

  // Cancel all restaurant notifications
  async cancelAllRestaurantNotifications(): Promise<void> {
    await this.cancelNotificationsByData({ userType: 'restaurant' });
  }
}

// Export singleton instance
export const restaurantNotifications = new RestaurantNotificationService();
export default RestaurantNotificationService;
