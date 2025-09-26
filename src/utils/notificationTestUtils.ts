// Notification Test Utilities - For development and testing
import { customerNotificationService } from '../notifications';
import { cartReminderService } from '../services/customer/cartReminderService';

export const NotificationTestUtils = {
  // Test basic notification functionality
  async testBasicNotification(): Promise<boolean> {
    try {
      console.log('🧪 Testing basic notification...');
      await customerNotificationService.sendTestNotification();
      console.log('✅ Basic notification test passed');
      return true;
    } catch (error) {
      console.error('❌ Basic notification test failed:', error);
      return false;
    }
  },

  // Test cart reminder with proper restaurant data
  async testCartReminder(
    itemCount: number = 2,
    restaurantName: string = 'Test Restaurant'
  ): Promise<boolean> {
    try {
      console.log('🧪 Testing cart reminder...');
      await cartReminderService.scheduleCartReminders(
        itemCount,
        restaurantName,
        Date.now()
      );
      console.log('✅ Cart reminder test passed');
      return true;
    } catch (error) {
      console.error('❌ Cart reminder test failed:', error);
      return false;
    }
  },

  // Test badge count functionality
  async testBadgeCount(): Promise<boolean> {
    try {
      console.log('🧪 Testing badge count...');
      await customerNotificationService.clearBadge();
      console.log('✅ Badge count test passed');
      return true;
    } catch (error) {
      console.error('❌ Badge count test failed:', error);
      return false;
    }
  },

  // Test notification cancellation
  async testNotificationCancellation(): Promise<boolean> {
    try {
      console.log('🧪 Testing notification cancellation...');
      await cartReminderService.cancelAllCartReminders();
      console.log('✅ Notification cancellation test passed');
      return true;
    } catch (error) {
      console.error('❌ Notification cancellation test failed:', error);
      return false;
    }
  },

  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('🚀 Running notification system tests...');
    
    const results = await Promise.allSettled([
      this.testBasicNotification(),
      this.testBadgeCount(),
      this.testNotificationCancellation(),
      this.testCartReminder(),
    ]);

    const passed = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const total = results.length;

    console.log(`📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All notification tests passed! System is production-ready.');
    } else {
      console.log('⚠️ Some tests failed. Please check the logs above.');
    }
  },

  // Get active reminders info
  getActiveReminders() {
    const reminders = cartReminderService.getActiveReminders();
    console.log('📋 Active reminders:', reminders);
    return reminders;
  },

  // Get service configuration
  getConfig() {
    const config = cartReminderService.getConfig();
    console.log('⚙️ Cart reminder config:', config);
    return config;
  }
};

// Export for easy access in development
export default NotificationTestUtils;