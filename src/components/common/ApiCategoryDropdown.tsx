import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { useCategories } from '@/src/hooks/useCategories';
import {
  Typography,
  Heading5,
  Body,
  Label,
  LabelLarge,
} from '@/src/components/common/Typography';

interface ApiCategoryDropdownProps {
  selectedValue?: string;
  onValueChange: (value: string, label: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  style?: any;
}

const ApiCategoryDropdown: React.FC<ApiCategoryDropdownProps> = ({
  selectedValue,
  onValueChange,
  placeholder,
  error = false,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const { categories, isLoading, error: apiError } = useCategories();

  // Categories is always an array from the local data
  const categoriesArray = React.useMemo(() => {
    return categories.map((cat) => ({
      value: cat.value,
      label: cat.label,
      emoji: cat.emoji,
      color: cat.color,
    }));
  }, [categories]);

  const selectedCategory = React.useMemo(() => {
    if (!selectedValue || categoriesArray.length === 0) {
      return null;
    }
    return categoriesArray.find((cat) => cat.value === selectedValue) || null;
  }, [categoriesArray, selectedValue]);

  const handleSelect = (category: { value: string; label: string }) => {
    onValueChange(category.value, category.label);
    setIsVisible(false);
  };

  const renderCategoryItem = ({
    item,
  }: {
    item: { value: string; label: string; emoji: string; color: string };
  }) => (
    <TouchableOpacity
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.outline + '20',
        backgroundColor:
          selectedValue === item.value ? item.color + '15' : 'transparent',
      }}
      onPress={() => handleSelect(item)}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Typography variant="h5" style={{ marginRight: 12 }}>
            {item.emoji}
          </Typography>
          <Label
            color={selectedValue === item.value ? item.color : colors.onSurface}
            weight={selectedValue === item.value ? 'semibold' : 'regular'}
          >
            {item.label}
          </Label>
        </View>
        {selectedValue === item.value && (
          <MaterialCommunityIcon name="check" size={20} color={item.color} />
        )}
      </View>
    </TouchableOpacity>
  );

  // Show error state if API call failed
  if (apiError) {
    return (
      <View
        style={[
          {
            borderWidth: 1,
            borderColor: colors.error,
            borderRadius: 12,
            padding: 16,
            backgroundColor: colors.errorContainer,
            flexDirection: 'row',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <MaterialCommunityIcon
          name="alert-circle"
          size={20}
          color={colors.error}
          style={{ marginRight: 8 }}
        />
        <Body color={colors.onErrorContainer} style={{ flex: 1 }}>
          {t('failed_to_load_categories')}
        </Body>
      </View>
    );
  }

  return (
    <View style={style}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: error ? colors.error : colors.outline,
          borderRadius: 12,
          padding: 16,
          backgroundColor: disabled ? colors.surfaceVariant : colors.surface,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 56, // Ensure consistent height
        }}
        onPress={() => !disabled && !isLoading && setIsVisible(true)}
        disabled={disabled || isLoading}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {selectedCategory?.emoji && (
            <LabelLarge style={{ marginRight: 8 }}>
              {selectedCategory.emoji}
            </LabelLarge>
          )}
          <Label
            color={
              selectedCategory ? colors.onSurface : colors.onSurfaceVariant
            }
          >
            {selectedCategory?.label || placeholder || t('select_category')}
          </Label>
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <MaterialCommunityIcon
            name="chevron-down"
            size={20}
            color={colors.onSurfaceVariant}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              maxHeight: '70%',
              width: '85%',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.outline + '20',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Heading5 color={colors.onSurface} weight="semibold">
                {t('select_category')}
              </Heading5>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <MaterialCommunityIcon
                  name="close"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Body color={colors.onSurfaceVariant} style={{ marginTop: 8 }}>
                  {t('loading_categories')}
                </Body>
              </View>
            ) : (
              <FlatList
                data={categoriesArray}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{ padding: 32, alignItems: 'center' }}>
                    <MaterialCommunityIcon
                      name="food-off"
                      size={48}
                      color={colors.onSurfaceVariant}
                    />
                    <Body
                      color={colors.onSurfaceVariant}
                      style={{ marginTop: 8 }}
                    >
                      {t('no_categories_available')}
                    </Body>
                  </View>
                }
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ApiCategoryDropdown;
