import {  View } from 'react-native';
import React from 'react';
import { CategoryFilters } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
import { useTheme } from '@/src/hooks/useTheme';

const CategoryItems = () => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-background';

  return (
    <View className={`px-2 flex-1 h-full flex-wrap flex-row ${backgroundColor}`}>
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

