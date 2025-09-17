import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryItem from '@/src/components/customer/CategoryItem';
import { useTheme } from 'react-native-paper';
import { useCategoryOptions } from '@/src/hooks/customer/useCategoriesApi';
import { images } from '@/assets/images';

const CategoryItems = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data: categories, isLoading, error } = useCategoryOptions();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {t('loading_categories')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text style={{ color: colors.error, textAlign: 'center' }}>
          {t('failed_to_load_categories')}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`px-2 flex-1 h-full flex-wrap flex-row`}
      style={{ backgroundColor: colors.background }}
    >
      {categories.map((category) => (
        <CategoryItem
          image={images.onboarding1} // Use default image for now
          title={category.label}
          key={category.value}
        />
      ))}
    </View>
  );
};

export default CategoryItems;
