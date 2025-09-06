import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Button, TextInput, Card, IconButton, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

interface Category {
  id: string;
  name: string;
  itemCount: number;
  color: string;
  icon: string;
}

const FoodCategoriesScreen = () => {
  const [categories, setCategories] = React.useState<Category[]>([
    {
      id: '1',
      name: 'Appetizers',
      itemCount: 12,
      color: '#10B981',
      icon: 'food-apple'
    },
    {
      id: '2',
      name: 'Main Course',
      itemCount: 24,
      color: '#F59E0B',
      icon: 'food-drumstick'
    },
    {
      id: '3',
      name: 'Desserts',
      itemCount: 8,
      color: '#EC4899',
      icon: 'cupcake'
    },
    {
      id: '4',
      name: 'Beverages',
      itemCount: 15,
      color: '#8B5CF6',
      icon: 'cup'
    },
    {
      id: '5',
      name: 'Pizza',
      itemCount: 6,
      color: '#EF4444',
      icon: 'pizza'
    }
  ]);
  const [newCategory, setNewCategory] = React.useState('');
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444'];
      const icons = ['food-fork-drink', 'food-apple', 'pizza', 'hamburger', 'cup', 'ice-cream'];
      
      const newCat: Category = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        itemCount: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)]
      };
      
      setCategories([...categories, newCat]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const CategoryItem = React.memo(({ category, index }: { category: Category; index: number }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    CategoryItem.displayName = 'CategoryItem';

    React.useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, [index, scaleAnim]);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          marginBottom: 16,
        }}
        key={category.id}
      >
        <Card style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <View className="flex-row items-center">
              {/* Icon Container */}
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={28} 
                  color={category.color} 
                />
              </View>
              
              {/* Category Info */}
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Text className="text-xl font-bold text-gray-800 flex-1">
                    {category.name}
                  </Text>
                  <Badge 
                    size={24}
                    style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}
                  >
                    {category.itemCount}
                  </Badge>
                </View>
                <Text className="text-gray-500 text-base">
                  {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row ml-4">
                <TouchableOpacity
                  className="w-12 h-12 items-center justify-center rounded-full mr-2"
                  style={{ backgroundColor: '#F3F4F6' }}
                  onPress={() => {/* Handle edit */}}
                >
                  <MaterialCommunityIcons name="pencil" size={18} color="#6B7280" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="w-12 h-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#FEF2F2' }}
                  onPress={() => handleDeleteCategory(category.id)}
                >
                  <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    );

  });

  const EmptyState = () => (
    <Animated.View 
      className="items-center justify-center py-20"
      style={{ opacity: fadeAnim }}
    >
      <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
        <MaterialCommunityIcons name="format-list-bulleted" size={48} color="#3B82F6" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
        No Categories Yet
      </Text>
      <Text className="text-gray-500 text-center text-base leading-6 px-8">
        Start organizing your menu by creating your first category to help customers navigate your offerings.
      </Text>
    </Animated.View>
  );

  return (
    <CommonView style={{ backgroundColor: '#F8FAFC' }}>
      <Animated.View 
        className="flex-1"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header Section */}
        <View className="px-6 py-8 bg-gradient-to-br from-blue-600 to-blue-800 -mx-6 -mt-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-white">Categories</Text>
                <Text className="text-blue-100 mt-1">
                  {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Add Category Form */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Add New Category</Text>
            <View className="flex-row items-end space-x-3">
              <View className="flex-1">
                <TextInput
                  mode="outlined"
                  label="Category Name"
                  value={newCategory}
                  onChangeText={setNewCategory}
                  outlineColor="#E5E7EB"
                  activeOutlineColor="#3B82F6"
                  style={{ backgroundColor: '#FFFFFF' }}
                  contentStyle={{ fontSize: 16 }}
                  left={<TextInput.Icon icon="tag" color="#6B7280" />}
                />
              </View>
              <Button
                mode="contained"
                onPress={handleAddCategory}
                buttonColor="#3B82F6"
                contentStyle={{ paddingVertical: 12, paddingHorizontal: 20 }}
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
                style={{ borderRadius: 12 }}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Categories List */}
        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <View className="px-6">
            {categories.map((category, index) => (
              <CategoryItem key={category.id} category={category} index={index} />
            ))}
          </View>
        )}

        {/* Statistics Card */}
        {categories.length > 0 && (
          <Card className="mx-6 mt-6 mb-8" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
            <Card.Content className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {categories.length}
                  </Text>
                  <Text className="text-sm text-gray-600">Categories</Text>
                </View>
                
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {categories.reduce((total, cat) => total + cat.itemCount, 0)}
                  </Text>
                  <Text className="text-sm text-gray-600">Total Items</Text>
                </View>
                
                <View className="items-center">
                  <Text className="text-2xl font-bold text-orange-600">
                    {categories.length > 0 
                      ? Math.round(categories.reduce((total, cat) => total + cat.itemCount, 0) / categories.length)
                      : 0
                    }
                  </Text>
                  <Text className="text-sm text-gray-600">Avg per Category</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </Animated.View>
    </CommonView>
  );
};

export default FoodCategoriesScreen;