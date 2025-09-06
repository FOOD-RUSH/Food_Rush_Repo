import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Button, FAB, Card, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

interface Category {
  id: string;
  name: string;
  itemCount: number;
  color: string;
  icon: string;
}

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([
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
      name: 'Salads',
      itemCount: 6,
      color: '#06B6D4',
      icon: 'leaf'
    }
  ]);

  const renderCategory = ({ item, index }: { item: Category; index: number }) => (
    <Card 
      className="mx-6 mb-4" 
      style={{ 
        elevation: 2, 
        backgroundColor: '#FFFFFF',
        marginBottom: index === categories.length - 1 ? 100 : 16
      }}
    >
      <TouchableOpacity
        onPress={() => {/* Navigate to edit category */}}
        activeOpacity={0.7}
      >
        <Card.Content className="p-6">
          <View className="flex-row items-center">
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <MaterialCommunityIcons 
                name={item.icon as any} 
                size={28} 
                color={item.color} 
              />
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-gray-800 flex-1">
                  {item.name}
                </Text>
                <Badge 
                  size={24}
                  style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}
                >
                  {item.itemCount}
                </Badge>
              </View>
              <Text className="text-gray-500 text-base">
                {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>

            <TouchableOpacity
              className="w-12 h-12 items-center justify-center rounded-full"
              style={{ backgroundColor: '#F3F4F6' }}
              onPress={() => {/* Handle edit */}}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
        <MaterialCommunityIcons name="food-fork-drink" size={48} color="#3B82F6" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
        No Categories Yet
      </Text>
      <Text className="text-gray-500 text-center text-base leading-6 mb-8">
        Start organizing your menu by creating your first category. 
        Categories help customers find what they&apos;re looking for quickly.
      </Text>
      <Button
        mode="contained"
        onPress={() => {/* Navigate to add category */}}
        buttonColor="#3B82F6"
        contentStyle={{ paddingVertical: 12, paddingHorizontal: 24 }}
        labelStyle={{ fontSize: 16, fontWeight: '600' }}
        style={{ borderRadius: 12 }}
        icon="plus"
      >
        Create Category
      </Button>
    </View>
  );

  return (
    <CommonView style={{ backgroundColor: '#F8FAFC' }}>
      <View className="flex-1">
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

        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 24,
            right: 0,
            bottom: 0,
            backgroundColor: '#3B82F6',
            borderRadius: 16,
          }}
          size="medium"
          onPress={() => {/* Navigate to add category */}}
          customSize={60}
        />
      </View>
    </CommonView>
  );
};

export default CategoriesScreen;