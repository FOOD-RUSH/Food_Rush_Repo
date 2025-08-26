import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderDetailsScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('order_details_screen')}</Text>
    </View>
  );
};

export default OrderDetailsScreen;
