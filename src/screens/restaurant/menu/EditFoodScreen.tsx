import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import CommonView from '@/src/components/common/CommonView';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCurrentRestaurant } from '@/src/stores/AuthStore';
import {
  useMenuItem,
  useUpdateMenuItem,
} from '@/src/hooks/restaurant/useMenuApi';
import {
  Heading3,
  Body,
  Label,
} from '@/src/components/common/Typography';
import { useResponsive } from '@/src/hooks/useResponsive';
import { FoodCategory, FOOD_CATEGORIES } from '@/src/types/MenuItem';

export const EditFoodScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'RestaurantEditFoodItem'>) => {
  const { colors } = useTheme();
  const currentRestaurant = useCurrentRestaurant();
  const restaurantId = currentRestaurant?.id;
  const { scale, wp, hp } = useResponsive();

  const { menuId } = route.params;

  // API hooks
  const { data: menuItem, isLoading, error } = useMenuItem(menuId);
  const updateMenuItemMutation = useUpdateMenuItem();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('local-dishes');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Update form state when menuItem data is loaded
  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setPrice(menuItem.price?.toString() || '');
      setDescription(menuItem.description || '');
      setCategory((menuItem.category as FoodCategory) || 'local-dishes');
      setImage(menuItem.pictureUrl || menuItem.image || '');
      setIsAvailable(menuItem.isAvailable ?? true);
    }
  }, [menuItem]);

  // Set navigation title when menuItem is loaded
  useEffect(() => {
    if (menuItem?.name) {
      navigation.setOptions({
        headerTitle: `Edit ${menuItem.name}`,
      });
    }
  }, [menuItem?.name, navigation]);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images || 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const imageId = generateImageId();
        const localUri = await saveImageLocally(asset.uri, imageId);
        setImage(localUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'Restaurant ID not found. Please log in again.');
      return;
    }

    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      const updateData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        imageUrl: image || undefined,
        isAvailable,
      };

      await updateMenuItemMutation.mutateAsync({
        restaurantId,
        itemId: menuId,
        data: updateData,
      });

      Alert.alert('Success', 'Menu item updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating menu item:', error);
      Alert.alert('Error', 'Failed to update menu item. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Body style={{ marginTop: 16 }}>Loading menu item...</Body>
        </View>
      </CommonView>
    );
  }

  // Show error state
  if (error) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialCommunityIcon name="alert-circle" size={64} color={colors.error} />
          <Heading3 style={{ marginTop: 16, marginBottom: 8 }}>Error Loading Item</Heading3>
          <Body style={{ textAlign: 'center', marginBottom: 20 }}>
            Failed to load menu item details. Please try again.
          </Body>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <Card style={{ marginBottom: 20, borderRadius: 12 }}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={{
              height: scale(200),
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: colors.surfaceVariant,
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcon
                  name="camera-plus"
                  size={48}
                  color={colors.onSurfaceVariant}
                />
                <Body style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
                  Tap to add image
                </Body>
              </View>
            )}
            
            {/* Camera overlay */}
            <View
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 2,
              }}
            >
              <MaterialCommunityIcon
                name="camera"
                size={20}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Form Fields */}
        <View style={{ gap: 16 }}>
          {/* Food Name */}
          <TextInput
            mode="outlined"
            label="Food Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter food name"
            style={{ backgroundColor: colors.surface }}
            left={<TextInput.Icon icon="food" />}
          />

          {/* Price */}
          <TextInput
            mode="outlined"
            label="Price (XAF) *"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={{ backgroundColor: colors.surface }}
            left={<TextInput.Icon icon="currency-usd" />}
          />

          {/* Category */}
          <View>
            <Label style={{ marginBottom: 8, color: colors.onSurface }}>
              Category *
            </Label>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {Object.entries(FOOD_CATEGORIES).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setCategory(key as FoodCategory)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        category === key ? colors.primary : colors.surfaceVariant,
                      borderWidth: 1,
                      borderColor:
                        category === key ? colors.primary : colors.outline,
                    }}
                  >
                    <Body
                      style={{
                        color:
                          category === key ? colors.onPrimary : colors.onSurfaceVariant,
                      }}
                    >
                      {label}
                    </Body>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Description */}
          <TextInput
            mode="outlined"
            label="Description *"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the dish..."
            multiline
            numberOfLines={4}
            style={{ backgroundColor: colors.surface }}
            left={<TextInput.Icon icon="text" />}
          />

          {/* Availability Toggle */}
          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Label style={{ color: colors.onSurface }}>Availability</Label>
                <Body style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
                  {isAvailable ? 'Available for orders' : 'Currently unavailable'}
                </Body>
              </View>
              <TouchableOpacity
                onPress={() => setIsAvailable(!isAvailable)}
                style={{
                  width: 60,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isAvailable ? colors.primary : colors.surfaceVariant,
                  justifyContent: 'center',
                  paddingHorizontal: 4,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                    alignSelf: isAvailable ? 'flex-end' : 'flex-start',
                  }}
                />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 32, gap: 12 }}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={updateMenuItemMutation.isPending}
            disabled={updateMenuItemMutation.isPending}
            style={{ paddingVertical: 8 }}
            contentStyle={{ height: 48 }}
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={updateMenuItemMutation.isPending}
            style={{ paddingVertical: 8 }}
            contentStyle={{ height: 48 }}
          >
            Cancel
          </Button>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </CommonView>
  );
};