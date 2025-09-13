import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import InputField from '@/src/components/customer/InputField';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { useUpdateProfile } from '@/src/hooks/customer/useAuthhooks';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';
import CommonView from '@/src/components/common/CommonView';

const ProfileEditScreen = ({
  navigation,
}: RootStackScreenProps<'RestaurantEditProfile'>) => {
  const { t } = useTranslation('translation');
  const LoggedInUser = useAuthUser();

  const [fullName, setFullName] = useState(LoggedInUser?.fullName || '');
  const [email, setEmail] = useState(LoggedInUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(LoggedInUser?.phoneNumber || '');
  const [restaurantName, setRestaurantName] = useState(LoggedInUser?.restaurantName || '');
  const [address, setAddress] = useState(LoggedInUser?.address || '');
  const [website, setWebsite] = useState(LoggedInUser?.website || '');
  const [cuisine, setCuisine] = useState(LoggedInUser?.cuisine || '');
  const [bio, setBio] = useState(LoggedInUser?.bio || '');
  const [profileImage, setProfileImage] = useState<string | null>(LoggedInUser?.profilePicture || null);

  const updateProfileMutation = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName, email, phoneNumber, restaurantName, address, website, cuisine, bio, profilePicture: profileImage,
      });

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect for profile pictures
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageId = generateImageId();
        const localUri = await saveImageLocally(result.assets[0].uri, imageId);
        setProfileImage(localUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };


  return (
    <CommonView 
      
    >
      
      
      

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture */}
        <View style={{
          alignItems: 'center',
          paddingVertical: 20,
          backgroundColor: '#FAFBFC',
        }}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: profileImage ? 'transparent' : '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#007AFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ color: 'white', fontSize: 32, fontWeight: '600' }}>
                {fullName.charAt(0).toUpperCase() || 'U'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 12 }} onPress={handleImagePick}>
            <Text style={{ color: '#007AFF', fontSize: 14, fontWeight: '500' }}>
              {profileImage ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Container */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 30,
          marginTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}>
          {/* Personal Information Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: 20,
            }}>
              Personal Information
            </Text>

            <InputField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              leftIcon={<Ionicons name="person-outline" size={18} color="#6B7280" />}
            />

            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              leftIcon={<Ionicons name="mail-outline" size={18} color="#6B7280" />}
              />

            <InputField
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              leftIcon={<Ionicons name="call-outline" size={18} color="#6B7280" />}
            />
          </View>

          {/* Restaurant Information Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: 20,
            }}>
              Restaurant Information
            </Text>

            <InputField
              label="Restaurant Name"
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder="Enter restaurant name"
              leftIcon={<MaterialCommunityIcons name="store-outline" size={18} color="#6B7280" />}
            />

            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter restaurant address"
              leftIcon={<Ionicons name="location-outline" size={18} color="#6B7280" />}
            />

            <InputField
              label="Website"
              value={website}
              onChangeText={setWebsite}
              placeholder="Enter website URL"
              keyboardType="url"
              leftIcon={<Ionicons name="globe-outline" size={18} color="#6B7280" />}
            />

            <InputField
              label="Cuisine Type"
              value={cuisine}
              onChangeText={setCuisine}
              placeholder="Enter cuisine type"
              leftIcon={<MaterialCommunityIcons name="food-fork-drink" size={18} color="#6B7280" />}
            />

            <InputField
              label="About Restaurant"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about your restaurant..."
              multiline
              leftIcon={<MaterialCommunityIcons name="text" size={18} color="#6B7280" />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 45 : 40,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }}>
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={updateProfileMutation.status === 'pending'}
          style={{
            backgroundColor: updateProfileMutation.status === 'pending' ? '#9CA3AF' : '#044993ff',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: updateProfileMutation.status === 'pending' ? 0 : 0.3,
            shadowRadius: 8,
            elevation: updateProfileMutation.status === 'pending' ? 0 : 5,
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
          }}>
            {updateProfileMutation.status === 'pending' ? 'Saving Changes...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </CommonView>
  );
};

export default ProfileEditScreen;