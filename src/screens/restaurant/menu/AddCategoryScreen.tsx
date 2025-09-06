import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const AddCategoryScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('food-fork-drink');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const icons = [
    'food-fork-drink', 'food-apple', 'food-drumstick', 'cupcake',
    'cup', 'leaf', 'pizza', 'hamburger', 'ice-cream', 'coffee'
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
    '#8B5CF6', '#06B6D4', '#EF4444', '#F97316'
  ];

  return (
    <CommonView style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-6 py-8 bg-gradient-to-br from-blue-600 to-blue-800 -mx-6 -mt-4 mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
              <MaterialCommunityIcons name="plus-circle" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-2xl font-bold text-white">Add Category</Text>
              <Text className="text-blue-100 mt-1">Create a new menu category</Text>
            </View>
          </View>
        </View>

        {/* Preview Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Preview</Text>
            <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl">
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${selectedColor}15` }}
              >
                <MaterialCommunityIcons 
                  name={selectedIcon as any} 
                  size={28} 
                  color={selectedColor} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800">
                  {name || 'Category Name'}
                </Text>
                <Text className="text-gray-500 mt-1">
                  {description || 'Category description will appear here'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Form Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-6">Category Details</Text>
            
            <View className="space-y-5">
              <TextInput
                mode="outlined"
                label="Category Name"
                value={name}
                onChangeText={setName}
                outlineColor="#E5E7EB"
                activeOutlineColor="#3B82F6"
                style={{ backgroundColor: '#FFFFFF' }}
                contentStyle={{ fontSize: 16 }}
                left={<TextInput.Icon icon="tag" color="#6B7280" />}
              />

              <TextInput
                mode="outlined"
                label="Description (Optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                outlineColor="#E5E7EB"
                activeOutlineColor="#3B82F6"
                style={{ backgroundColor: '#FFFFFF' }}
                contentStyle={{ fontSize: 16 }}
                left={<TextInput.Icon icon="text" color="#6B7280" />}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Icon Selection Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Choose Icon</Text>
            <View className="flex-row flex-wrap justify-between">
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  className={`w-14 h-14 rounded-2xl items-center justify-center mb-3 ${
                    selectedIcon === icon ? 'border-2' : 'border border-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedIcon === icon ? `${selectedColor}15` : '#F9FAFB',
                    borderColor: selectedIcon === icon ? selectedColor : '#E5E7EB'
                  }}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <MaterialCommunityIcons 
                    name={icon as any} 
                    size={24} 
                    color={selectedIcon === icon ? selectedColor : '#6B7280'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Color Selection Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Choose Color</Text>
            <View className="flex-row flex-wrap justify-between">
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  className={`w-12 h-12 rounded-full mb-3 items-center justify-center ${
                    selectedColor === color ? 'border-4 border-gray-300' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View className="flex-row px-6 space-x-4 mb-8">
          <Button
            mode="outlined"
            onPress={() => {}}
            textColor="#6B7280"
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: 16, fontWeight: '500' }}
            style={{ 
              flex: 1,
              borderRadius: 12, 
              borderColor: '#D1D5DB',
              backgroundColor: '#FFFFFF'
            }}
          >
            Cancel
          </Button>

          <Button
            mode="contained"
            onPress={() => {}}
            buttonColor="#3B82F6"
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
            style={{ flex: 1, borderRadius: 12 }}
            icon="check"
          >
            Create Category
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AddCategoryScreen;