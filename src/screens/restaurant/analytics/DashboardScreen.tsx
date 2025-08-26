import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('dashboard_screen')}</Text>
    </View>
  );
};

export default DashboardScreen;
