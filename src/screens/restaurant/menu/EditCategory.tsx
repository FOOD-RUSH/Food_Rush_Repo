import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button, Dialog, Portal } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';

interface Category {
  id: string;
  name: string;
  description?: string;
}

const EditCategoryScreen = ({
  route,
}: {
  route: { params: { category: Category } };
}) => {
  const { category } = route.params;
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || '');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  return (
    <CommonView>
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Edit Category</Text>
          <Text className="text-gray-500 mt-2">Update category details</Text>
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
            label="Description"
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
              Save Changes
            </Button>
          </View>

          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor="red"
            className="mt-4"
          >
            Delete Category
          </Button>
        </View>

        <Portal>
          <Dialog
            visible={deleteDialogVisible}
            onDismiss={() => setDeleteDialogVisible(false)}
          >
            <Dialog.Title>Delete Category</Dialog.Title>
            <Dialog.Content>
              <Text>
                Are you sure you want to delete this category? This action cannot
                be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
              <Button textColor="red" onPress={() => {/* Handle delete */}}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </CommonView>
  );
};

export default EditCategoryScreen;
