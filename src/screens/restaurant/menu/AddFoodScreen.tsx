import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AddFoodScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('add_food_screen')}</Text>
    </View>
  );
};

export default AddFoodScreen;
