import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const NotificationScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <CommonView>
      <View
        className="justify-center items-center flex-1 px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons
          name="notifications-outline"
          size={80}
          color={colors.onSurfaceVariant}
          style={{ marginBottom: 16 }}
        />
        <Text
          className="text-xl font-semibold text-center mb-2"
          style={{ color: colors.onSurface }}
        >
          {t('notifications') || 'Notifications'}
        </Text>
        <Text
          className="text-center text-base"
          style={{ color: colors.onSurfaceVariant }}
        >
          {t('no_notifications_yet') ||
            "No notifications yet. We'll notify you when something interesting happens!"}
        </Text>
      </View>
    </CommonView>
  );
};

export default NotificationScreen;
