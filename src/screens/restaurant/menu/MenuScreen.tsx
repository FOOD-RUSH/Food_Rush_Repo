import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MenuScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('menu_screen')}</Text>
    </View>
  );
};

export default MenuScreen;
