// Cart Reminder Settings Component
import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import {
  useTheme,
  Switch,
  Button,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useCartReminders } from '@/src/hooks/customer/useCartReminders';

interface CartReminderSettingsProps {
  visible: boolean;
  onDismiss: () => void;
}

const CartReminderSettings: React.FC<CartReminderSettingsProps> = ({
  visible,
  onDismiss,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const {
    reminderEnabled,
    toggleReminders,
    getReminderConfig,
    updateReminderConfig,
    getActiveReminders,
  } = useCartReminders();

  const [config, setConfig] = useState(() => getReminderConfig());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = useCallback(() => {
    try {
      updateReminderConfig(config);
      Alert.alert(
        t('success', 'Success'),
        t('reminder_settings_saved', 'Cart reminder settings have been saved'),
        [{ text: t('ok', 'OK'), onPress: onDismiss }],
      );
    } catch (error) {
      Alert.alert(
        t('error', 'Error'),
        t('failed_to_save_settings', 'Failed to save reminder settings'),
        [{ text: t('ok', 'OK') }],
      );
    }
  }, [config, updateReminderConfig, t, onDismiss]);

  const handleTestReminder = useCallback(() => {
    Alert.alert(
      t('test_reminder', 'Test Reminder'),
      t('test_reminder_message', 'A test reminder will be sent in 10 seconds'),
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('send_test', 'Send Test'),
          onPress: () => {
            // This would trigger a test notification
            console.log('Test reminder scheduled');
          },
        },
      ],
    );
  }, [t]);

  const getActiveReminderInfo = useCallback(() => {
    const activeReminders = getActiveReminders();
    if (activeReminders.length === 0) {
      return t('no_active_reminders', 'No active reminders');
    }

    return t('active_reminders_count', '{{count}} active reminder(s)', {
      count: activeReminders.length,
    });
  }, [getActiveReminders, t]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          <View className="flex-row items-center">
            <IoniconsIcon               name="notifications-outline"
              size={24}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: colors.onSurface }}>
              {t('cart_reminder_settings', 'Cart Reminder Settings')}
            </Text>
          </View>
        </Dialog.Title>

        <Dialog.Content>
          <View className="space-y-4">
            {/* Enable/Disable Reminders */}
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                <Text
                  className="text-base font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {t('enable_cart_reminders', 'Enable Cart Reminders')}
                </Text>
                <Text
                  className="text-sm mt-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t(
                    'cart_reminder_description',
                    'Get notified about items left in your cart',
                  )}
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminders}
                thumbColor={reminderEnabled ? colors.primary : colors.outline}
                trackColor={{
                  false: colors.surfaceVariant,
                  true: colors.primaryContainer,
                }}
              />
            </View>

            {/* Active Reminders Info */}
            {reminderEnabled && (
              <View
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.surfaceVariant }}
              >
                <Text
                  className="text-sm"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {getActiveReminderInfo()}
                </Text>
              </View>
            )}

            {/* Reminder Timing Settings */}
            {reminderEnabled && (
              <View className="space-y-3">
                <Text
                  className="text-base font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {t('reminder_timing', 'Reminder Timing')}
                </Text>

                <View className="space-y-2">
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-sm"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {t('first_reminder', 'First reminder (minutes)')}
                    </Text>
                    <TextInput
                      value={config.firstReminderMinutes.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 25;
                        setConfig((prev) => ({
                          ...prev,
                          firstReminderMinutes: value,
                        }));
                      }}
                      keyboardType="numeric"
                      mode="outlined"
                      dense
                      style={{ width: 80 }}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-sm"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {t('second_reminder', 'Second reminder (minutes)')}
                    </Text>
                    <TextInput
                      value={config.secondReminderMinutes.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 60;
                        setConfig((prev) => ({
                          ...prev,
                          secondReminderMinutes: value,
                        }));
                      }}
                      keyboardType="numeric"
                      mode="outlined"
                      dense
                      style={{ width: 80 }}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Advanced Settings */}
            {reminderEnabled && (
              <TouchableOpacity
                onPress={() => setShowAdvanced(!showAdvanced)}
                className="flex-row items-center justify-between py-2"
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  {t('advanced_settings', 'Advanced Settings')}
                </Text>
                <IoniconsIcon                   name={showAdvanced ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}

            {/* Advanced Settings Content */}
            {reminderEnabled && showAdvanced && (
              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {t('max_reminders', 'Maximum reminders')}
                  </Text>
                  <TextInput
                    value={config.maxReminders.toString()}
                    onChangeText={(text) => {
                      const value = Math.max(
                        1,
                        Math.min(5, parseInt(text) || 2),
                      );
                      setConfig((prev) => ({ ...prev, maxReminders: value }));
                    }}
                    keyboardType="numeric"
                    mode="outlined"
                    dense
                    style={{ width: 80 }}
                  />
                </View>

                <TouchableOpacity onPress={handleTestReminder} className="py-2">
                  <Text
                    className="text-sm font-medium"
                    style={{ color: colors.primary }}
                  >
                    {t('send_test_reminder', 'Send Test Reminder')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>{t('cancel', 'Cancel')}</Button>
          <Button onPress={handleSave} mode="contained">
            {t('save', 'Save')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CartReminderSettings;
