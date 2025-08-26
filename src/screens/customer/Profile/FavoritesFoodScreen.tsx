import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import React from 'react';

const FavoritesFoodScreen = () => {
  const { t } = useTranslation('translation');
  return (
    <View>
      <Text>{t('favorites_food_screen')}</Text>
    </View>
  );
};

export default FavoritesFoodScreen;
