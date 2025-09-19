import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { useTheme, Card, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';

interface NotificationSettingProps {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  showDivider = false
}) => {
  const { colors } = useTheme();

  const handleToggle = (newValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(newValue);
  };

  return (
    <>
      <View className="flex-row items-center py-4">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <MaterialCommunityIcons 
            name={icon as any} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-base font-semibold mb-1" style={{ color: colors.onSurface }}>
            {title}
          </Text>
          <Text className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        </View>
        
        <Switch
          value={value}
          onValueChange={handleToggle}
          trackColor={{ false: colors.outline, true: colors.primary }}
          thumbColor={value ? colors.onPrimary : colors.onSurfaceVariant}
        />
      </View>
      {showDivider && <Divider className="ml-16" />}
    </>
  );
};

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Notification settings state
  const [settings, setSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    customerMessages: true,
    promotions: false,
    systemUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <CommonView>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-3">
    

          {/* Order Notifications */}
          <Card className="mb-4" style={{ backgroundColor: colors.surface }}>
            <View className="p-4">
              <Text className="text-lg font-bold mb-4" style={{ color: colors.onSurface }}>
                {t('order_notifications')}
              </Text>
              
              <NotificationSetting
                icon="bell-ring"
                title={t('new_orders')}
                subtitle={t('get_notified_when_new_orders_arrive')}
                value={settings.newOrders}
                onValueChange={(value) => updateSetting('newOrders', value)}
                showDivider
              />
              
              <NotificationSetting
                icon="update"
                title={t('order_updates')}
                subtitle={t('notifications_for_order_status_changes')}
                value={settings.orderUpdates}
                onValueChange={(value) => updateSetting('orderUpdates', value)}
                showDivider
              />
              
              <NotificationSetting
                icon="message-text"
                title={t('customer_messages')}
                subtitle={t('messages_from_customers')}
                value={settings.customerMessages}
                onValueChange={(value) => updateSetting('customerMessages', value)}
              />
            </View>
          </Card>

          {/* Marketing Notifications */}
          <Card className="mb-4" style={{ backgroundColor: colors.surface }}>
            <View className="p-4">
              <Text className="text-lg font-bold mb-4" style={{ color: colors.onSurface }}>
                {t('marketing_notifications')}
              </Text>
              
              <NotificationSetting
                icon="tag"
                title={t('promotions_offers')}
                subtitle={t('special_offers_and_promotional_content')}
                value={settings.promotions}
                onValueChange={(value) => updateSetting('promotions', value)}
                showDivider
              />
              
              <NotificationSetting
                icon="information"
                title={t('system_updates')}
                subtitle={t('app_updates_and_important_announcements')}
                value={settings.systemUpdates}
                onValueChange={(value) => updateSetting('systemUpdates', value)}
              />
            </View>
          </Card>

          {/* Delivery Methods */}
          <Card style={{ backgroundColor: colors.surface }}>
            <View className="p-4">
              <Text className="text-lg font-bold mb-4" style={{ color: colors.onSurface }}>
                {t('delivery_methods')}
              </Text>
              
              <NotificationSetting
                icon="email"
                title={t('email_notifications')}
                subtitle={t('receive_notifications_via_email')}
                value={settings.emailNotifications}
                onValueChange={(value) => updateSetting('emailNotifications', value)}
                showDivider
              />
              
              <NotificationSetting
                icon="cellphone"
                title={t('push_notifications')}
                subtitle={t('receive_push_notifications_on_device')}
                value={settings.pushNotifications}
                onValueChange={(value) => updateSetting('pushNotifications', value)}
                showDivider
              />
              
              <NotificationSetting
                icon="message"
                title={t('sms_notifications')}
                subtitle={t('receive_notifications_via_sms')}
                value={settings.smsNotifications}
                onValueChange={(value) => updateSetting('smsNotifications', value)}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default NotificationsScreen;
