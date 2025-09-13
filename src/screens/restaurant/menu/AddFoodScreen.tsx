import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import CommonView from '@/src/components/common/CommonView';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { useCreateMenuItem, useUploadImage } from '@/src/hooks/restaurant/useMenuApi';
import { useNavigation } from '@react-navigation/native';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

export const AddFoodScreen = () => {
  const navigation = useNavigation<RestaurantMenuStackScreenProps<'AddMenuItem'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation();
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
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleImagePick = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permission_needed'), t('please_grant_photo_permission'));
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
          const responseData = uploadResponse.data as any;
          const imageUrl = responseData?.url || responseData?.imageUrl || responseData?.image;
          setImageUri(imageUrl);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert(t('upload_error'), t('failed_to_upload_image'));
          // Fallback to local storage
          const imageId = generateImageId();
          const localUri = await saveImageLocally(asset.uri, imageId);
          setImageUri(localUri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('error'), t('failed_to_pick_image'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert(t('error'), t('restaurant_id_not_found'));
      return;
    }

    if (!foodName.trim() || !price.trim()) {
      Alert.alert(t('error'), t('please_fill_required_fields'));
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const menuItemData = {
        name: foodName.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: category.trim() || 'default',
        imageUrl: imageUri || undefined,
        isAvailable: true,
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
  };

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className={`${isSmallScreen ? 'px-4 pt-4' : 'px-6 pt-6'}`}
        >
          {/* Header Section - Enhanced typography */}
          <View className="mb-8">
            <Text 
              className={`${isSmallScreen ? 'text-2xl' : 'text-3xl'} font-bold`}
              style={{ color: colors.onBackground, letterSpacing: -0.5 }}
            >
              {t('add_new_item')}
            </Text>
            <Text 
              className={`${isSmallScreen ? 'text-sm' : 'text-base'} mt-2 font-medium`}
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('fill_details_to_add_menu_item')}
            </Text>
          </View>

          {/* Enhanced Image Upload Section */}
          <TouchableOpacity
            className={`${isSmallScreen ? 'h-44' : 'h-52'} rounded-3xl mb-8 items-center justify-center relative overflow-hidden`}
            style={{ 
              backgroundColor: colors.surfaceVariant,
              borderWidth: 2,
              borderColor: imageUri ? '#007aff' : colors.outline,
              borderStyle: 'dashed',
            }}
            onPress={handleImagePick}
            disabled={isUploading}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 20,
                  }}
                  resizeMode="cover"
                />
                <View 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons name="camera" size={36} color="#FFFFFF" />
                  <Text 
                    className={`text-white mt-2 ${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold`}
                  >
                    {t('change_image')}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <MaterialCommunityIcons 
                  name="camera-plus" 
                  size={isSmallScreen ? 48 : 56} 
                  color="#007aff" 
                />
                <Text 
                  className={`text-blue-500 mt-3 ${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold`}
                >
                  {isUploading ? t('uploading') : t('add_food_image')}
                </Text>
                <Text 
                  className={`${isSmallScreen ? 'text-xs' : 'text-sm'} mt-1 text-center px-4`}
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('tap_to_upload_image')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Enhanced Form Fields with borderless design */}
          <View className="space-y-6">
            {/* Food Name */}
            <View>
              <Text 
                className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-2`}
                style={{ color: colors.onSurface }}
              >
                {t('food_name')} *
              </Text>
              <View 
                className="rounded-2xl"
                style={{ 
                  backgroundColor: colors.surface,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
              >
                <TextInput
                  mode="flat"
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder={t('enter_food_name')}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: isSmallScreen ? 16 : 17,
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: isSmallScreen ? 12 : 14,
                  }}
                  underlineStyle={{ display: 'none' }}
                  activeUnderlineColor="transparent"
                  textColor={colors.onSurface}
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>

            {/* Price */}
            <View>
              <Text 
                className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-2`}
                style={{ color: colors.onSurface }}
              >
                {t('price')} (XAF) *
              </Text>
              <View 
                className="rounded-2xl"
                style={{ 
                  backgroundColor: colors.surface,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
              >
                <TextInput
                  mode="flat"
                  value={price}
                  onChangeText={setPrice}
                  placeholder={t('enter_price')}
                  keyboardType="numeric"
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: isSmallScreen ? 16 : 17,
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: isSmallScreen ? 12 : 14,
                  }}
                  underlineStyle={{ display: 'none' }}
                  activeUnderlineColor="transparent"
                  textColor={colors.onSurface}
                  placeholderTextColor={colors.onSurfaceVariant}
                  left={<TextInput.Icon icon="currency-usd" color={colors.onSurfaceVariant} />}
                />
              </View>
            </View>

            {/* Category */}
            <View>
              <Text 
                className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-2`}
                style={{ color: colors.onSurface }}
              >
                {t('category')}
              </Text>
              <View 
                className="rounded-2xl"
                style={{ 
                  backgroundColor: colors.surface,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
              >
                <TextInput
                  mode="flat"
                  value={category}
                  onChangeText={setCategory}
                  placeholder={t('enter_category')}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: isSmallScreen ? 16 : 17,
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: isSmallScreen ? 12 : 14,
                  }}
                  underlineStyle={{ display: 'none' }}
                  activeUnderlineColor="transparent"
                  textColor={colors.onSurface}
                  placeholderTextColor={colors.onSurfaceVariant}
                  left={<TextInput.Icon icon="tag" color={colors.onSurfaceVariant} />}
                />
              </View>
            </View>

            {/* Description */}
            <View>
              <Text 
                className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-2`}
                style={{ color: colors.onSurface }}
              >
                {t('description')}
              </Text>
              <View 
                className="rounded-2xl"
                style={{ 
                  backgroundColor: colors.surface,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
              >
                <TextInput
                  mode="flat"
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t('enter_description')}
                  multiline
                  numberOfLines={4}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: isSmallScreen ? 16 : 17,
                    minHeight: isSmallScreen ? 100 : 120,
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: isSmallScreen ? 12 : 14,
                  }}
                  underlineStyle={{ display: 'none' }}
                  activeUnderlineColor="transparent"
                  textColor={colors.onSurface}
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>
          </View>

          {/* Enhanced Action Buttons */}
          <View className="flex-row space-x-4 mt-10">
            <TouchableOpacity
              className={`flex-1 ${isSmallScreen ? 'py-4' : 'py-5'} rounded-2xl`}
              style={{ 
                backgroundColor: colors.surfaceVariant,
                elevation: 1,
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <Text 
                className={`text-center ${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold`}
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-1 ${isSmallScreen ? 'py-4' : 'py-5'} rounded-2xl`}
              style={{ 
                backgroundColor: '#007aff',
                elevation: 3,
                shadowColor: '#007aff',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
              onPress={handleSave}
              disabled={createMenuItemMutation.isPending}
              activeOpacity={0.9}
            >
              <Text 
                className={`text-center text-white ${isSmallScreen ? 'text-base' : 'text-lg'} font-bold`}
              >
                {createMenuItemMutation.isPending ? t('saving') : t('save_item')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Helper Text */}
          <Text 
            className={`text-center ${isSmallScreen ? 'text-xs' : 'text-sm'} mt-4`}
            style={{ color: colors.onSurfaceVariant }}
          >
            * {t('required_fields')}
          </Text>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};