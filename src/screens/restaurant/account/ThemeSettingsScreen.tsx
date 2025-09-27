import { MaterialCommunityIcon, IoniconsIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {
  useTheme,
  Card,
  RadioButton,
  Switch,
  Divider,
} from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import CommonView from '@/src/components/common/CommonView';
import { useAppStore } from '@/src/stores/AppStore';
import {
  Typography,
  Heading4,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'en' | 'fr';

const ThemeSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();

  const { theme, setTheme } = useAppStore();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    i18n.language as Language,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const themeOptions = [
    {
      value: 'light' as ThemeMode,
      label: t('light_theme'),
      description: t('light_theme_description'),
      icon: 'white-balance-sunny',
      color: '#007aff',
    },
    {
      value: 'dark' as ThemeMode,
      label: t('dark_theme'),
      description: t('dark_theme_description'),
      icon: 'moon-waning-crescent',
      color: '#007aff',
    },
    {
      value: 'system' as ThemeMode,
      label: t('system_theme'),
      description: t('system_theme_description'),
      icon: 'cellphone',
      color: '#007aff',
    },
  ];

  const languageOptions = [
    {
      value: 'en' as Language,
      label: 'English',
      description: 'English (United States)',
      flag: '🇺🇸',
    },
    {
      value: 'fr' as Language,
      label: 'Français',
      description: 'French (Cameroon)',
      flag: '🇨🇲',
    },
  ];

  const handleThemeChange = async (newTheme: ThemeMode) => {
    try {
      setIsLoading(true);
      Haptics.selectionAsync();

      setSelectedTheme(newTheme);
      setTheme(newTheme);

      // Simulate API call to save preference
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      setIsLoading(true);
      Haptics.selectionAsync();

      setSelectedLanguage(newLanguage);
      await i18n.changeLanguage(newLanguage);
      setShowLanguageModal(false);

      // Simulate API call to save preference
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to update language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderThemeOption = (option: (typeof themeOptions)[0]) => (
    <TouchableOpacity
      key={option.value}
      onPress={() => handleThemeChange(option.value)}
      disabled={isLoading}
      style={{
        marginBottom: 12,
      }}
    >
      <Card
        style={{
          backgroundColor: colors.background,
          borderWidth: selectedTheme === option.value ? 2 : 1,
          borderColor:
            selectedTheme === option.value ? '#007aff' : colors.outline,
        }}
      >
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: option.color + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <MaterialCommunityIcon                 name={option.icon as any}
                size={20}
                color={option.color}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Label
                color={colors.onSurface}
                weight="semibold"
                style={{ marginBottom: 2 }}
              >
                {option.label}
              </Label>
              <Caption color={colors.onSurfaceVariant}>
                {option.description}
              </Caption>
            </View>

            <RadioButton
              value={option.value}
              status={selectedTheme === option.value ? 'checked' : 'unchecked'}
              onPress={() => handleThemeChange(option.value)}
              color="#007aff"
              disabled={isLoading}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderLanguageDropdown = () => {
    const selectedOption = languageOptions.find(
      (option) => option.value === selectedLanguage,
    );

    return (
      <TouchableOpacity
        onPress={() => setShowLanguageModal(true)}
        disabled={isLoading}
        style={{
          backgroundColor: colors.surfaceVariant,
          borderWidth: 1,
          borderColor: colors.outline,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#007aff20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Typography variant="h5">{selectedOption?.flag}</Typography>
          </View>

          <View style={{ flex: 1 }}>
            <Label
              color={colors.onSurface}
              weight="semibold"
              style={{ marginBottom: 2 }}
            >
              {selectedOption?.label}
            </Label>
            <Caption color={colors.onSurfaceVariant}>
              {selectedOption?.description}
            </Caption>
          </View>
        </View>

        <IoniconsIcon           name="chevron-down"
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    );
  };

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.outline,
            backgroundColor: colors.background,
          }}
        >
          <Heading5 color={colors.onBackground} weight="bold">
            {t('select_language')}
          </Heading5>
          <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
            <IoniconsIcon name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={languageOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleLanguageChange(item.value)}
              disabled={isLoading}
              style={{
                padding: 16,
                backgroundColor: colors.background,
                borderBottomWidth: 1,
                borderBottomColor: colors.outline + '30',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Typography variant="h5">{item.flag}</Typography>
                </View>

                <View style={{ flex: 1 }}>
                  <Label
                    color={colors.onSurface}
                    weight="semibold"
                    style={{ marginBottom: 2 }}
                  >
                    {item.label}
                  </Label>
                  <Caption color={colors.onSurfaceVariant}>
                    {item.description}
                  </Caption>
                </View>

                {selectedLanguage === item.value && (
                  <IoniconsIcon name="checkmark" size={24} color="#007aff" />
                )}
              </View>
            </TouchableOpacity>
          )}
          style={{ backgroundColor: colors.background }}
        />
      </View>
    </Modal>
  );

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

        {/* Theme Settings */}
        <View style={{ padding: 16 }}>
          <Heading5
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: 16 }}
          >
            {t('appearance')}
          </Heading5>

          {themeOptions.map(renderThemeOption)}
        </View>

        {/* Language Settings */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Heading5
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: 16 }}
          >
            {t('language')}
          </Heading5>

          {renderLanguageDropdown()}
        </View>

        {/* Theme Preview */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Heading5
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: 16 }}
          >
            {t('preview')}
          </Heading5>

          <Card style={{ backgroundColor: colors.surface }}>
            <View style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#007aff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialCommunityIcon                     name="store"
                    size={16}
                    color="white"
                  />
                </View>
                <View>
                  <Label color={colors.onSurface} weight="semibold">
                    {t('sample_restaurant')}
                  </Label>
                  <Caption color={colors.onSurfaceVariant}>
                    {t('theme_preview_description')}
                  </Caption>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#007aff20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <Caption color="#007aff" weight="semibold">
                    {t('primary_color')}
                  </Caption>
                </View>
                <View
                  style={{
                    backgroundColor: '#00C85120',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <Caption color="#00C851" weight="semibold">
                    {t('success_color')}
                  </Caption>
                </View>
                <View
                  style={{
                    backgroundColor: '#FF880020',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <Caption color="#FF8800" weight="semibold">
                    {t('warning_color')}
                  </Caption>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Language Selection Modal */}
      {renderLanguageModal()}
    </CommonView>
  );
};

export default ThemeSettingsScreen;
