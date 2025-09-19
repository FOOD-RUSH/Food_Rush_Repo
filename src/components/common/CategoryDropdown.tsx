import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useCategoriesApi } from '@/src/hooks/shared/useCategoriesApi';

interface CategoryDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
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
  const { t } = useTranslation();
  const { data: categories, isLoading, error: apiError } = useCategoriesApi();

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
        }}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={{ color: colors.onSurfaceVariant, marginLeft: 8 }}>
          {t('loading_categories')}
        </Text>
      </View>
    );
  }

  if (apiError) {
    return (
      <View
        style={{
          backgroundColor: colors.errorContainer,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 48,
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.onErrorContainer, textAlign: 'center' }}>
          {t('failed_to_load_categories')}
        </Text>
      </View>
    );
  }

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
      data={categories}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder || t('select_category')}
      searchPlaceholder={t('search_categories')}
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
