import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AnalyticsScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('analytics_screen')}</Text>
    </View>
  );
};

export default AnalyticsScreen;
