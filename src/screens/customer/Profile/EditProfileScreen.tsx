import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '@/assets/images';

import * as ImagePicker from 'expo-image-picker';
import InputField from '@/src/components/customer/InputField';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Button, useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { useCustomerProfile } from '@/src/stores/AuthStore';
import { useUpdateProfile } from '@/src/hooks/shared/useProfileUpdate';
import { usePickAndUploadProfileImage } from '@/src/hooks/shared/useImageUpload';

const EditProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EditProfile'>) => {
  const { t } = useTranslation('translation');
  const LoggedInUser = useCustomerProfile();

  const [fullName, setFullName] = useState(LoggedInUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(
    LoggedInUser?.phoneNumber || '',
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    LoggedInUser?.profilePicture || null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { colors } = useTheme();

  const updateProfileMutation = useUpdateProfile();
  const pickAndUploadImageMutation = usePickAndUploadProfileImage();

  const handleImagePicker = async () => {
    try {
      setIsUploadingImage(true);

      // Pick image using the hook
      const imageData = await pickAndUploadImageMutation.mutateAsync();

      // Set the local image URI for preview
      setProfileImage(imageData.uri);

      Alert.alert(
        t('success') || 'Success',
        t('image_selected_successfully') ||
          'Image selected successfully. Save to update your profile.',
      );
    } catch (error: any) {
      console.error('Error picking image:', error);

      // Handle specific error cases
      if (error.message === 'No image selected') {
        // User cancelled, no need to show error
        return;
      }

      const errorMessage =
        error?.message || t('failed_to_pick_image') || 'Failed to pick image';

      Alert.alert(t('error') || 'Error', errorMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate required fields
      if (!fullName.trim()) {
        Alert.alert(t('error') || 'Error', 'Full name is required');
        return;
      }

      if (!phoneNumber.trim()) {
        Alert.alert(t('error') || 'Error', 'Phone number is required');
        return;
      }

      // Prepare update data according to PATCH /api/v1/auth/profile specification
      const updateData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        // Only include profilePicture if it exists and is a valid URL
        ...(profileImage && { profilePicture: profileImage }),
      };

      await updateProfileMutation.mutateAsync(updateData);

      Alert.alert(
        t('success') || 'Success',
        t('profile_updated_successfully') || 'Profile updated successfully',
      );
      navigation.goBack();
    } catch (error: any) {
      console.error('❌ Profile update failed:', error);

      // Show more specific error messages
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
        className="h-full pb-14  mt-[-39px] pt-4 pb-15"
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-column px-2 justify-center items-center">
          <TouchableOpacity
            className="relative mb-3"
            onPress={handleImagePicker}
            disabled={isUploadingImage}
          >
            <Image
              className="h-[100px] w-[100px] object-cover relative rounded-full"
              source={profileImage ? { uri: profileImage } : icons.ProfilePlogo}
            />
            <View
              className="absolute bottom-1 right-2 bg-blue-500 rounded-full p-1"
              style={{ backgroundColor: '#007aff' }}
            >
              <MaterialIcon
                name={isUploadingImage ? 'hourglass-empty' : 'edit'}
                color="white"
                size={16}
              />
            </View>
          </TouchableOpacity>
          <Text
            className="text-sm text-gray-600 mb-4"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('tap_to_change_photo') || 'Tap to change photo'}
          </Text>
        </View>
        <InputField
          placeholder={t('enter_name')}
          value={fullName}
          onChangeText={setFullName}
          leftIcon={
            <IoniconsIcon
              size={23}
              name="person-outline"
              color={colors.onSurface}
            />
          }
        />
        <InputField
          leftIcon={
            <View className="flex-row items-center">
              <Text className="text-2xl">🇨🇲</Text>
              <MaterialIcon
                name="keyboard-arrow-down"
                size={25}
                color={colors.onSurface}
              />
            </View>
          }
          placeholder={t('phone_number')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Button
          mode="contained"
          buttonColor={'#007Aff'}
          textColor="white"
          contentStyle={{ paddingVertical: 12 }}
          style={{ borderRadius: 25, marginTop: 16 }}
          labelStyle={{
            fontSize: 16,
            fontWeight: '600',
            color: 'white',
            marginVertical: 8,
          }}
          className="active:opacity-75 mb-2"
          onPress={handleUpdate}
          loading={updateProfileMutation.status === 'pending'}
          disabled={
            updateProfileMutation.isPending ||
            isUploadingImage ||
            pickAndUploadImageMutation.isPending
          }
        >
          {t('update')}
        </Button>
      </ScrollView>
    </CommonView>
  );
};

export default EditProfileScreen;
