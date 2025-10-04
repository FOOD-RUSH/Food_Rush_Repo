import { MaterialIcon } from '@/src/components/common/icons';
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

import { useTranslation } from 'react-i18next';
import { getAllCategories } from '@/src/constants/categories';

export interface GeneralFilterOptions {
  priceRange: 'budget' | 'medium' | 'premium' | null;
  deliveryTime: 'under30' | '30-60' | '60+' | 'any';
  deliveryFee: 'free' | 'under1000' | 'under2000' | 'any';
  distanceRange: '0-5' | '5-10' | '10+' | 'any';
  category: string | null;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: GeneralFilterOptions) => void;
  currentFilters: GeneralFilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const [selectedFilters, setSelectedFilters] =
    useState<GeneralFilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  const handleClear = () => {
    setSelectedFilters({
      priceRange: null,
      deliveryTime: 'any',
      deliveryFee: 'any',
      distanceRange: 'any',
      category: null,
    });
  };

  const updateFilter = <K extends keyof GeneralFilterOptions>(
    key: K,
    value: GeneralFilterOptions[K],
  ) => {
    const defaults: GeneralFilterOptions = {
      priceRange: null,
      deliveryTime: 'any',
      deliveryFee: 'any',
      distanceRange: 'any',
      category: null,
    };

    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? defaults[key] : value,
    }));
  };

  const categories = getAllCategories();

  const filterSections = [
    {
      key: 'category' as const,
      title: t('food_category'),
      icon: 'restaurant-menu',
      options: categories.map((cat) => ({
        value: cat.title, // Use the title as the value (e.g., 'local-dishes')
        label: cat.displayName, // Use displayName for UI (e.g., 'Local Dishes')
        description: cat.description || '',
        icon: 'restaurant',
      })),
    },
    {
      key: 'priceRange' as const,
      title: t('price_range'),
      icon: 'attach-money',
      options: [
        {
          value: 'budget',
          label: t('budget_friendly'),
          description: t('under_2000_fcfa'),
          icon: 'money-off',
        },
        {
          value: 'medium',
          label: t('moderate_pricing'),
          description: t('2000_5000_fcfa'),
          icon: 'payments',
        },
        {
          value: 'premium',
          label: t('premium_dining'),
          description: t('above_5000_fcfa'),
          icon: 'diamond',
        },
      ],
    },
    {
      key: 'distanceRange' as const,
      title: t('distance'),
      icon: 'location-on',
      options: [
        {
          value: '0-5',
          label: t('within_5km'),
          description: t('very_close_by'),
          icon: 'place',
        },
        {
          value: '5-10',
          label: t('5_to_10km'),
          description: t('nearby_area'),
          icon: 'place',
        },
        {
          value: '10+',
          label: t('over_10km'),
          description: t('wider_search'),
          icon: 'place',
        },
      ],
    },
    {
      key: 'deliveryTime' as const,
      title: t('delivery_time'),
      icon: 'schedule',
      options: [
        {
          value: 'under30',
          label: t('express_delivery'),
          description: t('under_30_minutes'),
          icon: 'flash-on',
        },
        {
          value: '30-60',
          label: t('standard_delivery'),
          description: t('30_60_minutes'),
          icon: 'schedule',
        },
        {
          value: '60+',
          label: t('flexible_timing'),
          description: t('over_60_minutes'),
          icon: 'access-time',
        },
      ],
    },
    {
      key: 'deliveryFee' as const,
      title: t('delivery_fee'),
      icon: 'local-shipping',
      options: [
        {
          value: 'free',
          label: t('free_delivery'),
          description: t('no_delivery_charges'),
          icon: 'local-shipping',
        },
        {
          value: 'under1000',
          label: t('under_1000_fcfa'),
          description: t('low_fee'),
          icon: 'money',
        },
        {
          value: 'under2000',
          label: t('under_2000_fcfa'),
          description: t('moderate_fee'),
          icon: 'attach-money',
        },
      ],
    },
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.category) count++;
    if (selectedFilters.priceRange) count++;
    if (selectedFilters.deliveryTime !== 'any') count++;
    if (selectedFilters.deliveryFee !== 'any') count++;
    if (selectedFilters.distanceRange !== 'any') count++;
    return count;
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
            <View>
              <Text style={[styles.title, { color: colors.onSurface }]}>
                {t('filters')}
              </Text>
              {getActiveFiltersCount() > 0 && (
                <Text
                  style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
                >
                  {getActiveFiltersCount()} {t('active')}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcon name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {filterSections.map((section) => (
              <View key={section.key} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcon
                    name={section.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.sectionTitle, { color: colors.onSurface }]}
                  >
                    {section.title}
                  </Text>
                </View>

                <View style={styles.optionsContainer}>
                  {section.options.map((option) => {
                    const isSelected =
                      selectedFilters[section.key] === option.value;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.optionButton,
                          {
                            backgroundColor: isSelected
                              ? colors.primaryContainer
                              : colors.surfaceVariant,
                            borderColor: isSelected
                              ? colors.primary
                              : colors.outline,
                          },
                        ]}
                        onPress={() =>
                          updateFilter(section.key, option.value as any)
                        }
                      >
                        <View style={styles.optionContent}>
                          <MaterialIcon
                            name={option.icon as any}
                            size={18}
                            color={
                              isSelected
                                ? colors.onPrimaryContainer
                                : colors.onSurfaceVariant
                            }
                          />
                          <View style={styles.optionText}>
                            <Text
                              style={[
                                styles.optionLabel,
                                {
                                  color: isSelected
                                    ? colors.onPrimaryContainer
                                    : colors.onSurfaceVariant,
                                },
                              ]}
                            >
                              {option.label}
                            </Text>
                            <Text
                              style={[
                                styles.optionDescription,
                                {
                                  color: isSelected
                                    ? colors.onPrimaryContainer
                                    : colors.onSurfaceVariant,
                                },
                              ]}
                            >
                              {option.description}
                            </Text>
                          </View>
                        </View>
                        {isSelected && (
                          <MaterialIcon
                            name="check-circle"
                            size={20}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
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
              {t('apply')}{' '}
              {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
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
    maxHeight: '90%',
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
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
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
