import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
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

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Add Menu Item
          </Text>
          <Text className="text-gray-500 mt-2">
            Create a new delicious item
          </Text>
        </View>

        <TouchableOpacity
          className="h-48 bg-gray-100 rounded-xl mb-6 items-center justify-center"
          onPress={handleImagePick}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-full w-full rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="camera-plus"
                size={40}
                color="#007AFF"
              />
              <Text className="text-blue-500 mt-2">Add Food Image</Text>
            </>
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
              Save Item
            </Button>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AddMenuItemScreen;
