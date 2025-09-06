import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Card, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CommonView from '@/src/components/common/CommonView';

const AddMenuItemScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads'];

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
              <Text className="text-2xl font-bold text-white">Add Menu Item</Text>
              <Text className="text-blue-100 mt-1">Create a new delicious item</Text>
            </View>
          </View>
        </View>

        {/* Image Upload Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Food Image</Text>
            <TouchableOpacity
              className="h-56 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center"
              onPress={handleImagePick}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-full w-full rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                    <MaterialCommunityIcons name="camera-plus" size={32} color="#3B82F6" />
                  </View>
                  <Text className="text-blue-600 font-semibold text-lg mb-2">Add Food Image</Text>
                  <Text className="text-gray-500 text-center">
                    Tap to upload a photo of your dish
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Form Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-6">Item Details</Text>
            
            <View className="space-y-5">
              <TextInput
                mode="outlined"
                label="Item Name"
                value={name}
                onChangeText={setName}
                outlineColor="#E5E7EB"
                activeOutlineColor="#3B82F6"
                style={{ backgroundColor: '#FFFFFF' }}
                contentStyle={{ fontSize: 16 }}
                left={<TextInput.Icon icon="silverware-fork-knife" color="#6B7280" />}
              />

              <TextInput
                mode="outlined"
                label="Price ($)"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                outlineColor="#E5E7EB"
                activeOutlineColor="#3B82F6"
                style={{ backgroundColor: '#FFFFFF' }}
                contentStyle={{ fontSize: 16 }}
                left={<TextInput.Icon icon="currency-usd" color="#6B7280" />}
              />

              <View>
                <Text className="text-base font-medium text-gray-700 mb-3">Category</Text>
                <View className="flex-row flex-wrap">
                  {categories.map((cat) => (
                    <Chip
                      key={cat}
                      mode={category === cat ? "flat" : "outlined"}
                      selected={category === cat}
                      onPress={() => setCategory(cat)}
                      style={{
                        margin: 4,
                        backgroundColor: category === cat ? '#DBEAFE' : '#FFFFFF',
                      }}
                      textStyle={{
                        color: category === cat ? '#3B82F6' : '#6B7280',
                        fontWeight: category === cat ? '600' : '400'
                      }}
                    >
                      {cat}
                    </Chip>
                  ))}
                </View>
              </View>

              <TextInput
                mode="outlined"
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                outlineColor="#E5E7EB"
                activeOutlineColor="#3B82F6"
                style={{ backgroundColor: '#FFFFFF' }}
                contentStyle={{ fontSize: 16 }}
                left={<TextInput.Icon icon="text" color="#6B7280" />}
              />
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
            Save Item
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AddMenuItemScreen;