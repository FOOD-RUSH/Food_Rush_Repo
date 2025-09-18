import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNotificationContext } from '@/src/contexts/SimpleNotificationProvider';

const NotificationTest: React.FC = () => {
  const { colors } = useTheme();
  const { 
    sendOrderStatus, 
    scheduleCartReminder, 
    sendPromotion, 
    sendGeneral,
    isAuthenticated,
    userType 
  } = useNotificationContext();

  const testOrderNotification = async () => {
    try {
      await sendOrderStatus('TEST123', 'confirmed', 'Test Restaurant');
      Alert.alert('Success', 'Order notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const testCartReminder = async () => {
    try {
      const notificationId = await scheduleCartReminder(2, 'Test Restaurant', 1); // 1 minute
      Alert.alert('Success', `Cart reminder scheduled: ${notificationId}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule cart reminder');
    }
  };

  const testPromotion = async () => {
    try {
      await sendPromotion('Test Promotion', 'This is a test promotion message!');
      Alert.alert('Success', 'Promotion notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send promotion');
    }
  };

  const testGeneral = async () => {
    try {
      await sendGeneral('Test Notification', 'This is a general test notification!');
      Alert.alert('Success', 'General notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send general notification');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.onSurface }}>
          Please log in to test notifications
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 20,
        color: colors.onSurface 
      }}>
        Notification Test ({userType})
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={testGeneral}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Test General Notification
        </Text>
      </TouchableOpacity>

      {userType === 'customer' && (
        <>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              padding: 15,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={testOrderNotification}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Test Order Notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              padding: 15,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={testCartReminder}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Test Cart Reminder (1 min)
            </Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={testPromotion}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Test Promotion Notification
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationTest;