import { View, Text } from 'react-native';
import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  title: string;
  onPress: () => void;
}
const HomeScreenHeaders = ({ onPress, title }: HeaderProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const primaryColor = colors.primary;

  return (
    <View className="mx-2 mt-7" style={{ backgroundColor: colors.background }}>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`font-bold text-xl `}
          style={{ color: colors.onSurface }}
        >
          {title}
        </Text>
        <Button onPress={onPress} style={{ marginLeft: 15 }}>
          <Text className={`text-[${primaryColor}]`}>{t('see_more')}</Text>
        </Button>
      </View>
    </View>
  );
};

export default HomeScreenHeaders;
