import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useTheme, TextInput, Card, Button, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useUser } from '@/src/stores/customerStores/AuthStore';
import { useUpdateRestaurantProfile } from '@/src/hooks/restaurant/useAuthhooks';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  multiline?: boolean;
  numberOfLines?: number;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  required = false,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`${isSmallScreen ? 'mb-4' : 'mb-5'}`}>
      <Text 
        className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-2`}
        style={{ color: colors.onSurface }}
      >
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      
      <View 
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: isFocused ? colors.primary : colors.outline,
          elevation: isFocused ? 3 : 1,
          shadowColor: isFocused ? colors.primary : colors.shadow || '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isFocused ? 0.2 : 0.1,
          shadowRadius: isFocused ? 4 : 2,
        }}
      >
        <View className="flex-row items-center">
          <View className={`${isSmallScreen ? 'p-3' : 'p-4'}`}>
            <MaterialCommunityIcons 
              name={icon as any} 
              size={isSmallScreen ? 20 : 22} 
              color={isFocused ? colors.primary : colors.onSurfaceVariant} 
            />
          </View>
          
          <TextInput
            mode="flat"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              fontSize: isSmallScreen ? 16 : 17,
              minHeight: multiline ? (isSmallScreen ? 80 : 100) : undefined,
            }}
            contentStyle={{
              paddingHorizontal: 0,
              paddingVertical: isSmallScreen ? 12 : 14,
              paddingRight: 16,
            }}
            underlineStyle={{ display: 'none' }}
            activeUnderlineColor="transparent"
            textColor={colors.onSurface}
            placeholderTextColor={colors.onSurfaceVariant}
          />
        </View>
      </View>
    </View>
  );
};

const ProfileEditScreen: React.FC<RootStackScreenProps<'RestaurantEditProfile'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const loggedInUser = useUser();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Form state
  const [formData, setFormData] = useState({
    fullName: loggedInUser?.fullName || '',
    email: loggedInUser?.email || '',
    phoneNumber: loggedInUser?.phoneNumber || '',
    restaurantName: loggedInUser?.restaurantName || '',
    address: loggedInUser?.address || '',
    website: loggedInUser?.website || '',
    cuisine: loggedInUser?.cuisine || '',
    bio: loggedInUser?.bio || '',
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(
    loggedInUser?.profilePicture || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const updateProfileMutation = useUpdateRestaurantProfile();

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

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permission_needed'), t('please_grant_photo_permission'));
        return;
      }

      setIsUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageId = generateImageId();
        const localUri = await saveImageLocally(result.assets[0].uri, imageId);
        setProfileImage(localUri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      // Error handling for image picking
      Alert.alert(t('error'), t('failed_to_pick_image'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate required fields
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.restaurantName.trim()) {
        Alert.alert(t('error'), t('please_fill_required_fields'));
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await updateProfileMutation.mutateAsync({
        ...formData,
        profilePicture: profileImage,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('success'), t('profile_updated_successfully'), [
        { text: t('ok'), onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      // Error handling for profile update
      Alert.alert(t('error'), t('failed_to_update_profile'));
    }
  };

  const isFormValid = formData.fullName.trim() && formData.email.trim() && formData.restaurantName.trim();

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Profile Picture Section */}
          <View 
            className={`items-center ${isSmallScreen ? 'py-6' : 'py-8'}`}
            style={{ backgroundColor: colors.surface }}
          >
            <TouchableOpacity
              onPress={handleImagePick}
              disabled={isUploading}
              activeOpacity={0.8}
              style={{
                position: 'relative',
                marginBottom: 16,
              }}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: isSmallScreen ? 100 : 110,
                    height: isSmallScreen ? 100 : 110,
                    borderRadius: isSmallScreen ? 50 : 55,
                    borderWidth: 4,
                    borderColor: colors.primary,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Avatar.Text
                  size={isSmallScreen ? 100 : 110}
                  label={formData.fullName.charAt(0).toUpperCase() || 'R'}
                  style={{ backgroundColor: colors.primary }}
                  labelStyle={{ 
                    fontSize: isSmallScreen ? 36 : 40, 
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                />
              )}
              
              {/* Camera overlay */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: isSmallScreen ? 32 : 36,
                  height: isSmallScreen ? 32 : 36,
                  borderRadius: isSmallScreen ? 16 : 18,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: colors.surface,
                }}
              >
                {isUploading ? (
                  <MaterialCommunityIcons 
                    name="loading" 
                    size={isSmallScreen ? 16 : 18} 
                    color="white" 
                  />
                ) : (
                  <MaterialCommunityIcons 
                    name="camera" 
                    size={isSmallScreen ? 16 : 18} 
                    color="white" 
                  />
                )}
              </View>
            </TouchableOpacity>
            
            <Text 
              className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-medium`}
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('tap_to_change_photo')}
            </Text>
          </View>

          {/* Form Sections */}
          <View className={`${isSmallScreen ? 'px-4 pt-6' : 'px-6 pt-8'}`}>
            {/* Personal Information */}
            <Card 
              className="mb-6"
              style={{ backgroundColor: colors.surface, borderRadius: 20 }}
            >
              <View className={`${isSmallScreen ? 'p-4' : 'p-6'}`}>
                <Text 
                  className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold mb-4`}
                  style={{ color: colors.onSurface }}
                >
                  {t('personal_information')}
                </Text>

                <FormField
                  label={t('full_name')}
                  value={formData.fullName}
                  onChangeText={(text) => updateField('fullName', text)}
                  placeholder={t('enter_full_name')}
                  icon="account"
                  required
                />

                <FormField
                  label={t('email_address')}
                  value={formData.email}
                  onChangeText={(text) => updateField('email', text)}
                  placeholder={t('enter_email_address')}
                  icon="email"
                  keyboardType="email-address"
                  required
                />

                <FormField
                  label={t('phone_number')}
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateField('phoneNumber', text)}
                  placeholder={t('enter_phone_number')}
                  icon="phone"
                  keyboardType="phone-pad"
                />
              </View>
            </Card>

            {/* Restaurant Information */}
            <Card 
              className="mb-6"
              style={{ backgroundColor: colors.surface, borderRadius: 20 }}
            >
              <View className={`${isSmallScreen ? 'p-4' : 'p-6'}`}>
                <Text 
                  className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold mb-4`}
                  style={{ color: colors.onSurface }}
                >
                  {t('restaurant_information')}
                </Text>

                <FormField
                  label={t('restaurant_name')}
                  value={formData.restaurantName}
                  onChangeText={(text) => updateField('restaurantName', text)}
                  placeholder={t('enter_restaurant_name')}
                  icon="store"
                  required
                />

                <FormField
                  label={t('address')}
                  value={formData.address}
                  onChangeText={(text) => updateField('address', text)}
                  placeholder={t('enter_restaurant_address')}
                  icon="map-marker"
                />

                <FormField
                  label={t('website')}
                  value={formData.website}
                  onChangeText={(text) => updateField('website', text)}
                  placeholder={t('enter_website_url')}
                  icon="web"
                  keyboardType="url"
                />

                <FormField
                  label={t('cuisine_type')}
                  value={formData.cuisine}
                  onChangeText={(text) => updateField('cuisine', text)}
                  placeholder={t('enter_cuisine_type')}
                  icon="food-fork-drink"
                />

                <FormField
                  label={t('about_restaurant')}
                  value={formData.bio}
                  onChangeText={(text) => updateField('bio', text)}
                  placeholder={t('tell_us_about_restaurant')}
                  icon="text"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </Card>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Fixed Save Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          paddingHorizontal: isSmallScreen ? 16 : 24,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          borderTopWidth: 1,
          borderTopColor: colors.outline,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Button
          mode="contained"
          onPress={handleUpdate}
          disabled={!isFormValid || updateProfileMutation.isPending}
          loading={updateProfileMutation.isPending}
          style={{
            backgroundColor: isFormValid && !updateProfileMutation.isPending ? colors.primary : colors.surfaceVariant,
            borderRadius: 16,
            paddingVertical: isSmallScreen ? 4 : 6,
          }}
          contentStyle={{
            paddingVertical: isSmallScreen ? 8 : 10,
          }}
          labelStyle={{
            fontSize: isSmallScreen ? 16 : 17,
            fontWeight: '600',
            color: isFormValid && !updateProfileMutation.isPending ? 'white' : colors.onSurfaceVariant,
          }}
        >
          {updateProfileMutation.isPending ? t('saving_changes') : t('save_changes')}
        </Button>
      </View>
    </CommonView>
  );
};

export default ProfileEditScreen;