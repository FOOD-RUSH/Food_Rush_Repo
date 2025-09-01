import { View } from 'react-native';
import React from 'react';
import { CategoryFilters } from '@/src/constants/categories';
import { useTranslation } from 'react-i18next';
import CategoryItem from '@/src/components/customer/CategoryItem';
import { useTheme } from 'react-native-paper';

const CategoryItems = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className={`px-2 flex-1 h-full flex-wrap flex-row ${colors.background}`}
    >
      {CategoryFilters.map((category) => (
        <CategoryItem
          image={category.image}
          title={t(category.title)}
          key={category.id}
        />
      ))}
    </View>
  );
};

export default CategoryItems;
