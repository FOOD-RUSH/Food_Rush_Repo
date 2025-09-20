import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import CommonView from '@/src/components/common/CommonView';
import { useRestaurantProfile, useCurrentRestaurant } from '@/src/stores/AuthStore';

interface ProfileEditScreenProps {
  navigation: any;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useRestaurantProfile();
  const currentRestaurant = useCurrentRestaurant();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    restaurantName: currentRestaurant?.name || user?.businessName || '',
    address: '',
    bio: '',
    website: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images || 'images',
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
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Here you would typically call an API to update the profile
      console.log('Saving profile:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonView>
      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Avatar.Text
              size={100}
              label={formData.fullName.split(' ').map(n => n[0]).join('') || 'R'}
              style={{ backgroundColor: colors.primary }}
            />
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: colors.primary,
              borderRadius: 15,
              padding: 6,
            }}>
              <MaterialCommunityIcons name="camera" size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
            {t('tap_to_change_photo')}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={{ gap: 16 }}>
          <TextInput
            label={t('full_name')}
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label={t('email')}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            mode="outlined"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label={t('phone_number')}
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />

          <TextInput
            label={t('restaurant_name')}
            value={formData.restaurantName}
            onChangeText={(value) => handleInputChange('restaurantName', value)}
            mode="outlined"
            left={<TextInput.Icon icon="storefront" />}
          />

          <TextInput
            label={t('address')}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            mode="outlined"
            multiline
            numberOfLines={2}
            left={<TextInput.Icon icon="map-marker" />}
          />

          <TextInput
            label={t('bio')}
            value={formData.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            mode="outlined"
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="text" />}
          />

          <TextInput
            label={t('website')}
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            mode="outlined"
            keyboardType="url"
            left={<TextInput.Icon icon="web" />}
          />
        </View>

        {/* Save Button */}
        <View style={{ marginTop: 32, marginBottom: 16 }}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={{ paddingVertical: 8 }}
          >
            {isLoading ? t('saving') : t('save_changes')}
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ProfileEditScreen;