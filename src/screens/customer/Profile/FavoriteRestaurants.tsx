import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import React from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';

const FavoriteRestaurants = ({
  navigation,
}: RootStackScreenProps<'FavoriteRestaurantScreen'>) => {
  const { t } = useTranslation('translation');
  return (
    <View className="h-full items-center">
      <Text>{t('favorite_restaurants')}</Text>
    </View>
  );
};

export default FavoriteRestaurants;
