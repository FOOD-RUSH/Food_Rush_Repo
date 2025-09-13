import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CommonView from '@/src/components/common/CommonView';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { useCreateMenuItem, useUploadImage } from '@/src/hooks/restaurant/useMenuApi';
import { useNavigation } from '@react-navigation/native';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';

export const AddFoodScreen = () => {
  const navigation = useNavigation<RestaurantMenuStackScreenProps<'AddMenuItem'>['navigation']>();
  const user = useAuthUser();
  const restaurantId = user?.restaurantId;

  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // API hooks
  const createMenuItemMutation = useCreateMenuItem();
  const uploadImageMutation = useUploadImage();

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

  const handleImagePick = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      setIsUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        // Upload image to server
        const formData = new FormData();
        formData.append('image', {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `menu-item-${Date.now()}.jpg`,
        } as any);

        try {
          const uploadResponse = await uploadImageMutation.mutateAsync(formData);
          // Assuming the response contains the image URL
          const responseData = uploadResponse.data as any;
          const imageUrl = responseData?.url || responseData?.imageUrl || responseData?.image;
          setImageUri(imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
          // Fallback to local storage
          const imageId = generateImageId();
          const localUri = await saveImageLocally(asset.uri, imageId);
          setImageUri(localUri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsUploading(false);
    }
  };

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
            className="h-48 bg-gray-100 rounded-2xl mb-6 items-center justify-center relative overflow-hidden"
            onPress={handleImagePick}
            disabled={isUploading}
          >
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full rounded-2xl"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                  <Ionicons name="camera" size={32} color="#FFFFFF" />
                  <Text className="text-white mt-2 font-semibold">Change Image</Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="camera-outline" size={40} color="#007AFF" />
                <Text className="text-blue-500 mt-2 font-semibold">
                  {isUploading ? 'Uploading...' : 'Add Food Image'}
                </Text>
              </>
            )}
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
              onPress={() => navigation.goBack()}
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-4 rounded-full"
              onPress={async () => {
                if (!restaurantId) {
                  Alert.alert('Error', 'Restaurant ID not found. Please log in again.');
                  return;
                }

                if (!foodName.trim() || !price.trim()) {
                  Alert.alert('Error', 'Please fill in all required fields');
                  return;
                }

                try {
                  const menuItemData = {
                    name: foodName.trim(),
                    description: description.trim(),
                    price: parseFloat(price),
                    categoryId: category.trim() || 'default', // You might want to get actual category ID
                    imageUrl: imageUri || undefined,
                    isAvailable: true,
                  };

                  await createMenuItemMutation.mutateAsync({
                    restaurantId,
                    data: menuItemData,
                  });

                  Alert.alert('Success', 'Menu item created successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                  ]);
                } catch (error) {
                  console.error('Error creating menu item:', error);
                  Alert.alert('Error', 'Failed to create menu item. Please try again.');
                }
              }}
              disabled={createMenuItemMutation.isPending}
            >
              <Text className="text-center text-white font-semibold">
                {createMenuItemMutation.isPending ? 'Saving...' : 'Save Item'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  )
}