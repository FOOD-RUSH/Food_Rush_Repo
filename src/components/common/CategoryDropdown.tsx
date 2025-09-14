import React from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FoodCategory, FOOD_CATEGORIES, FOOD_CATEGORIES_FR } from '../../types/MenuItem';

interface CategoryDropdownProps {
  value: FoodCategory | '';
  onValueChange: (value: FoodCategory) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onValueChange,
  placeholder,
  error = false,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  
  // Use French translations if current language is French
  const categoryLabels = i18n.language === 'fr' ? FOOD_CATEGORIES_FR : FOOD_CATEGORIES;
  
  const data = Object.entries(categoryLabels).map(([key, label]) => ({
    label,
    value: key as FoodCategory,
  }));

  return (
    <Dropdown
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: error ? 2 : 0,
        borderColor: error ? colors.error : 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
      placeholderStyle={{
        fontSize: 16,
        color: colors.onSurfaceVariant,
      }}
      selectedTextStyle={{
        fontSize: 16,
        color: colors.onSurface,
      }}
      inputSearchStyle={{
        height: 40,
        fontSize: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        color: colors.onSurface,
      }}
      iconStyle={{
        width: 20,
        height: 20,
        tintColor: colors.onSurfaceVariant,
      }}
      data={data}
      search
      maxHeight={300}
      labelField=\"label\"
      valueField=\"value\"
      placeholder={placeholder || 'Select category'}
      searchPlaceholder=\"Search categories...\"
      value={value}
      onChange={(item) => {
        onValueChange(item.value);
      }}
      disable={disabled}
      containerStyle={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.outline,
      }}
      itemTextStyle={{
        color: colors.onSurface,
        fontSize: 16,
      }}
      activeColor={colors.surfaceVariant}
    />
  );
};

export default CategoryDropdown;