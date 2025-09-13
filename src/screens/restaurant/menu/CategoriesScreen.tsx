import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Button, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-xl mb-3 flex-row items-center"
      onPress={() => {
        /* Navigate to edit category */
      }}
    >
      <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
        <MaterialCommunityIcons
          name="food-fork-drink"
          size={24}
          color="#007AFF"
        />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-500">{item.itemCount} items</Text>
      </View>

      <TouchableOpacity
        className="w-10 h-10 items-center justify-center"
        onPress={() => {
          /* Handle edit */
        }}
      >
        <MaterialCommunityIcons name="pencil" size={24} color="#666666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <CommonView>
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Categories</Text>
          <Text className="text-gray-500 mt-2">Manage menu categories</Text>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: '#007AFF',
          }}
          onPress={() => {
            /* Navigate to add category */
          }}
        />
      </View>
    </CommonView>
  );
};

export default CategoriesScreen;
