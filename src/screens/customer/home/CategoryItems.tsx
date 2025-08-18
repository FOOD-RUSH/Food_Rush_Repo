import { View } from 'react-native';
import React from 'react';
import { CategoryFilters } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
import { useTheme } from 'react-native-paper';

const CategoryItems = () => {
  const { colors } = useTheme();

  return (
    <View
      className={`px-2 flex-1 h-full flex-wrap flex-row ${colors.background}`}
    >
      {CategoryFilters.map((category) => (
        <CategoryItem
          image={category.image}
          title={category.title}
          key={category.id}
        />
      ))}
    </View>
  );
};

export default CategoryItems;
