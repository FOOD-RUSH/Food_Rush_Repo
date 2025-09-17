import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
<<<<<<< HEAD
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
=======
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
>>>>>>> origin/Customer_Setup

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useUser } from '@/src/stores/customerStores/AuthStore';
import { useUpdateRestaurantProfile } from '@/src/hooks/restaurant/useAuthhooks';
import { saveImageLocally, generateImageId } from '@/src/utils/imageStorage';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

<<<<<<< HEAD
interface FormFieldProps {
=======
const AnimatedBgShape: React.FC<AnimatedBgShapeProps> = ({
  style,
  delay,
  color1,
  color2,
  size,
  top,
  left,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + delay,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4000 + delay,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.25,
          transform: [{ translateY }, { scale: scaleAnim }],
          zIndex: 0,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[color1, color2]}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
        }}
        start={[0, 0]}
        end={[1, 1]}
      />
    </Animated.View>
  );
};

interface FloatingInputProps {
>>>>>>> origin/Customer_Setup
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
<<<<<<< HEAD
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
=======
    <Animated.View
      style={[
        styles.floatingInputContainer,
        isFocused && styles.focusedInput,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View style={styles.inputRow}>
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? '#764ba2' : '#aaa'}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.floatingInput,
            multiline && styles.multilineInput,
            { height: multiline ? numberOfLines * 20 + 28 : 48 },
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? '' : placeholder}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
>>>>>>> origin/Customer_Setup
      </View>
    </View>
  );
};

<<<<<<< HEAD
const ProfileEditScreen: React.FC<RootStackScreenProps<'RestaurantEditProfile'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const loggedInUser = useUser();
  
  // Animation values
=======
type ProfileEditScreenProps =
  RestaurantProfileStackScreenProps<'ProfileEditProfile'>;

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  navigation,
  route,
}) => {
  // Get initial values from route params or use defaults
  const initialProfile = route.params?.userProfile || {
    name: 'Restaurant Owner',
    email: 'owner@restaurant.com',
    phone: '+1 234 567 8900',
    restaurantName: 'The Great Eatery',
    address: '123 Food Street, City',
    bio: '',
    website: '',
    cuisine: 'Italian, American',
  };

  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animation refs
>>>>>>> origin/Customer_Setup
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

<<<<<<< HEAD
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
=======
  const updateField = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
>>>>>>> origin/Customer_Setup
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

<<<<<<< HEAD
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
=======
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showSuccessAnimation();
    }, 2000);
  };

  const showSuccessAnimation = () => {
    setShowSuccessModal(true);
    Animated.spring(successModalAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(successModalAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        });
      }, 1500);
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated background shapes */}
      <AnimatedBgShape
        color1="#43e97b"
        color2="#38f9d7"
        size={200}
        top={-80}
        left={-60}
        delay={0}
      />
      <AnimatedBgShape
        color1="#667eea"
        color2="#764ba2"
        size={150}
        top={100}
        left={width - 120}
        delay={1000}
      />
      <AnimatedBgShape
        color1="#fa709a"
        color2="#fee140"
        size={120}
        top={height - 250}
        left={-40}
        delay={2000}
      />
      <AnimatedBgShape
        color1="#43cea2"
        color2="#185a9d"
        size={100}
        top={height - 180}
        left={width - 80}
        delay={3000}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
>>>>>>> origin/Customer_Setup
        >
          {/* Profile Picture Section */}
          <View 
            className={`items-center ${isSmallScreen ? 'py-6' : 'py-8'}`}
            style={{ backgroundColor: colors.surface }}
          >
<<<<<<< HEAD
            <TouchableOpacity
              onPress={handleImagePick}
              disabled={isUploading}
              activeOpacity={0.8}
              style={{
                position: 'relative',
                marginBottom: 16,
              }}
=======
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleCancel}
              >
                <Ionicons name="arrow-back" size={24} color="#764ba2" />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Profile</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePictureContainer}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.profilePicture}
                >
                  <Text style={styles.profileInitials}>
                    {profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </Text>
                </LinearGradient>
                <TouchableOpacity style={styles.editPictureButton}>
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePictureText}>
                Tap to change picture
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <FloatingInput
                label="Full Name"
                value={profile.name}
                onChangeText={(text) => updateField('name', text)}
                icon="person"
                placeholder="Enter your full name"
              />

              <FloatingInput
                label="Email Address"
                value={profile.email}
                onChangeText={(text) => updateField('email', text)}
                icon="mail"
                placeholder="Enter your email"
                keyboardType="email-address"
              />

              <FloatingInput
                label="Phone Number"
                value={profile.phone}
                onChangeText={(text) => updateField('phone', text)}
                icon="call"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <FloatingInput
                label="Restaurant Name"
                value={profile.restaurantName}
                onChangeText={(text) => updateField('restaurantName', text)}
                icon="restaurant"
                placeholder="Enter restaurant name"
              />

              <FloatingInput
                label="Address"
                value={profile.address}
                onChangeText={(text) => updateField('address', text)}
                icon="location"
                placeholder="Enter restaurant address"
                multiline
                numberOfLines={2}
              />

              <FloatingInput
                label="Website"
                value={profile.website ?? ''}
                onChangeText={(text) => updateField('website', text)}
                icon="globe"
                placeholder="Enter website URL"
                keyboardType="url"
              />

              <FloatingInput
                label="Cuisine Type"
                value={profile.cuisine ?? ''}
                onChangeText={(text) => updateField('cuisine', text)}
                icon="restaurant"
                placeholder="e.g., Italian, American, Asian"
              />

              <FloatingInput
                label="Bio"
                value={profile.bio ?? ''}
                onChangeText={(text) => updateField('bio', text)}
                icon="document-text"
                placeholder="Tell us about your restaurant..."
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.saveButtonGradient}
                  start={[0, 0]}
                  end={[1, 1]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successModal,
              {
                transform: [
                  { scale: successModalAnim },
                  {
                    translateY: successModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
                opacity: successModalAnim,
              },
            ]}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.successIconContainer}
>>>>>>> origin/Customer_Setup
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
<<<<<<< HEAD
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

=======
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  placeholder: {
    width: 44,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  editPictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#764ba2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  changePictureText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  floatingInputContainer: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  focusedInput: {
    borderColor: '#764ba2',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  floatingInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 14,
  },
  multilineInput: {
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

>>>>>>> origin/Customer_Setup
export default ProfileEditScreen;