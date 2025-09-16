import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const FoodDetailsScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('food_details_screen')}</Text>
    </View>
  );
};

export default FoodDetailsScreen;