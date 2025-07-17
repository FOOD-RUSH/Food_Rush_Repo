import {  View } from 'react-native';
import React from 'react';
import { CategoryFilters } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';

const CategoryItems = () => {

  return (
    <View className="px-2 flex-1 flex-wrap flex-row">
      {CategoryFilters.map((category) => (
        <CategoryItem
          image={category.image}
          title={category.title}
          onPress={() => {}}
          key={category.id}
        />
      ))}
    </View>
  );
};

export default CategoryItems;

