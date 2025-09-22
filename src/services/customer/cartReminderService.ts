// Cart Reminder Service - Manages cart abandonment notifications
import { customerNotificationService } from '../../notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartReminderConfig {
  firstReminderMinutes: number; // Default: 25 minutes
  secondReminderMinutes: number; // Default: 60 minutes (1 hour)
  maxReminders: number; // Default: 2
}

export interface ActiveCartReminder {
  notificationId: string;
  scheduledAt: number;
  reminderType: 'first' | 'second';
  cartItemCount: number;
  restaurantName?: string;
}

class CartReminderService {
  private static instance: CartReminderService;
  private config: CartReminderConfig;
  private activeReminders: Map<string, ActiveCartReminder> = new Map();
  private storageKey = 'cart-reminders';

  constructor(config?: Partial<CartReminderConfig>) {
    this.config = {
      firstReminderMinutes: 25,
      secondReminderMinutes: 60,
      maxReminders: 2,
      ...config,
    };
    this.loadActiveReminders();
  }

  static getInstance(config?: Partial<CartReminderConfig>): CartReminderService {
    if (!CartReminderService.instance) {
      CartReminderService.instance = new CartReminderService(config);
    }
    return CartReminderService.instance;
  }

  // Load active reminders from storage
  private async loadActiveReminders(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        const reminders = JSON.parse(stored);
        this.activeReminders = new Map(Object.entries(reminders));
        
        // Clean up expired reminders
        await this.cleanupExpiredReminders();
      }
    } catch (error) {
      console.error('Failed to load cart reminders:', error);
    }
  }

  // Save active reminders to storage
  private async saveActiveReminders(): Promise<void> {
    try {
      const remindersObj = Object.fromEntries(this.activeReminders);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(remindersObj));
    } catch (error) {
      console.error('Failed to save cart reminders:', error);
    }
  }

  // Clean up expired or invalid reminders
  private async cleanupExpiredReminders(): Promise<void> {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, reminder] of Array.from(this.activeReminders.entries())) {
      // Remove reminders older than 2 hours
      if (now - reminder.scheduledAt > 2 * 60 * 60 * 1000) {
        expiredKeys.push(key);
        try {
          await customerNotificationService.cancelNotification(reminder.notificationId);
        } catch (error) {
          console.warn('Failed to cancel expired notification:', error);
        }
      }
    }

    expiredKeys.forEach(key => this.activeReminders.delete(key));
    
    if (expiredKeys.length > 0) {
      await this.saveActiveReminders();
    }
  }

  // Schedule cart reminder notifications
  async scheduleCartReminders(
    cartItemCount: number,
    restaurantName?: string,
    lastActivity?: number
  ): Promise<void> {
    if (cartItemCount === 0) {
      await this.cancelAllCartReminders();
      return;
    }

    try {
      // Cancel existing reminders first
      await this.cancelAllCartReminders();

      const now = Date.now();
      const activityTime = lastActivity || now;
      
      // Calculate when to send reminders based on last activity
      const firstReminderTime = activityTime + (this.config.firstReminderMinutes * 60 * 1000);
      const secondReminderTime = activityTime + (this.config.secondReminderMinutes * 60 * 1000);
      
      // Only schedule if the reminder time is in the future
      if (firstReminderTime > now) {
        await this.scheduleReminder(
          'first',
          cartItemCount,
          Math.ceil((firstReminderTime - now) / (60 * 1000)), // minutes from now
          restaurantName
        );
      }

      if (secondReminderTime > now && this.config.maxReminders > 1) {
        await this.scheduleReminder(
          'second',
          cartItemCount,
          Math.ceil((secondReminderTime - now) / (60 * 1000)), // minutes from now
          restaurantName
        );
      }

      await this.saveActiveReminders();
    } catch (error) {
      console.error('Failed to schedule cart reminders:', error);
    }
  }

  // Schedule a single reminder
  private async scheduleReminder(
    type: 'first' | 'second',
    cartItemCount: number,
    minutesFromNow: number,
    restaurantName?: string
  ): Promise<void> {
    const reminderMessages = this.getReminderMessages(type, cartItemCount, restaurantName);
    
    try {
      const notificationId = await customerNotificationService.scheduleReminder(
        reminderMessages.title,
        reminderMessages.body,
        minutesFromNow,
        {
          type: 'cart_reminder',
          reminderType: type,
          cartItemCount,
          restaurantName,
          deepLink: 'foodrush://cart',
        }
      );

      const reminderKey = `cart_${type}_${Date.now()}`;
      this.activeReminders.set(reminderKey, {
        notificationId,
        scheduledAt: Date.now(),
        reminderType: type,
        cartItemCount,
        restaurantName,
      });

      console.log(`Scheduled ${type} cart reminder for ${minutesFromNow} minutes from now`);
    } catch (error) {
      console.error(`Failed to schedule ${type} cart reminder:`, error);
    }
  }

  // Get reminder messages based on type and context
  private getReminderMessages(
    type: 'first' | 'second',
    cartItemCount: number,
    restaurantName?: string
  ): { title: string; body: string } {
    const itemText = cartItemCount === 1 ? 'item' : 'items';
    const restaurantText = restaurantName ? ` from ${restaurantName}` : '';

    if (type === 'first') {
      return {
        title: "🛒 Don't Forget Your Cart!",
        body: `You have ${cartItemCount} ${itemText}${restaurantText} waiting for you. Complete your order now!`,
      };
    } else {
      return {
        title: '⏰ Last Chance!',
        body: `Your cart${restaurantText} is still waiting! Order now before items become unavailable.`,
      };
    }
  }

  // Cancel all cart reminders - optimized to prevent multiple calls
  private isCancelling = false;
  
  async cancelAllCartReminders(): Promise<void> {
    // Prevent multiple simultaneous cancellation calls
    if (this.isCancelling) {
      console.log('Cart reminder cancellation already in progress');
      return;
    }
    
    // If no active reminders, skip cancellation
    if (this.activeReminders.size === 0) {
      return;
    }
    
    this.isCancelling = true;
    
    try {
      // Cancel all scheduled notifications
      const cancelPromises = Array.from(this.activeReminders.values()).map(async (reminder) => {
        try {
          await customerNotificationService.cancelNotification(reminder.notificationId);
        } catch (error) {
          console.warn('Failed to cancel notification:', error);
        }
      });
      
      await Promise.all(cancelPromises);

      // Clear the reminders map
      this.activeReminders.clear();
      await this.saveActiveReminders();
      
      console.log('All cart reminders cancelled');
    } catch (error) {
      console.error('Failed to cancel cart reminders:', error);
    } finally {
      this.isCancelling = false;
    }
  }

  // Cancel specific type of reminders
  async cancelRemindersByType(type: 'first' | 'second'): Promise<void> {
    try {
      const toRemove: string[] = [];
      
      for (const [key, reminder] of Array.from(this.activeReminders.entries())) {
        if (reminder.reminderType === type) {
          try {
            await customerNotificationService.cancelNotification(reminder.notificationId);
            toRemove.push(key);
          } catch (error) {
            console.warn('Failed to cancel notification:', error);
          }
        }
      }

      toRemove.forEach(key => this.activeReminders.delete(key));
      await this.saveActiveReminders();
      
      console.log(`Cancelled ${type} cart reminders`);
    } catch (error) {
      console.error(`Failed to cancel ${type} cart reminders:`, error);
    }
  }

  // Get active reminders info
  getActiveReminders(): ActiveCartReminder[] {
    return Array.from(this.activeReminders.values());
  }

  // Update reminder configuration
  updateConfig(newConfig: Partial<CartReminderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): CartReminderConfig {
    return { ...this.config };
  }

  // Initialize the service (call this when app starts)
  async initialize(): Promise<void> {
    try {
      await customerNotificationService.initialize();
      await this.loadActiveReminders();
      console.log('Cart reminder service initialized');
    } catch (error) {
      console.error('Failed to initialize cart reminder service:', error);
    }
  }

  // Handle app state changes (pause/resume)
  async handleAppStateChange(nextAppState: string): Promise<void> {
    if (nextAppState === 'active') {
      // App became active, clean up expired reminders
      await this.cleanupExpiredReminders();
    }
  }
}

// Export singleton instance
export const cartReminderService = CartReminderService.getInstance();
export default CartReminderService;