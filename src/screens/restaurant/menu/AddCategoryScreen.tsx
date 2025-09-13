import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const AddCategoryScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <CommonView>
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Add Category</Text>
          <Text className="text-gray-500 mt-2">Create a new menu category</Text>
        </View>

        <View className="space-y-4">
          <TextInput
            mode="outlined"
            label="Category Name"
            value={name}
            onChangeText={setName}
            className="bg-white"
            left={<TextInput.Icon icon="tag" />}
          />

          <TextInput
            mode="outlined"
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            className="bg-white"
            left={<TextInput.Icon icon="text" />}
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
              Create Category
            </Button>
          </View>
        </View>
      </View>
    </CommonView>
  );
};

export default AddCategoryScreen;
