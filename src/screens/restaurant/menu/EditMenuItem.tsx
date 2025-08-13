import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CommonView from '@/src/components/common/CommonView';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  isAvailable: boolean;
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

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Edit Menu Item</Text>
          <Text className="text-gray-500 mt-2">Update item details</Text>
        </View>

        <TouchableOpacity
          className="h-48 bg-gray-100 rounded-xl mb-6 overflow-hidden"
          onPress={handleImagePick}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center justify-center h-full">
              <MaterialCommunityIcons name="camera-plus" size={40} color="#007AFF" />
              <Text className="text-blue-500 mt-2">Change Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="space-y-4">
          <TextInput
            mode="outlined"
            label="Item Name"
            value={name}
            onChangeText={setName}
            className="bg-white"
          />

          <TextInput
            mode="outlined"
            label="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
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

          <View className="flex-row items-center justify-between bg-white p-4 rounded-xl">
            <Text className="text-gray-800 font-medium">Available</Text>
            <Switch value={isAvailable} onValueChange={setIsAvailable} />
          </View>

          <View className="flex-row space-x-4 mt-4">
            <Button
              mode="outlined"
              onPress={() => {}}
              contentStyle={{ paddingVertical: 6 }}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              mode="contained"
              onPress={() => {}}
              contentStyle={{ paddingVertical: 6 }}
              className="flex-1"
            >
              Save Changes
            </Button>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default EditMenuItemScreen;
