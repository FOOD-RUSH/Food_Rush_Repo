import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Button, Card, useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import { useMenuItemById } from '@/src/hooks/customer/useCustomerApi';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCurrentRestaurant } from '@/src/stores/AuthStore';
import { useUpdateMenuItem } from '@/src/hooks/restaurant/useMenuApi';
import {
  Heading3,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import { useResponsive } from '@/src/hooks/useResponsive';
import { FoodCategory, FOOD_CATEGORIES } from '@/src/types/MenuItem';
import {
  pickImageForUpload,
  isValidImageType,
  SimpleImageResult,
  createImageFormDataObject,
} from '@/src/utils/imageUtils';

export const EditFoodScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'RestaurantEditFoodItem'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentRestaurant = useCurrentRestaurant();
  const restaurantId = currentRestaurant?.id;
  const { scale } = useResponsive();

  const { menuId } = route.params;

  // API hooks
  const { data: menuItem, isLoading, error } = useMenuItemById(menuId);
  const updateMenuItemMutation = useUpdateMenuItem();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('local-dishes');
  const [image, setImage] = useState(''); // Display URI
  const [picture, setPicture] = useState<SimpleImageResult | null>(null); // Upload data
  const [isAvailable, setIsAvailable] = useState(true);

  // Update form state when menuItem data is loaded
  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setPrice(menuItem.price?.toString() || '');
      setDescription(menuItem.description || '');
      setCategory((menuItem.category as FoodCategory) || 'local-dishes');
      setImage(menuItem.image || '');
      setIsAvailable(menuItem.isAvailable ?? true);
    }
  }, [menuItem]);

  // Set navigation title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: menuItem?.name ? `Edit ${menuItem.name}` : 'Edit Item',
    });
  }, [menuItem?.name, navigation]);

  // Image picker
  const handleImagePick = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const imageResult = await pickImageForUpload();

      if (imageResult) {
        // Validate image type (JPG/PNG only)
        if (!isValidImageType(imageResult.type)) {
          Alert.alert(
            t('invalid_image_type') || 'Invalid Image Type',
            'Please select a JPG or PNG image only.',
          );
          return;
        }

        // Update state - use picker URI directly
        setImage(imageResult.uri);
        setPicture(createImageFormDataObject(imageResult));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      console.error('❌ Error picking image:', error);

      let errorMessage = t('failed_to_pick_image') || 'Failed to pick image';

      if (error?.message?.includes('Permission')) {
        errorMessage =
          t('errors.camera_permission_denied') ||
          'Camera permission was denied. Please enable it in settings.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert(t('error') || 'Error', errorMessage);
    }
  }, [t]);

  // Form validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    const priceValue = parseFloat(price);

    if (!name.trim()) {
      errors.push(
        t('validation.food_name_required') || 'Food name is required',
      );
    } else if (name.trim().length < 2) {
      errors.push(
        t('validation.food_name_too_short') || 'Food name is too short',
      );
    }

    if (!price.trim()) {
      errors.push(t('validation.price_required') || 'Price is required');
    } else if (isNaN(priceValue) || priceValue <= 0) {
      errors.push(
        t('validation.price_must_be_positive') ||
          'Price must be a positive number',
      );
    } else if (priceValue > 1000000) {
      errors.push(t('validation.price_too_high') || 'Price is too high');
    }

    if (!description.trim()) {
      errors.push('Description is required');
    }

    if (picture) {
      if (!picture.uri || !picture.name || !picture.type) {
        errors.push('Image data is incomplete');
      }
      if (picture.type && !isValidImageType(picture.type)) {
        errors.push('Invalid image type. Only JPG and PNG are allowed.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      hasErrors: errors.length > 0,
    };
  }, [name, price, description, picture, t]);

  const validateForm = useCallback(() => {
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('\n• ');
      Alert.alert(
        t('validation_errors') || 'Validation Errors',
        `${t('please_fix_following_errors') || 'Please fix the following errors'}:\n\n• ${errorMessage}`,
        [{ text: t('ok') || 'OK', style: 'default' }],
      );
      return false;
    }
    return true;
  }, [validation, t]);

  const handleSave = useCallback(async () => {
    if (!restaurantId) {
      Alert.alert(
        t('error') || 'Error',
        t('restaurant_id_not_found') ||
          'Restaurant ID not found. Please log in again.',
      );
      return;
    }

    if (!validateForm()) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const updateData: any = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        isAvailable,
      };

      // Only include picture if user selected a new image
      if (picture?.uri && picture?.name && picture?.type) {
        updateData.picture = createImageFormDataObject(picture);
      } else {
      }

      await updateMenuItemMutation.mutateAsync({
        restaurantId,
        itemId: menuId,
        data: updateData,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        t('success') || 'Success',
        t('menu_item_updated_successfully') ||
          'Menu item updated successfully!',
        [{ text: t('ok') || 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      console.error('Error updating menu item:', error);

      let errorMessage =
        t('failed_to_update_menu_item') ||
        'Failed to update menu item. Please try again.';

      if (error?.response?.status === 400) {
        errorMessage = t('invalid_data_provided') || 'Invalid data provided';
      } else if (error?.response?.status === 404) {
        errorMessage = t('menu_item_not_found') || 'Menu item not found';
      } else if (error?.response?.status === 413) {
        errorMessage = t('image_file_too_large') || 'Image file is too large';
      } else if (error?.message?.includes('Network')) {
        errorMessage =
          t('network_error') || 'Network error. Please check your connection.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert(t('error') || 'Error', errorMessage);
    }
  }, [
    restaurantId,
    validateForm,
    name,
    description,
    price,
    category,
    isAvailable,
    picture,
    menuId,
    updateMenuItemMutation,
    navigation,
    t,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Body style={{ marginTop: 16, color: colors.onSurfaceVariant }}>
            Loading menu item...
          </Body>
        </View>
      </CommonView>
    );
  }

  // Error state
  if (error) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <MaterialCommunityIcon
            name="alert-circle"
            size={64}
            color={colors.error}
          />
          <Heading3
            style={{ marginTop: 16, marginBottom: 8, color: colors.onSurface }}
          >
            Error Loading Item
          </Heading3>
          <Body
            style={{
              textAlign: 'center',
              marginBottom: 20,
              color: colors.onSurfaceVariant,
            }}
          >
            Failed to load menu item. Please try again.
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
        contentContainerStyle={{ padding: 4 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <Card style={{ marginBottom: 20, overflow: 'hidden' }}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={{
              height: scale(220),
              backgroundColor: colors.surfaceVariant,
              borderWidth: image ? 1 : 0,
              borderColor: image ? colors.primary : 'transparent',
            }}
            activeOpacity={0.8}
          >
            {image ? (
              <>
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcon
                    name="camera"
                    size={20}
                    color="white"
                  />
                  <Body style={{ marginLeft: 8, color: 'white' }}>
                    {t('change_image') || 'Tap to change image'}
                  </Body>
                </View>
              </>
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
                  color={colors.primary}
                />
                <Body
                  style={{
                    marginTop: 12,
                    color: colors.primary,
                    fontWeight: '600',
                  }}
                >
                  {t('add_food_image') || 'Tap to add image'}
                </Body>
                <Caption
                  style={{
                    marginTop: 4,
                    color: colors.onSurfaceVariant,
                    textAlign: 'center',
                    paddingHorizontal: 16,
                  }}
                >
                  {t('supported_formats') || 'Supported: JPG, PNG only'}
                </Caption>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        {/* Form Fields */}
        <Card style={{ padding: 16, marginBottom: 16 }}>
          <Label
            style={{ marginBottom: 16, color: colors.primary, fontSize: 16 }}
          >
            {t('basic_information') || 'Basic Information'}
          </Label>

          <TextInput
            mode="outlined"
            label={`${t('food_name') || 'Food Name'} *`}
            value={name}
            onChangeText={setName}
            placeholder={t('enter_food_name') || 'e.g., Jollof Rice'}
            style={{
              marginBottom: 16,
              backgroundColor: colors.surface,
            }}
            outlineStyle={{ borderRadius: 12 }}
            left={<TextInput.Icon icon="food" />}
            error={validation.hasErrors && !name.trim()}
          />

          <TextInput
            mode="outlined"
            label={`${t('price') || 'Price'} (XAF) *`}
            value={price}
            onChangeText={setPrice}
            placeholder={t('enter_price') || '0'}
            keyboardType="decimal-pad"
            style={{
              marginBottom: 16,
              backgroundColor: colors.surface,
            }}
            outlineStyle={{ borderRadius: 12 }}
            left={<TextInput.Icon icon="currency-usd" />}
            error={
              validation.hasErrors &&
              (!price.trim() ||
                isNaN(parseFloat(price)) ||
                parseFloat(price) <= 0)
            }
          />

          <TextInput
            mode="outlined"
            label={`${t('description') || 'Description'} *`}
            value={description}
            onChangeText={setDescription}
            placeholder={t('enter_description') || 'Describe your dish...'}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: colors.surface,
            }}
            outlineStyle={{ borderRadius: 12 }}
            left={<TextInput.Icon icon="text" />}
            error={validation.hasErrors && !description.trim()}
            contentStyle={{
              height: 100,
            }}
          />
        </Card>

        {/* Category Selection */}
        <Card style={{ padding: 16, marginBottom: 16 }}>
          <Label
            style={{ marginBottom: 12, color: colors.primary, fontSize: 16 }}
          >
            {t('category') || 'Category'} *
          </Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {Object.entries(FOOD_CATEGORIES).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setCategory(key as FoodCategory)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor:
                      category === key ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor:
                      category === key ? colors.primary : colors.outline,
                  }}
                >
                  <Body
                    style={{
                      color:
                        category === key ? colors.onPrimary : colors.onSurface,
                      fontWeight: category === key ? '600' : '400',
                    }}
                  >
                    {label}
                  </Body>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        {/* Validation Summary */}
        {validation.hasErrors && (
          <Card
            style={{
              padding: 16,
              marginBottom: 16,
              backgroundColor: colors.errorContainer,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcon
                name="alert-circle"
                size={20}
                color={colors.error}
              />
              <Label
                style={{
                  marginLeft: 8,
                  color: colors.error,
                  fontWeight: '600',
                }}
              >
                {t('please_fix_errors') || 'Please fix the following errors'}
              </Label>
            </View>
            {validation.errors.map((error, index) => (
              <Caption
                key={index}
                style={{ color: colors.onErrorContainer, marginLeft: 24 }}
              >
                • {error}
              </Caption>
            ))}
          </Card>
        )}

        {/* Availability Toggle */}
        <Card style={{ padding: 16, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Label
                style={{
                  color: colors.onSurface,
                  fontSize: 16,
                  marginBottom: 4,
                }}
              >
                {t('availability') || 'Availability'}
              </Label>
              <Body style={{ color: colors.onSurfaceVariant }}>
                {isAvailable
                  ? t('available_for_orders') || 'Available for orders'
                  : t('currently_unavailable') || 'Currently unavailable'}
              </Body>
            </View>
            <TouchableOpacity
              onPress={() => setIsAvailable(!isAvailable)}
              style={{
                width: 56,
                height: 32,
                borderRadius: 16,
                backgroundColor: isAvailable
                  ? colors.primary
                  : colors.surfaceVariant,
                justifyContent: 'center',
                padding: 2,
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: 'white',
                  alignSelf: isAvailable ? 'flex-end' : 'flex-start',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Action Buttons */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={updateMenuItemMutation.isPending}
          disabled={updateMenuItemMutation.isPending || !validation.isValid}
          style={{
            marginBottom: 12,
            backgroundColor: validation.isValid
              ? colors.primary
              : colors.surfaceVariant,
          }}
          contentStyle={{ height: 48 }}
        >
          {t('save_changes') || 'Save Changes'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={updateMenuItemMutation.isPending}
          contentStyle={{ height: 48 }}
        >
          {t('cancel') || 'Cancel'}
        </Button>

        <Caption
          style={{
            textAlign: 'center',
            marginTop: 16,
            color: colors.onSurfaceVariant,
          }}
        >
          * {t('required_fields') || 'Required fields'}
        </Caption>

        <View style={{ height: 40 }} />
      </ScrollView>
    </CommonView>
  );
};
