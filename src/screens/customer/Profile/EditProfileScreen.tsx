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

      // Launch image picker
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

  const handleUpdate = async () => {
    try {
      // Use the unified profile update with only the specified fields
      const updateData: any = {
        fullName,
        phoneNumber,
      };

      // Only include profilePicture if it exists
      if (profileImage) {
        updateData.profilePicture = profileImage;
      }

      await updateProfileMutation.mutateAsync(updateData);
      Alert.alert(t('success'), t('profile_updated_successfully'));
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to update profile:', error);

      // Show more specific error messages
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t('failed_to_update_profile' as any);

      Alert.alert(t('error'), errorMessage);
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
          disabled={updateProfileMutation.isPending || isUploadingImage}
        >
          {t('update')}
        </Button>
      </ScrollView>
    </CommonView>
  );
};

export default EditProfileScreen;
