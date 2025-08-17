import React, { useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonView from '@/src/components/common/CommonView';
import { RadioButton, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useLanguage } from '@/src/contexts/LanguageContext';

const LanguageScreen = ({
  navigation,
}: RootStackScreenProps<'LanguageScreen'>) => {
  const { colors } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = useCallback((newLanguage: 'en' | 'fr') => {
    setLanguage(newLanguage);
  }, [setLanguage]);

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'fr', name: 'Français (FR)' },
  ];

  return (
    <CommonView>
      <ScrollView className="py-5">
        {languages.map((lang) => (
          <View 
            key={lang.code} 
            className="flex-row items-center justify-between py-4 px-4"
          >
            <Text 
              className="text-[18px] font-semibold"
              style={{ color: colors.onSurface }}
            >
              {lang.name}
            </Text>
            <RadioButton
              value={lang.code}
              status={language === lang.code ? 'checked' : 'unchecked'}
              onPress={() => handleLanguageChange(lang.code as 'en' | 'fr')}
              color={colors.primary}
              uncheckedColor={colors.outline}
            />
          </View>
        ))}
      </ScrollView>
    </CommonView>
  );
};

export default LanguageScreen;
