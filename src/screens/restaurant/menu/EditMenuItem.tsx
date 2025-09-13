import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Switch, Card, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CommonView from '@/src/components/common/CommonView';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  rating?: number;
}

const EditMenuItemScreen = ({
  route,
}: {
  route: { params: { item: MenuItem } };
}) => {
  const { item } = route.params;

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [image, setImage] = useState(item.image);
  const [isAvailable, setIsAvailable] = useState(item.isAvailable);

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Pizza', 'Burgers'];

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageId = generateImageId();
        const localUri = await saveImageLocally(result.assets[0].uri, imageId);
        setImage(localUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      // You could show an alert here
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving item:', {
      id: item.id,
      name,
      price: parseFloat(price),
      description,
      category,
      image,
      isAvailable
    });
  };

  const handleCancel = () => {
    // Handle cancel logic here
    console.log('Cancelled editing');
  };

  return (
    <CommonView style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-6 py-8 bg-gradient-to-br from-blue-600 to-blue-800 -mx-6 -mt-4 mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
              <MaterialCommunityIcons name="pencil" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-2xl font-bold text-white">Edit Menu Item</Text>
              <Text className="text-blue-100 mt-1">Update item details</Text>
            </View>
          </View>
        </View>

        {/* Image Upload Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Food Image</Text>
            <TouchableOpacity
              className="h-56 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative"
              onPress={handleImagePick}
            >
              {image ? (
                <>
                  <Image
                    source={{ uri: image }}
                    className="h-full w-full rounded-2xl"
                    resizeMode="cover"
                  />
                  <View className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
                  </View>
                </>
              ) : (
                <View className="items-center justify-center h-full">
                  <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                    <MaterialCommunityIcons name="camera-plus" size={32} color="#3B82F6" />
                  </View>
                  <Text className="text-blue-600 font-semibold text-lg mb-2">Change Image</Text>
                  <Text className="text-gray-500 text-center">
                    Tap to upload a new photo of your dish
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

        {/* Availability Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Availability Settings</Text>
            
            <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                  <MaterialCommunityIcons 
                    name={isAvailable ? "check-circle" : "close-circle"} 
                    size={24} 
                    color={isAvailable ? "#10B981" : "#EF4444"} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    {isAvailable ? 'Available' : 'Sold Out'}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {isAvailable ? 'Item is available for orders' : 'Item is currently unavailable'}
                  </Text>
                </View>
              </View>
              <Switch 
                value={isAvailable} 
                onValueChange={setIsAvailable}
                thumbColor={isAvailable ? '#3B82F6' : '#E5E7EB'}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Item Statistics Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Item Statistics</Text>
            
            <View className="flex-row justify-around">
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <MaterialCommunityIcons name="star" size={20} color="#3B82F6" />
                </View>
                <Text className="text-xl font-bold text-blue-600">
                  {item.rating || 4.5}
                </Text>
                <Text className="text-sm text-gray-600">Rating</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <MaterialCommunityIcons name="shopping" size={20} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-green-600">24</Text>
                <Text className="text-sm text-gray-600">Orders</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                  <MaterialCommunityIcons name="eye" size={20} color="#F59E0B" />
                </View>
                <Text className="text-xl font-bold text-orange-600">156</Text>
                <Text className="text-sm text-gray-600">Views</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Danger Zone Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FEF2F2' }}>
          <Card.Content className="p-6">
            <Text className="text-lg font-semibold text-red-800 mb-4">Danger Zone</Text>
            
            <View className="bg-red-50 p-4 rounded-2xl border border-red-200">
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-red-800 font-medium ml-2">Delete Menu Item</Text>
              </View>
              <Text className="text-red-600 text-sm mb-4">
                This action cannot be undone. This will permanently delete the menu item and remove all associated data.
              </Text>
              <Button
                mode="outlined"
                onPress={() => {
                  console.log('Delete item');
                }}
                textColor="#EF4444"
                style={{ 
                  borderColor: '#EF4444',
                  borderRadius: 8
                }}
                contentStyle={{ paddingVertical: 8 }}
                labelStyle={{ fontSize: 14, fontWeight: '500' }}
              >
                Delete Item
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View className="flex-row px-6 space-x-4 mb-8">
          <Button
            mode="outlined"
            onPress={handleCancel}
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
            onPress={handleSave}
            buttonColor="#3B82F6"
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
            style={{ flex: 1, borderRadius: 12 }}
            icon="check"
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default EditMenuItemScreen;