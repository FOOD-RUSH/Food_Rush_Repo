import { IoniconsIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LanguageSelector } from '@/src/components/common/LanguageSelector';


interface LanguageSettingsProps {
  style?: any;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  style,
}) => {
  const { t } = useTranslation();
  const { currentLanguage, availableLanguages } = useLanguage();

  return (
    <ScrollView style={[styles.container, style]}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('language_settings')}</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{t('app_language')}</Text>
            <Text style={styles.settingDescription}>
              {t('select_app_language')}
            </Text>
          </View>
          <LanguageSelector showLabel={false} />
        </View>

        <View style={styles.divider} />

        <View style={styles.languageList}>
          <Text style={styles.infoTitle}>{t('available_languages')}</Text>
          {Object.entries(availableLanguages).map(([code, language]) => (
            <View key={code} style={styles.languageItem}>
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
              </View>
              {code === currentLanguage && (
                <IoniconsIcon name="checkmark-circle" size={20} color="#007AFF" />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  languageList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
});

export default LanguageSettings;
