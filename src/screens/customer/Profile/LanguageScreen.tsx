import React, { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import CommonView from '@/src/components/common/CommonView';
import { RadioButton, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '@/src/locales/i18n';
import {
  Typography,
  Heading4,
  LabelLarge,
} from '@/src/components/common/Typography';

const LanguageScreen = ({
  navigation,
}: RootStackScreenProps<'LanguageScreen'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = useCallback(
    async (newLanguage: SupportedLanguage) => {
      try {
        await changeLanguage(newLanguage);
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    },
    [changeLanguage],
  );

  return (
    <CommonView>
      <ScrollView className="py-5">
        {Object.entries(availableLanguages).map(([code, language]) => (
          <TouchableOpacity
            key={code}
            onPress={() => handleLanguageChange(code as SupportedLanguage)}
            className="flex-row items-center justify-between py-4 px-4"
          >
            <View className="flex-row items-center">
              <Typography variant="h4" style={{ marginRight: 12 }}>
                {language.flag}
              </Typography>
              <LabelLarge color={colors.onSurface} weight="semibold">
                {language.name}
              </LabelLarge>
            </View>
            <RadioButton
              value={code}
              status={currentLanguage === code ? 'checked' : 'unchecked'}
              onPress={() => handleLanguageChange(code as SupportedLanguage)}
              color={colors.primary}
              uncheckedColor={colors.outline}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </CommonView>
  );
};

export default LanguageScreen;
