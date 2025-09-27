import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { SupportedLanguage } from '@/src/locales/i18n';


interface LanguageSelectorProps {
  style?: any;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  style,
  showLabel = true,
}) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    await changeLanguage(language);
    setIsModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: [string, any] }) => {
    const [code, language] = item;
    const isSelected = code === currentLanguage;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(code as SupportedLanguage)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{language.flag}</Text>
          <Text
            style={[styles.languageName, isSelected && styles.selectedText]}
          >
            {language.name}
          </Text>
        </View>
        {isSelected && <IoniconsIcon name="checkmark" size={20} color="#007AFF" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.currentLanguage}>
          <Text style={styles.flag}>
            {availableLanguages[currentLanguage].flag}
          </Text>
          {showLabel && (
            <Text style={styles.currentLanguageText}>
              {availableLanguages[currentLanguage].name}
            </Text>
          )}
        </View>
        <IoniconsIcon name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('select_language')}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <IoniconsIcon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={Object.entries(availableLanguages)}
              renderItem={renderLanguageItem}
              keyExtractor={([code]) => code}
              style={styles.languageList}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
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
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguageItem: {
    backgroundColor: '#f0f8ff',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  selectedText: {
    color: '#007AFF',
  },
});

export default LanguageSelector;
