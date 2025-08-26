import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NotificationsScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('notifications_screen')}</Text>
    </View>
  );
};

export default NotificationsScreen;
