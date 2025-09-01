import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import React from 'react';

const OrderHistoryScreen = () => {
  const { t } = useTranslation('translation');
  return (
    <View>
      <Text>{t('order_history_screen')}</Text>
    </View>
  );
};

export default OrderHistoryScreen;
