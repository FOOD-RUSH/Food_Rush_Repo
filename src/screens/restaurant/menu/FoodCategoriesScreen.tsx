import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

const FoodCategoriesScreen = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [newCategory, setNewCategory] = React.useState('');
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderCategory = (category: Category, index: number) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
        key={category.id}
      >
        <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm">
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={24}
              color="#007AFF"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-lg font-semibold text-gray-800">
              {category.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {category.itemCount} items
            </Text>
          </View>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => {
              /* Handle edit */
            }}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor="#EF4444"
            onPress={() => {
              /* Handle delete */
            }}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <CommonView>
      <Animated.View
        className="flex-1"
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">Categories</Text>
          <Text className="text-gray-500 mt-2">Organize your menu items</Text>
        </View>

        {/* Add Category Form */}
        <View className="flex-row items-center mb-6">
          <TextInput
            mode="outlined"
            label="New Category"
            value={newCategory}
            onChangeText={setNewCategory}
            className="flex-1 bg-white"
            outlineStyle={{ borderRadius: 12 }}
          />
          <Button
            mode="contained"
            onPress={() => {
              /* Handle add category */
            }}
            className="ml-2"
            style={{ borderRadius: 12 }}
          >
            Add
          </Button>
        </View>

        {/* Categories List */}
        <View>
          {categories.map((category, index) => renderCategory(category, index))}
        </View>
      </Animated.View>
    </CommonView>
  );
};

export default FoodCategoriesScreen;
