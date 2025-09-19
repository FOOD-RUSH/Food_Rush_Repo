import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { useAppStore } from '@/src/stores/AppStore';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '@/src/locales/i18n';
import { RadioButton, useTheme } from 'react-native-paper';
import { RESTAURANT_COLORS } from '@/src/config/restaurantTheme';
import CommonView from '@/src/components/common/CommonView';

type Props = RestaurantProfileStackScreenProps<'AccountSettings'>;

const AccountSettingsScreen = ({ navigation }: Props) => {
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Theme from global store
  const themeMode = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const isDarkMode = themeMode === 'dark';
  const toggleDarkMode = (value: boolean) => setTheme(value ? 'dark' : 'light');

  // Language context
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = useCallback(
    async (newLanguage: SupportedLanguage) => {
      try {
        await changeLanguage(newLanguage);
        setShowLanguageSelector(false);
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    },
    [changeLanguage],
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, contentAnim]);

  const styles = getStyles(isDarkMode);

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View style={{ opacity: contentAnim, marginTop: 24 }}>
          
          {/* <Text style={styles.sectionTitle}>Notification Preferences</Text> */}
        
          {/* App Preferences */}
          <Text style={styles.sectionTitle}>{t('app_preferences')}</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('dark_mode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#ccc', true: RESTAURANT_COLORS.PRIMARY }}
              thumbColor={isDarkMode ? RESTAURANT_COLORS.PRIMARY : '#fff'}
            />
          </View>
          <View style={styles.selectorRow}>
            <Text style={styles.switchLabel}>{t('language')}</Text>
            <TouchableOpacity
              style={styles.languageSelector}
              onPress={() => setShowLanguageSelector(true)}
            >
              <View style={styles.currentLanguage}>
                <Text style={styles.flag}>
                  {availableLanguages[currentLanguage].flag}
                </Text>
                <Text style={styles.currentLanguageText}>
                  {availableLanguages[currentLanguage].name}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={16} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('select_language')}</Text>
              <TouchableOpacity
                onPress={() => setShowLanguageSelector(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList}>
              {Object.entries(availableLanguages).map(([code, language]) => (
                <TouchableOpacity
                  key={code}
                  onPress={() => handleLanguageChange(code as SupportedLanguage)}
                  style={styles.languageItem}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.flag}>{language.flag}</Text>
                    <Text
                      style={[
                        styles.languageName,
                        currentLanguage === code && styles.selectedText,
                      ]}
                    >
                      {language.name}
                    </Text>
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
          </View>
        </View>
      )}
    </CommonView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.BACKGROUND_DARK : RESTAURANT_COLORS.BACKGROUND_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: RESTAURANT_COLORS.PRIMARY,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RESTAURANT_COLORS.PRIMARY,
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 20,
  },
  inputGroup: {
    marginBottom: 18,
    marginHorizontal: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: RESTAURANT_COLORS.PRIMARY,
    marginBottom: 4,
  },
  input: {
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1.2,
    borderColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
    color: isDarkMode ? RESTAURANT_COLORS.TEXT_DARK : RESTAURANT_COLORS.TEXT_LIGHT,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
  },
  switchLabel: {
    fontSize: 15,
    color: isDarkMode ? RESTAURANT_COLORS.TEXT_DARK : RESTAURANT_COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RESTAURANT_COLORS.PRIMARY,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    marginHorizontal: 20,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: RESTAURANT_COLORS.PRIMARY,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 12,
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  currentLanguageText: {
    fontSize: 16,
    color: isDarkMode ? RESTAURANT_COLORS.TEXT_DARK : RESTAURANT_COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? RESTAURANT_COLORS.TEXT_DARK : RESTAURANT_COLORS.TEXT_LIGHT,
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: RESTAURANT_COLORS.BORDER_LIGHT,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: RESTAURANT_COLORS.TEXT_LIGHT,
    marginLeft: 12,
  },
  selectedText: {
    color: RESTAURANT_COLORS.PRIMARY,
  },
});

export default AccountSettingsScreen;
