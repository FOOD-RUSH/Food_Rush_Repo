import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { TextInput, Button, Avatar, useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import CommonView from '@/src/components/common/CommonView';
import {
  useRestaurantProfile,
  useCurrentRestaurant,
} from '@/src/stores/AuthStore';
import { useUpdateProfile } from '@/src/hooks/shared/useProfileUpdate';
import { usePickAndUploadProfileImage } from '@/src/hooks/shared/useImageUpload';

interface ProfileEditScreenProps {
  navigation: any;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useRestaurantProfile();
  const currentRestaurant = useCurrentRestaurant();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePicture || null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const updateProfileMutation = useUpdateProfile();
  const pickAndUploadImageMutation = usePickAndUploadProfileImage();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      setIsUploadingImage(true);
      // Step 1: Pick image from device
      const imageData = await pickAndUploadImageMutation.mutateAsync();
      // Step 2: Upload to backend to get public pictureUrl
      const pictureUrl = await (await import('@/src/hooks/shared/useImageUpload')).useProfileImageUpload().mutationFn?.(imageData as any as never);
      // Fallback: if hook approach above isn't viable in this scope, upload directly via uploadApi
      let finalUrl = pictureUrl;
      if (!finalUrl) {
        const { uploadApi } = await import('@/src/services/shared/uploadApi');
        finalUrl = await uploadApi.uploadImage({ uri: imageData.uri, name: imageData.name, type: imageData.type });
      }
      // Set for preview and for save
      setProfileImage(finalUrl);
      Alert.alert(
        t('success') || 'Success',
        t('image_selected_successfully') || 'Image selected successfully. Save to update your profile.',
      );
    } catch (error: any) {
      console.error('Error picking/uploading image:', error);
      if (error.message === 'No image selected') {
        return;
      }
      const errorMessage = error?.message || t('failed_to_pick_image') || 'Failed to pick image';
      Alert.alert(t('error') || 'Error', errorMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.fullName.trim()) {
        Alert.alert(
          t('error') || 'Error',
          'Full name is required'
        );
        return;
      }

      if (!formData.phoneNumber.trim()) {
        Alert.alert(
          t('error') || 'Error',
          'Phone number is required'
        );
        return;
      }

      // Prepare update data according to PATCH /api/v1/auth/profile specification
      const updateData = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        ...(profileImage && { profilePicture: profileImage }),
      };



      await updateProfileMutation.mutateAsync(updateData);
      
      Alert.alert(
        t('success') || 'Success', 
        t('profile_updated_successfully') || 'Profile updated successfully'
      );
      navigation.goBack();
    } catch (error: any) {
      console.error('❌ Restaurant profile update failed:', error);

      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        t('failed_to_update_profile') ||
        'Failed to update profile';

      Alert.alert(t('error') || 'Error', errorMessage);
    }
  };

  return (
    <CommonView>
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={handleImagePicker}
            disabled={isUploadingImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.surfaceVariant,
                }}
              />
            ) : (
              <Avatar.Text
                size={100}
                label={
                  formData.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('') || 'R'
                }
                style={{ backgroundColor: colors.primary }}
              />
            )}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: colors.primary,
                borderRadius: 15,
                padding: 6,
              }}
            >
              <MaterialCommunityIcon
                name={isUploadingImage ? 'loading' : 'camera'}
                size={18}
                color="white"
              />
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
            {t('tap_to_change_photo') || 'Tap to change photo'}
          </Text>
        </View>

        {/* Form Fields - Only the fields from the request body */}
        <View style={{ gap: 16 }}>
          <TextInput
            label={t('full_name') || 'Full Name'}
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            style={{ backgroundColor: colors.surface }}
          />

          <TextInput
            label={t('phone_number') || 'Phone Number'}
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            mode="outlined"
            keyboardType="phone-pad"
            placeholder="+237612345678"
            left={<TextInput.Icon icon="phone" />}
            style={{ backgroundColor: colors.surface }}
          />
        </View>

        {/* Save Button */}
        <View style={{ marginTop: 32, marginBottom: 16 }}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={updateProfileMutation.isPending}
            disabled={updateProfileMutation.isPending || isUploadingImage || pickAndUploadImageMutation.isPending}
            style={{ paddingVertical: 8 }}
          >
            {updateProfileMutation.isPending
              ? t('saving') || 'Saving...'
              : t('save_changes') || 'Save Changes'}
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ProfileEditScreen;
