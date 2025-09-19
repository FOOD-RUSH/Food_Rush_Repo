import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
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
import { useUser } from '@/src/stores/customerStores/AuthStore';
import { useCreateMenuItem } from '@/src/hooks/restaurant/useMenuApi';
import { useNavigation } from '@react-navigation/native';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';
import { useTranslation } from 'react-i18next';
import { pickImageWithBase64 } from '@/src/utils/imageUtils';
import { createDailyScheduleISO } from '@/src/utils/timeUtils';

// Form data interface for better type safety
interface FormData {
  foodName: string;
  price: string;
  description: string;
  category: string;
  imageUri: string | null;
  imageBase64: string | null;
  startTime: Date | null;
  endTime: Date | null;
}

// Memoized components for better performance
const FormField = React.memo<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}>(({ label, required = false, children }) => {
  const { colors } = useTheme();
  
  return (
    <View className="mb-6">
      <Text 
        className="text-base font-semibold mb-3"
        style={{ color: colors.onSurface }}
      >
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      {children}
    </View>
  );
});

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
            <Text className="text-white text-sm font-medium mt-2">
              {t('change_image')}
            </Text>
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
              <Text 
                className="text-base font-semibold mt-3"
                style={{ color: colors.primary }}
              >
                {t('add_food_image')}
              </Text>
              <Text 
                className="text-sm text-center px-4 mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('tap_to_upload_image')}
              </Text>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

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
      style={{ gap: 16 }} // Explicit 16px gap between buttons
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
        <Text 
          className="text-base font-semibold"
          style={{ color: colors.onSurfaceVariant }}
        >
          {t('cancel')}
        </Text>
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
            <Text 
              className="text-base font-semibold ml-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('saving')}
            </Text>
          </View>
        ) : (
          <Text 
            className="text-base font-bold"
            style={{ color: isFormValid ? colors.onPrimary : colors.onSurfaceVariant }}
          >
            {t('save_item')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

export const AddFoodScreen = () => {
  const navigation = useNavigation<RestaurantMenuStackScreenProps<'AddMenuItem'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const user = useUser();
  const restaurantId = user?.restaurantId;

  // Consolidated form state
  const [formData, setFormData] = useState<FormData>({
    foodName: '',
    price: '',
    description: '',
    category: '',
    imageUri: null,
    imageBase64: null,
    startTime: null,
    endTime: null,
  });
  
  const [isUploading, setIsUploading] = useState(false);

  // API hooks
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
      errors.push(t('food_name_required'));
    } else if (foodName.trim().length < 2) {
      errors.push(t('food_name_too_short'));
    }
    
    if (!category) {
      errors.push(t('category_required'));
    }
    
    if (!price.trim()) {
      errors.push(t('price_required'));
    } else if (isNaN(priceValue) || priceValue <= 0) {
      errors.push(t('price_must_be_positive'));
    } else if (priceValue > 1000000) {
      errors.push(t('price_too_high'));
    }
    
    // Time validation
    if (startTime && endTime) {
      if (startTime >= endTime) {
        errors.push(t('start_time_must_be_before_end_time'));
      }
    } else if ((startTime && !endTime) || (!startTime && endTime)) {
      errors.push(t('both_times_required_if_one_selected'));
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

      const result = await pickImageWithBase64();
      
      if (result) {
        updateFormData({
          imageUri: result.uri,
          imageBase64: result.base64 || null,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('error'), t('failed_to_pick_image'));
    } finally {
      setIsUploading(false);
    }
  }, [updateFormData, t]);

  // Memoized save handler
  const handleSave = useCallback(async () => {
    if (!restaurantId) {
      Alert.alert(t('error'), t('restaurant_id_not_found'));
      return;
    }

    // Enhanced validation with detailed error messages
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('\n• ');
      Alert.alert(
        t('validation_errors'), 
        `${t('please_fix_following_errors')}:\n\n• ${errorMessage}`,
        [{ text: t('ok'), style: 'default' }]
      );
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const menuItemData = {
        name: formData.foodName.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        isAvailable: true,
        picture: formData.imageBase64 || undefined,
        startAt: startTime ? createDailyScheduleISO(startTime.getHours(), startTime.getMinutes()) : undefined,
        endAt: endTime ? createDailyScheduleISO(endTime.getHours(), endTime.getMinutes()) : undefined,
      };

      await createMenuItemMutation.mutateAsync({
        restaurantId,
        data: menuItemData,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('success'), t('menu_item_created_successfully'), [
        { text: t('ok'), onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error creating menu item:', error);
      Alert.alert(t('error'), t('failed_to_create_menu_item'));
    }
  }, [restaurantId, validation.isValid, formData, createMenuItemMutation, navigation, t]);

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
            <Text 
              className="text-3xl font-bold"
              style={{ color: colors.onBackground }}
            >
              {t('add_new_item')}
            </Text>
            <Text 
              className="text-base mt-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('fill_details_to_add_menu_item')}
            </Text>
          </View>

          {/* Image Upload */}
          <ImageUploadSection
            imageUri={formData.imageUri}
            isUploading={isUploading}
            onImagePick={handleImagePick}
          />

          {/* Form Fields */}
          <FormField label={t('food_name')} required>
            <TextInput
              mode="outlined"
              value={formData.foodName}
              onChangeText={(text) => updateFormData({ foodName: text })}
              placeholder={t('enter_food_name')}
              style={{ backgroundColor: colors.surface }}
              outlineStyle={{ borderRadius: 12 }}
            />
          </FormField>

          <FormField label={`${t('price')} (XAF)`} required>
            <TextInput
              mode="outlined"
              value={formData.price}
              onChangeText={(text) => updateFormData({ price: text })}
              placeholder={t('enter_price')}
              keyboardType="numeric"
              style={{ backgroundColor: colors.surface }}
              outlineStyle={{ borderRadius: 12 }}
              left={<TextInput.Icon icon="currency-usd" />}
            />
          </FormField>

          <FormField label={t('category')} required>
            <ApiCategoryDropdown
              selectedValue={formData.category}
              onValueChange={(value) => updateFormData({ category: value })}
              placeholder={t('select_category')}
              error={false}
            />
          </FormField>

          <FormField label={t('description')}>
            <TextInput
              mode="outlined"
              value={formData.description}
              onChangeText={(text) => updateFormData({ description: text })}
              placeholder={t('enter_description')}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: colors.surface }}
              outlineStyle={{ borderRadius: 12 }}
            />
          </FormField>

          {/* Schedule Section */}
          <FormField label={`${t('daily_schedule')} (${t('optional')})`}>
            <View 
              className="flex-row"
              style={{ gap: 16 }} // Explicit 16px gap between time pickers
            >
              <View className="flex-1">
                <TimePicker
                  value={formData.startTime}
                  onTimeChange={(time) => updateFormData({ startTime: time })}
                  label={t('start_time')}
                  placeholder={t('select_start_time')}
                  error={validation.hasErrors && formData.startTime && formData.endTime && formData.startTime >= formData.endTime}
                />
              </View>
              <View className="flex-1">
                <TimePicker
                  value={formData.endTime}
                  onTimeChange={(time) => updateFormData({ endTime: time })}
                  label={t('end_time')}
                  placeholder={t('select_end_time')}
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
                    error.includes(t('both_times_required_if_one_selected'))
                  )
                  .map((error, index) => (
                    <Text 
                      key={index}
                      className="text-sm"
                      style={{ color: colors.error }}
                    >
                      • {error}
                    </Text>
                  ))
                }
              </View>
            )}
            
            <Text 
              className="text-sm mt-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('schedule_help_text')}
            </Text>
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
                <Text 
                  className="text-base font-semibold ml-2"
                  style={{ color: colors.error }}
                >
                  {t('please_fix_errors')}
                </Text>
              </View>
              {validation.errors.map((error, index) => (
                <Text 
                  key={index}
                  className="text-sm ml-6"
                  style={{ color: colors.onErrorContainer }}
                >
                  • {error}
                </Text>
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
          <Text 
            className="text-center text-sm mt-4"
            style={{ color: colors.onSurfaceVariant }}
          >
            * {t('required_fields')}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </CommonView>
  );
};