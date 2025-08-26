import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface FilterOptions {
  categories: string[];
  priceRange: 'low' | 'medium' | 'high' | null;
  sortBy: 'name' | 'price' | 'rating' | 'distance';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  availableCategories: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  availableCategories,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    'low' | 'medium' | 'high' | null
  >(null);
  const [selectedSort, setSelectedSort] = useState<
    'name' | 'price' | 'rating' | 'distance'
  >('name');

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      sortBy: selectedSort,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setSelectedSort('name');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.backdrop }]}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.outline }]}>
            <Text style={[styles.title, { color: colors.onSurface }]}>
              {t('filters')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Categories */}
            {availableCategories.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: colors.onSurface }]}
                >
                  {t('categories')}
                </Text>
                <View style={styles.optionGrid}>
                  {availableCategories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor: selectedCategories.includes(category)
                            ? colors.primary
                            : colors.surfaceVariant,
                          borderColor: colors.outline,
                        },
                      ]}
                      onPress={() => handleCategoryToggle(category)}
                    >
                      <Text
                        style={{
                          color: selectedCategories.includes(category)
                            ? 'white'
                            : colors.onSurface,
                          fontSize: 14,
                        }}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                {t('price_range')}
              </Text>
              <View style={styles.optionGrid}>
                {[
                  { label: t('budget_price_range'), value: 'low' as const },
                  { label: t('medium_price_range'), value: 'medium' as const },
                  { label: t('premium_price_range'), value: 'high' as const },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          selectedPriceRange === option.value
                            ? colors.primary
                            : colors.surfaceVariant,
                        borderColor: colors.outline,
                      },
                    ]}
                    onPress={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === option.value
                          ? null
                          : option.value,
                      )
                    }
                  >
                    <Text
                      style={{
                        color:
                          selectedPriceRange === option.value
                            ? 'white'
                            : colors.onSurface,
                        fontSize: 14,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                {t('sort_by')}
              </Text>
              <View style={styles.optionGrid}>
                {[
                  { label: t('name'), value: 'name' as const },
                  { label: t('price'), value: 'price' as const },
                  { label: t('rating'), value: 'rating' as const },
                  { label: t('distance'), value: 'distance' as const },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          selectedSort === option.value
                            ? colors.primary
                            : colors.surfaceVariant,
                        borderColor: colors.outline,
                      },
                    ]}
                    onPress={() => setSelectedSort(option.value)}
                  >
                    <Text
                      style={{
                        color:
                          selectedSort === option.value
                            ? 'white'
                            : colors.onSurface,
                        fontSize: 14,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.outline }]}>
            <Button
              mode="outlined"
              onPress={handleClear}
              style={styles.clearButton}
            >
              {t('clear')}
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
            >
              {t('apply')}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default FilterModal;
