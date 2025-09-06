import { View, Text, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

export const AddFoodScreen = () => {
  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header Section */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800">Add New Item</Text>
            <Text className="text-gray-500 mt-2">
              Fill in the details to add a new menu item
            </Text>
          </View>

          {/* Image Upload Section */}
          <TouchableOpacity 
            className="h-48 bg-gray-100 rounded-2xl mb-6 items-center justify-center"
            onPress={() => {/* Handle image upload */}}
          >
            <Ionicons name="camera-outline" size={40} color="#007AFF" />
            <Text className="text-blue-500 mt-2">Add Food Image</Text>
          </TouchableOpacity>

          {/* Form Fields */}
          <View className="space-y-4">
            <TextInput
              mode="outlined"
              label="Food Name"
              value={foodName}
              onChangeText={setFoodName}
              className="bg-white"
            />

            <TextInput
              mode="outlined"
              label="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              className="bg-white"
            />

            <TextInput
              mode="outlined"
              label="Category"
              value={category}
              onChangeText={setCategory}
              className="bg-white"
            />

            <TextInput
              mode="outlined"
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              className="bg-white"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4 mt-8 mb-6">
            <TouchableOpacity 
              className="flex-1 bg-gray-100 py-4 rounded-full"
              onPress={() => {/* Handle cancel */}}
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-blue-500 py-4 rounded-full"
              onPress={() => {/* Handle save */}}
            >
              <Text className="text-center text-white font-semibold">Save Item</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  )
}