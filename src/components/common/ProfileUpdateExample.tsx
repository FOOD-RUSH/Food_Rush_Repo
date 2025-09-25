import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useUpdateProfile } from '@/src/hooks/shared/useProfileUpdate';
import { useUser } from '@/src/stores/AuthStore';

/**
 * Example component demonstrating how to use the unified profile update
 * Works for both customer and restaurant users
 */
export const ProfileUpdateExample: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useUser();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    profilePicture: user?.profilePicture || '',
  });

  const handleUpdate = async () => {
    try {
      // Example request body matching the specified format:
      // {
      //   "fullName": "John Doe",
      //   "phoneNumber": "+237612345678",
      //   "profilePicture": "https://example.com/profile.jpg"
      // }

      await updateProfileMutation.mutateAsync({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        profilePicture: formData.profilePicture || undefined,
      });

      Alert.alert(
        t('success') || 'Success',
        t('profile_updated_successfully') || 'Profile updated successfully',
      );
    } catch (error: any) {
      console.error('Profile update failed:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update profile';

      Alert.alert(t('error') || 'Error', errorMessage);
    }
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <TextInput
        label={t('full_name') || 'Full Name'}
        value={formData.fullName}
        onChangeText={(value) =>
          setFormData((prev) => ({ ...prev, fullName: value }))
        }
        mode="outlined"
        style={{ backgroundColor: colors.surface }}
      />

      <TextInput
        label={t('phone_number') || 'Phone Number'}
        value={formData.phoneNumber}
        onChangeText={(value) =>
          setFormData((prev) => ({ ...prev, phoneNumber: value }))
        }
        mode="outlined"
        keyboardType="phone-pad"
        placeholder="+237612345678"
        style={{ backgroundColor: colors.surface }}
      />

      <TextInput
        label={t('profile_picture_url') || 'Profile Picture URL'}
        value={formData.profilePicture}
        onChangeText={(value) =>
          setFormData((prev) => ({ ...prev, profilePicture: value }))
        }
        mode="outlined"
        placeholder="https://example.com/profile.jpg"
        style={{ backgroundColor: colors.surface }}
      />

      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={updateProfileMutation.isPending}
        disabled={updateProfileMutation.isPending}
        style={{ paddingVertical: 8 }}
      >
        {updateProfileMutation.isPending
          ? t('updating') || 'Updating...'
          : t('update_profile') || 'Update Profile'}
      </Button>
    </View>
  );
};

export default ProfileUpdateExample;
