import React from 'react';
import { Text, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const RestaurantMenuCard = ({
  image,
  foodPrice,
  foodName,
  foodCategory,
}: {
  image: any;
  foodName: any;
  foodPrice: number;
  foodCategory: string;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <Card
      mode="outlined"
      style={{
        margin: 10,
        borderRadius: 10,
        backgroundColor: colors.surface,
        boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
      }}
    >
      <View className="flex-row items-center">
        <Card.Cover
          source={image}
          style={{
            height: 100,
            width: 100,
            borderRadius: 10,
            overflow: 'hidden',
            objectFit: 'cover',
          }}
        />
        {/* Price */}
        <View className="flex-col justify-center flex-1 ml-2">
          <Text className={`text-xl font-semibold ${colors.onSurface}`}>
            {foodName}
          </Text>
          <Text
            className="justify-center text-center items-center"
            style={{ color: colors.primary }}
          >
            {foodPrice}
            {t('fcfa_suffix')}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default RestaurantMenuCard;
