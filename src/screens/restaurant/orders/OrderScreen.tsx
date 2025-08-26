import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('order_screen')}</Text>
    </View>
  );
};

export default OrderScreen;
