import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useCategoriesApi } from '@/src/hooks/shared/useCategoriesApi';

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

  const { data: categories, isLoading, error: apiError } = useCategoriesApi();

  // Ensure categories is always an array to prevent "find is not a function" error
  const categoriesArray = React.useMemo(() => {
    if (Array.isArray(categories)) {
      return categories;
    }
    // Log warning if categories is not an array for debugging
    if (categories !== undefined && categories !== null) {
      console.warn('Categories data is not an array:', categories);
    }
    return [];
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
    item: { value: string; label: string };
  }) => (
    <TouchableOpacity
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.outline + '20',
        backgroundColor:
          selectedValue === item.value ? colors.primary + '10' : 'transparent',
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
        <Text
          style={{
            fontSize: 16,
            color:
              selectedValue === item.value ? colors.primary : colors.onSurface,
            fontWeight: selectedValue === item.value ? '600' : 'normal',
          }}
        >
          {item.label}
        </Text>
        {selectedValue === item.value && (
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={colors.primary}
          />
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
        <MaterialCommunityIcons
          name="alert-circle"
          size={20}
          color={colors.error}
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: colors.onErrorContainer, fontSize: 14, flex: 1 }}>
          {t('failed_to_load_categories')}
        </Text>
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
        <Text
          style={{
            fontSize: 16,
            color: selectedCategory
              ? colors.onSurface
              : colors.onSurfaceVariant,
          }}
        >
          {selectedCategory?.label || placeholder || t('select_category')}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <MaterialCommunityIcons
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
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.onSurface,
                }}
              >
                {t('select_category')}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
                  {t('loading_categories')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={categoriesArray}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{ padding: 32, alignItems: 'center' }}>
                    <MaterialCommunityIcons
                      name="food-off"
                      size={48}
                      color={colors.onSurfaceVariant}
                    />
                    <Text
                      style={{ marginTop: 8, color: colors.onSurfaceVariant }}
                    >
                      {t('no_categories_available')}
                    </Text>
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
