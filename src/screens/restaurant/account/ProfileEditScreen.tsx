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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      setIsUploadingImage(true);

      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('permission_required') || 'Permission Required',
          t('camera_permission_message') ||
            'We need camera roll permissions to update your profile picture.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        t('error') || 'Error',
        t('failed_to_pick_image') || 'Failed to pick image',
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      // Use the unified profile update with only the specified fields
      const updateData: any = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };

      // Only include profilePicture if it exists
      if (profileImage) {
        updateData.profilePicture = profileImage;
      }

      await updateProfileMutation.mutateAsync(updateData);

      Alert.alert(
        t('success') || 'Success',
        t('profile_updated_successfully') || 'Profile updated successfully',
        [{ text: t('ok') || 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      console.error('Error saving profile:', error);

      // Show more specific error messages
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
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
            disabled={updateProfileMutation.isPending || isUploadingImage}
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
