import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import ApiCategoryDropdown from '@/src/components/common/ApiCategoryDropdown';
import TimePicker from '@/src/components/common/TimePicker';
import { useCurrentRestaurant } from '@/src/stores/AuthStore';
import { useCreateMenuItem } from '@/src/hooks/restaurant/useMenuApi';
import { useNavigation } from '@react-navigation/native';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';
import { useTranslation } from 'react-i18next';
import { pickImageForUpload, isValidImageType, getFileExtension } from '@/src/utils/imageUtils';
import { CreateMenuItemRequest } from '@/src/services/restaurant/menuApi';
import { Typography, Heading1, Body, Label, Caption } from '@/src/components/common/Typography';

// Form data interface for better type safety
interface FormData {
  foodName: string;
  price: string;
  description: string;
  category: string;
  imageUri: string | null;
  imageFile: { uri: string; type: string; name: string } | null;
  startTime: Date | null;
  endTime: Date | null;
}

// Helper function to create proper ISO time format for daily scheduling
const createDailyScheduleISO = (time: Date): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
};

// Memoized components for better performance
const FormField = React.memo<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}>(({ label, required = false, children }) => {
  const { colors } = useTheme();
  
  return (
    <View className="mb-6">
      <Label 
        color={colors.onSurface}
        weight="semibold"
        style={{ marginBottom: 12 }}
      >
        {label} {required && <Typography color={colors.error}>*</Typography>}
      </Label>
      {children}
    </View>
  );
});
FormField.displayName = 'FormField';

const ImageUploadSection = React.memo<{
  imageUri: string | null;
  isUploading: boolean;
  onImagePick: () => void;
}>(({ imageUri, isUploading, onImagePick }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className="h-48 rounded-2xl mb-6 overflow-hidden"
      style={{
        backgroundColor: colors.surfaceVariant,
        borderWidth: 1,
        borderColor: imageUri ? colors.primary : colors.outline,
        borderStyle: imageUri ? 'solid' : 'dashed',
      }}
      onPress={onImagePick}
      disabled={isUploading}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <View className="relative w-full h-full">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <MaterialCommunityIcons name="camera" size={32} color="white" />
            <Caption color="white" weight="medium" style={{ marginTop: 8 }}>
              {t('change_image') || 'Change Image'}
            </Caption>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          {isUploading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <MaterialCommunityIcons 
                name="camera-plus" 
                size={48} 
                color={colors.primary} 
              />
              <Label 
                color={colors.primary}
                weight="semibold"
                style={{ marginTop: 12 }}
              >
                {t('add_food_image') || 'Add Food Image'}
              </Label>
              <Caption 
                color={colors.onSurfaceVariant}
                align="center"
                style={{ paddingHorizontal: 16, marginTop: 4 }}
              >
                {t('tap_to_upload_image') || 'Tap to upload image (JPG, PNG)'}
              </Caption>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});
ImageUploadSection.displayName = 'ImageUploadSection';

const ActionButtons = React.memo<{
  onCancel: () => void;
  onSave: () => void;
  isLoading: boolean;
  isFormValid: boolean;
}>(({ onCancel, onSave, isLoading, isFormValid }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const isDisabled = isLoading || !isFormValid;

  return (
    <View 
      className="flex-row mt-8"
      style={{ gap: 16 }}
    >
      <TouchableOpacity
        className="flex-1 py-4 rounded-xl items-center"
        style={{ 
          backgroundColor: colors.surfaceVariant,
          opacity: isLoading ? 0.6 : 1,
        }}
        onPress={onCancel}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Label 
          color={colors.onSurfaceVariant}
          weight="semibold"
        >
          {t('cancel') || 'Cancel'}
        </Label>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="flex-1 py-4 rounded-xl items-center"
        style={{ 
          backgroundColor: isDisabled ? colors.surfaceVariant : colors.primary,
          opacity: isDisabled ? 0.6 : 1,
        }}
        onPress={onSave}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color={colors.onSurfaceVariant} />
            <Label 
              color={colors.onSurfaceVariant}
              weight="semibold"
              style={{ marginLeft: 8 }}
            >
              {t('saving') || 'Saving...'}
            </Label>
          </View>
        ) : (
          <Label 
            color={isFormValid ? colors.onPrimary : colors.onSurfaceVariant}
            weight="bold"
          >
            {t('save_item') || 'Save Item'}
          </Label>
        )}
      </TouchableOpacity>
    </View>
  );
});
ActionButtons.displayName = 'ActionButtons';

export const AddFoodScreen = () => {
  const navigation = useNavigation<RestaurantMenuStackScreenProps<'MenuItemsList'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentRestaurant = useCurrentRestaurant();
  const restaurantId = currentRestaurant?.id;

  // Consolidated form state
  const [formData, setFormData] = useState<FormData>({
    foodName: '',
    price: '',
    description: '',
    category: '',
    imageUri: null,
    imageFile: null,
    startTime: null,
    endTime: null,
  });
  
  const [isUploading, setIsUploading] = useState(false);

  // React Query hook for creating menu item
  const createMenuItemMutation = useCreateMenuItem();

  // Memoized form update function
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Enhanced validation with detailed error checking
  const validation = useMemo(() => {
    const { foodName, price, category, startTime, endTime } = formData;
    const priceValue = parseFloat(price);
    
    const errors: string[] = [];
    
    // Required field validation
    if (!foodName.trim()) {
      errors.push(t('validation.food_name_required') || 'Food name is required');
    } else if (foodName.trim().length < 2) {
      errors.push(t('validation.food_name_too_short') || 'Food name is too short');
    }
    
    if (!category) {
      errors.push(t('validation.category_required') || 'Category is required');
    }
    
    if (!price.trim()) {
      errors.push(t('validation.price_required') || 'Price is required');
    } else if (isNaN(priceValue) || priceValue <= 0) {
      errors.push(t('validation.price_must_be_positive') || 'Price must be a positive number');
    } else if (priceValue > 1000000) {
      errors.push(t('validation.price_too_high') || 'Price is too high');
    }
    
    // Time validation - both times must be provided if one is provided
    if ((startTime && !endTime) || (!startTime && endTime)) {
      errors.push(t('both_times_required_if_one_selected') || 'Both start and end times are required if scheduling is used');
    }
    
    // Time validation - start time must be before end time
    if (startTime && endTime && startTime >= endTime) {
      errors.push(t('start_time_must_be_before_end_time') || 'Start time must be before end time');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      hasErrors: errors.length > 0
    };
  }, [formData, t]);

  // Memoized image picker
  const handleImagePick = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsUploading(true);

      const result = await pickImageForUpload();
      
      if (result) {
        // Validate image type
        if (!isValidImageType(result.type)) {
          Alert.alert(
            t('invalid_image_type') || 'Invalid Image Type',
            t('please_select_jpg_or_png') || 'Please select a JPG or PNG image.'
          );
          return;
        }

        // Update the correct file extension based on type
        const extension = getFileExtension(result.type);
        const fileName = `menu-item-${Date.now()}.${extension}`;
        
        const imageFile = {
          uri: result.uri,
          type: result.type,
          name: fileName,
        };

        updateFormData({
          imageUri: result.uri,
          imageFile: imageFile,
        });
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('error') || 'Error', t('failed_to_pick_image') || 'Failed to pick image');
    } finally {
      setIsUploading(false);
    }
  }, [updateFormData, t]);

  // Memoized save handler
  const handleSave = useCallback(async () => {
    if (!restaurantId) {
      Alert.alert(t('error') || 'Error', t('restaurant_id_not_found') || 'Restaurant ID not found');
      return;
    }

    if (!validation.isValid) {
      const errorMessage = validation.errors.join('\n• ');
      Alert.alert(
        t('validation_errors') || 'Validation Errors', 
        `${t('please_fix_following_errors') || 'Please fix the following errors'}:\n\n• ${errorMessage}`,
        [{ text: t('ok') || 'OK', style: 'default' }]
      );
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Prepare time values - only include if both are provided
      let startAtISO: string | undefined;
      let endAtISO: string | undefined;
      
      if (formData.startTime && formData.endTime) {
        startAtISO = createDailyScheduleISO(formData.startTime);
        endAtISO = createDailyScheduleISO(formData.endTime);
        
        console.log('Time scheduling enabled:', {
          startTime: formData.startTime,
          endTime: formData.endTime,
          startAtISO,
          endAtISO
        });
      }
      
      // Prepare menu item data according to API interface
      const menuItemData: CreateMenuItemRequest = {
        name: formData.foodName.trim(),
        description: formData.description.trim() || '',
        price: parseFloat(formData.price),
        category: formData.category as any,
        isAvailable: true,
        picture: formData.imageFile || undefined,
        startAt: startAtISO,
        endAt: endAtISO,
      };

      console.log('Sending menu item data to backend:', {
        restaurantId,
        name: menuItemData.name,
        price: menuItemData.price,
        category: menuItemData.category,
        hasImage: !!menuItemData.picture,
        hasSchedule: !!(menuItemData.startAt && menuItemData.endAt)
      });

      // Use the React Query mutation
      const response = await createMenuItemMutation.mutateAsync({
        restaurantId,
        data: menuItemData,
      });

      console.log('Menu item created successfully:', response);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        t('success') || 'Success', 
        t('menu_item_created_successfully') || 'Menu item created successfully', 
        [
          { text: t('ok') || 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error: any) {
      console.error('Error creating menu item:', error);
      
      // Extract meaningful error message
      let errorMessage = t('failed_to_create_menu_item') || 'Failed to create menu item';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        t('error') || 'Error', 
        errorMessage,
        [{ text: t('ok') || 'OK', style: 'default' }]
      );
    }
  }, [restaurantId, validation, formData, createMenuItemMutation, navigation, t]);

  // Memoized cancel handler
  const handleCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  }, [navigation]);

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-8">
            <Heading1 
              color={colors.onBackground}
              weight="bold"
            >
              {t('add_new_item') || 'Add New Item'}
            </Heading1>
            <Body 
              color={colors.onSurfaceVariant}
              style={{ marginTop: 8 }}
            >
              {t('fill_details_to_add_menu_item') || 'Fill in the details to add a new menu item'}
            </Body>
          </View>

          {/* Image Upload */}
          <ImageUploadSection
            imageUri={formData.imageUri}
            isUploading={isUploading}
            onImagePick={handleImagePick}
          />

          {/* Form Fields */}
          <FormField label={t('food_name') || 'Food Name'} required>
            <TextInput
              mode="outlined"
              value={formData.foodName}
              onChangeText={(text) => updateFormData({ foodName: text })}
              placeholder={t('enter_food_name') || 'Enter food name'}
              style={{ backgroundColor: colors.surface }}
              outlineStyle={{ borderRadius: 12 }}
            />
          </FormField>

          <FormField label={`${t('price') || 'Price'} (XAF)`} required>
            <TextInput
              mode="outlined"
              value={formData.price}
              onChangeText={(text) => updateFormData({ price: text })}
              placeholder={t('enter_price') || 'Enter price'}
              keyboardType="numeric"
              style={{ backgroundColor: colors.surface }}
              outlineStyle={{ borderRadius: 12 }}
              left={<TextInput.Icon icon="currency-usd" />}
            />
          </FormField>

          <FormField label={t('category') || 'Category'} required>
            <ApiCategoryDropdown
              selectedValue={formData.category}
              onValueChange={(value) => updateFormData({ category: value })}
              placeholder={t('select_category') || 'Select category'}
              error={false}
            />
          </FormField>

          <FormField label={t('description') || 'Description'}>
            <TextInput
              mode="outlined"
              value={formData.description}
              onChangeText={(text) => updateFormData({ description: text })}
              placeholder={t('enter_description') || 'Enter description (optional)'}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: colors.surface }}
              outlineStyle={{ borderRadius: 12 }}
            />
          </FormField>

          {/* Schedule Section */}
          <FormField label={`${t('daily_schedule') || 'Daily Schedule'} (${t('optional') || 'Optional'})`}>
            <View 
              className="flex-row"
              style={{ gap: 16 }}
            >
              <View className="flex-1">
                <TimePicker
                  value={formData.startTime}
                  onTimeChange={(time) => updateFormData({ startTime: time })}
                  label={t('start_time') || 'Start Time'}
                  placeholder={t('select_start_time') || 'Select start time'}
                  error={validation.hasErrors && formData.startTime && formData.endTime && formData.startTime >= formData.endTime}
                />
              </View>
              <View className="flex-1">
                <TimePicker
                  value={formData.endTime}
                  onTimeChange={(time) => updateFormData({ endTime: time })}
                  label={t('end_time') || 'End Time'}
                  placeholder={t('select_end_time') || 'Select end time'}
                  error={validation.hasErrors && formData.startTime && formData.endTime && formData.startTime >= formData.endTime}
                />
              </View>
            </View>
            
            {/* Time validation error */}
            {validation.hasErrors && (formData.startTime || formData.endTime) && (
              <View className="mt-2">
                {validation.errors
                  .filter(error => 
                    error.includes('time') || 
                    error.includes(t('both_times_required_if_one_selected') || 'Both times required')
                  )
                  .map((error, index) => (
                    <Caption 
                      key={index}
                      color={colors.error}
                    >
                      • {error}
                    </Caption>
                  ))
                }
              </View>
            )}
            
            <Caption 
              color={colors.onSurfaceVariant}
              style={{ marginTop: 8 }}
            >
              {t('schedule_help_text') || 'Set specific hours when this item is available during the day'}
            </Caption>
          </FormField>

          {/* Validation Summary */}
          {validation.hasErrors && (
            <View 
              className="mb-6 p-4 rounded-xl"
              style={{ backgroundColor: colors.errorContainer }}
            >
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons 
                  name="alert-circle" 
                  size={20} 
                  color={colors.error} 
                />
                <Label 
                  color={colors.error}
                  weight="semibold"
                  style={{ marginLeft: 8 }}
                >
                  {t('please_fix_errors') || 'Please fix the following errors'}
                </Label>
              </View>
              {validation.errors.map((error, index) => (
                <Caption 
                  key={index}
                  color={colors.onErrorContainer}
                  style={{ marginLeft: 24 }}
                >
                  • {error}
                </Caption>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <ActionButtons
            onCancel={handleCancel}
            onSave={handleSave}
            isLoading={createMenuItemMutation.isPending}
            isFormValid={validation.isValid}
          />

          {/* Helper Text */}
          <Caption 
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginTop: 16 }}
          >
            * {t('required_fields') || 'Required fields'}
          </Caption>
        </ScrollView>
      </KeyboardAvoidingView>
    </CommonView>
  );
};