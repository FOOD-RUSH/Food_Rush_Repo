import { View, Text } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const PageTitle = () => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <View className="flex-row flex-1 justify-between item-center px-2">
      <MaterialIcons
        name="arrow-back-ios-new"
        size={20}
        color={colors.onSurface}
      />
      <Text className={`font-bold ${colors.onSurface}`}>{t('page_title')}</Text>
    </View>
  );
};

export default PageTitle;
