import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const EditFoodScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('edit_food_screen')}</Text>
    </View>
  );
};

export default EditFoodScreen;
