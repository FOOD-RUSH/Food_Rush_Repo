import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import {
  Button,
  Checkbox,
  HelperText,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/AuthStore';
import { TextButton } from '@/src/components/common/TextButton';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useRegisterRestaurant } from '@/src/hooks/restaurant/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import * as ImagePicker from 'expo-image-picker';
import { Location } from '@/src/location/types';
import { useLocation } from '@/src/location/useLocation';
import LocationService from '@/src/location/LocationService';
import { Heading2, Body, Label } from '@/src/components/common/Typography';
import * as yup from 'yup';

interface Step2FormData {
  restaurantName: string;
  address: string;
  documents?: string;
}

interface Step1Data {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// Validation schema for step 2
const step2Schema = yup.object().shape({
  restaurantName: yup
    .string()
    .required('Restaurant name is required')
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(100, 'Restaurant name must be less than 100 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
});

const RestaurantSignupStep2: React.FC<AuthStackScreenProps<'RestaurantSignupStep2'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();
  const {
    mutate: registerRestaurantMutation,
    isPending,
    error: registerError,
  } = useRegisterRestaurant();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { clearError, setError, error: authError } = useAuthStore();

  // Get step 1 data from route params
  const step1Data: Step1Data = route.params?.step1Data;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animate loading indicator
  useEffect(() => {
    if (isGettingLocation) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotation.start();
      return () => rotation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isGettingLocation, rotateAnim]);

  // Use your existing location service
  const {
    hasPermission,
    requestPermissionWithLocation,
  } = useLocation({ autoRequest: false, requestOnMount: false });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2FormData>({
    resolver: yupResolver(step2Schema) as any,
    mode: 'onChange',
    defaultValues: {
      restaurantName: '',
      address: '',
    },
  });

  // Location handler
  const handleLocationSelected = useCallback((location: Location | null) => {
    console.log('📍 Location Selected:');
    console.log('Latitude:', location?.latitude);
    console.log('Longitude:', location?.longitude);
    console.log('Formatted Address:', location?.formattedAddress);
    setSelectedLocation(location);
  }, []);

  // Get exact GPS location
  const getExactLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      console.log('📍 Getting exact GPS location...');
      
      const servicesEnabled = await LocationService.isLocationEnabled();
      if (!servicesEnabled) {
        Toast.show({
          type: 'error',
          text1: 'Location Services Disabled',
          text2: 'Please enable location services in your device settings',
          position: 'top',
        });
        return;
      }

      if (!hasPermission) {
        const permissionGranted = await requestPermissionWithLocation();
        if (!permissionGranted) {
          Toast.show({
            type: 'error',
            text1: 'Location Permission Required',
            text2: 'Please allow location access to get exact coordinates',
            position: 'top',
          });
          return;
        }
      }

      const locationResult = await LocationService.getCurrentLocation(true);
      
      if (locationResult.success && locationResult.location && !locationResult.location.isFallback) {
        console.log('✅ Exact GPS location obtained:');
        console.log('Latitude:', locationResult.location.latitude);
        console.log('Longitude:', locationResult.location.longitude);
        console.log('Address:', locationResult.location.formattedAddress);
        
        setSelectedLocation(locationResult.location);
        Toast.show({
          type: 'success',
          text1: 'Location Found',
          text2: 'Exact GPS coordinates obtained successfully',
          position: 'top',
        });
      } else {
        console.log('❌ Failed to get exact location, result:', locationResult);
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2: locationResult.error || 'Could not get exact GPS location. Please try again.',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error getting exact location:', error);
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Failed to get GPS location. Please try again.',
        position: 'top',
      });
    } finally {
      setIsGettingLocation(false);
    }
  }, [hasPermission, requestPermissionWithLocation]);

  const openLocationModal = useCallback(() => {
    setShowLocationModal(true);
  }, []);

  const closeLocationModal = useCallback(() => {
    setShowLocationModal(false);
  }, []);

  const handleGetLocationFromModal = useCallback(async () => {
    setShowLocationModal(false);
    await getExactLocation();
  }, [getExactLocation]);

  const onSubmit = useCallback(
    async (data: Step2FormData) => {
      if (!isConnected || !isInternetReachable) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('no_internet_connection'),
          position: 'top',
        });
        return;
      }

      if (!termsAccepted) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('accept_terms'),
          position: 'top',
        });
        return;
      }

      clearError();

      try {
        // Validate that we have exact GPS coordinates
        if (!selectedLocation || selectedLocation.isFallback) {
          Toast.show({
            type: 'error',
            text1: 'Exact Location Required',
            text2: 'Please get your exact GPS location before registering',
            position: 'top',
          });
          return;
        }

        // Combine step 1 and step 2 data - ALL fields from both steps
        const registrationData = {
          fullName: step1Data.fullName.trim(),
          email: step1Data.email.trim(), // From step 1
          phoneNumber: step1Data.phoneNumber.replace('+237', ''), // Just the number without country code
          password: step1Data.password, // From step 1
          name: data.restaurantName.trim(), // Restaurant name from step 2
          address: selectedLocation.formattedAddress, // Use exact GPS location address from step 2
          phone: step1Data.phoneNumber, // Full phone with country code from step 1
          nearLat: selectedLocation.latitude, // Exact GPS latitude from step 2
          nearLng: selectedLocation.longitude, // Exact GPS longitude from step 2
          ...(documentUri && { document: documentUri }), // Optional document from step 2
        };

        console.log('🚀 Sending registration data to backend:');
        console.log('nearLat:', registrationData.nearLat);
        console.log('nearLng:', registrationData.nearLng);
        console.log('address:', registrationData.address);

        registerRestaurantMutation(registrationData, {
          onSuccess: (response) => {
            Toast.show({
              type: 'success',
              text1: 'Registration Successful',
              text2: 'Your restaurant registration has been submitted and is awaiting approval.',
              position: 'top',
            });

            console.log('Registration successful', response);
            navigation.navigate('AwaitingApproval');
          },
          onError: (error: any) => {
            const errorMessage = error?.message || t('failed_to_create_account');
            setError(errorMessage);

            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: errorMessage,
              position: 'top',
            });
          },
        });
      } catch (error: any) {
        const errorMessage = error?.message || t('failed_to_create_account');
        setError(errorMessage);

        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: errorMessage,
          position: 'top',
        });
      }
    },
    [isConnected, isInternetReachable, termsAccepted, registerRestaurantMutation, clearError, setError, t, navigation, documentUri, profileImageUri, selectedLocation, step1Data]
  );

  const toggleTerms = useCallback(() => {
    setTermsAccepted((prev) => !prev);
  }, []);

  const openTerms = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: t('terms_not_implemented'),
      position: 'top',
    });
  }, [t]);

  const openPrivacyPolicy = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: t('privacy_policy_not_implemented'),
      position: 'top',
    });
  }, [t]);

  const pickDocument = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images || 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocumentUri(asset.uri);
        setDocumentName(asset.fileName || 'Document');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Document uploaded successfully',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick document',
        position: 'top',
      });
    }
  }, []);

  const pickProfileImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images || 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setProfileImageUri(asset.uri);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile image updated successfully',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image',
        position: 'top',
      });
    }
  }, []);

  // Redirect if no step 1 data
  if (!step1Data) {
    navigation.navigate('RestaurantSignupStep1');
    return null;
  }

  return (
    <CommonView>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {/* Logo and Title */}
            <View style={styles.logoContainer}>
              <TouchableOpacity onPress={pickProfileImage} style={styles.profileImageContainer}>
                {profileImageUri ? (
                  <Image 
                    source={{ uri: profileImageUri }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="camera" size={40} color={colors.onSurfaceVariant} />
                  </View>
                )}
                <View style={styles.cameraIconOverlay}>
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Heading2 color={colors.onSurface} weight="bold" style={{ marginBottom: 8, fontFamily: 'Urbanist' }}>
                {t('create_account')} - Step 2
              </Heading2>
              <Body color={colors.onSurfaceVariant} style={{ textAlign: 'center', fontFamily: 'Urbanist' }}>
                Restaurant Information
              </Body>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Restaurant Name Input */}
              <Controller
                control={control}
                name="restaurantName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Restaurant Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="default"
                      autoCapitalize="words"
                      left={
                        <TextInput.Icon
                          icon="storefront"
                          color={colors.onSurface}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.restaurantName && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.restaurantName}
                    />
                    {errors.restaurantName && (
                      <HelperText type="error" visible={!!errors.restaurantName}>
                        {errors.restaurantName.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Restaurant Address Button */}
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={[
                    styles.addressButton,
                    selectedLocation && styles.addressButtonSelected,
                  ]}
                  onPress={openLocationModal}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={selectedLocation ? colors.primary : colors.onSurface}
                  />
                  <View style={styles.addressButtonText}>
                    <Label 
                      color={selectedLocation ? colors.primary : colors.onSurface} 
                      weight="medium"
                      style={{ fontFamily: 'Urbanist' }}
                    >
                      Restaurant Address
                    </Label>
                    {selectedLocation ? (
                      <Body 
                        color={colors.onSurface} 
                        style={{ fontFamily: 'Urbanist', marginTop: 4 }}
                        numberOfLines={2}
                      >
                        {selectedLocation.formattedAddress}
                      </Body>
                    ) : (
                      <Body 
                        color={colors.onSurfaceVariant} 
                        style={{ fontFamily: 'Urbanist', marginTop: 4 }}
                      >
                        Tap to set restaurant location
                      </Body>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              </View>

              {/* Document Upload */}
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.documentUploadButton}
                  onPress={pickDocument}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="document-attach"
                    size={24}
                    color={colors.primary}
                  />
                  <Body color={colors.onSurface} style={{ marginLeft: 12 }}>
                    {documentName || 'Upload Document (Optional)'}
                  </Body>
                </TouchableOpacity>
              </View>

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <View style={styles.termsRow}>
                  <Checkbox
                    status={termsAccepted ? 'checked' : 'unchecked'}
                    onPress={toggleTerms}
                    uncheckedColor={colors.onSurface}
                    color={colors.primary}
                  />
                  <View style={styles.termsTextContainer}>
                    <Body color={colors.onSurface}>
                      {t('terms_agreement')}{' '}
                    </Body>
                    <TextButton
                      onPress={openTerms}
                      text={t('terms_of_service')}
                    />
                    <Body color={colors.onSurface}> {t('and')} </Body>
                    <TextButton
                      onPress={openPrivacyPolicy}
                      text={t('privacy_policy')}
                    />
                  </View>
                </View>
              </View>

              {/* Error Display */}
              <ErrorDisplay
                error={registerError?.message || authError}
                visible={!!(registerError?.message || authError)}
              />

              {/* Complete Registration Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                disabled={isPending || !termsAccepted || !isValid || !selectedLocation || (selectedLocation && selectedLocation.isFallback)}
                buttonColor={colors.primary}
                contentStyle={styles.buttonContent}
                style={styles.signUpButton}
                labelStyle={styles.signUpButtonLabel}
              >
                {isPending ? t('creating_account') : 'Complete Registration'}
              </Button>
            </View>
          </ScrollView>

          {/* Location Instructions Modal */}
          <Modal
            visible={showLocationModal}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={closeLocationModal}
          >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Heading2 color={colors.onSurface} weight="bold" style={{ fontFamily: 'Urbanist' }}>
                    Restaurant Location
                  </Heading2>
                  <TouchableOpacity onPress={closeLocationModal}>
                    <Ionicons name="close" size={24} color={colors.onSurface} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                  <View style={styles.instructionCard}>
                    <Ionicons name="location" size={48} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
                    
                    <Heading2 color={colors.onSurface} weight="bold" style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'Urbanist' }}>
                      Important Instructions
                    </Heading2>
                    
                    <View style={styles.instructionItem}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      <Body color={colors.onSurface} style={{ flex: 1, marginLeft: 12, fontFamily: 'Urbanist' }}>
                        You must be physically present at your restaurant location
                      </Body>
                    </View>
                    
                    <View style={styles.instructionItem}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      <Body color={colors.onSurface} style={{ flex: 1, marginLeft: 12, fontFamily: 'Urbanist' }}>
                        Make sure your GPS and location services are enabled
                      </Body>
                    </View>
                    
                    <View style={styles.instructionItem}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      <Body color={colors.onSurface} style={{ flex: 1, marginLeft: 12, fontFamily: 'Urbanist' }}>
                        This will be your official restaurant address for deliveries
                      </Body>
                    </View>
                    
                    <View style={styles.warningCard}>
                      <Ionicons name="warning" size={24} color={colors.error} />
                      <Body color={colors.error} style={{ flex: 1, marginLeft: 12, fontFamily: 'Urbanist' }}>
                        Please ensure you are at the correct location before proceeding
                      </Body>
                    </View>
                  </View>
                </ScrollView>
                
                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    onPress={closeLocationModal}
                    style={styles.cancelButton}
                    labelStyle={{ color: '#EF4444', fontFamily: 'Urbanist', fontWeight: '600' }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    mode="contained"
                    onPress={handleGetLocationFromModal}
                    loading={isGettingLocation}
                    disabled={isGettingLocation}
                    buttonColor={colors.primary}
                    style={styles.getLocationButton}
                    labelStyle={{ color: '#fff', fontFamily: 'Urbanist', fontWeight: '600' }}
                  >
                    {isGettingLocation ? 'Getting Location...' : 'Get My Location'}
                  </Button>
                </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ScrollView>
    </CommonView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    logoContainer: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 24,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    profileImagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#e0e0e0',
      borderStyle: 'dashed',
    },
    cameraIconOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#007aff',
      borderRadius: 16,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
    },
    formContainer: {
      paddingHorizontal: 8,
    },
    inputContainer: {
      marginBottom: 20,
    },
    textInput: {
      backgroundColor: colors.surfaceVariant,
      height: 64,
      fontFamily: 'Urbanist',
    },
    inputOutline: {
      borderRadius: 12,
      borderColor: colors.surfaceVariant,
    },
    inputError: {
      borderColor: '#EF4444',
    },
    inputContent: {
      paddingHorizontal: 16,
      fontFamily: 'Urbanist',
      fontSize: 16,
    },
    documentUploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.surfaceVariant,
    },
    termsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      marginBottom: 16,
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    termsTextContainer: {
      flex: 1,
      marginLeft: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    signUpButton: {
      borderRadius: 25,
      marginTop: 8,
    },
    buttonContent: {
      paddingVertical: 12,
    },
    signUpButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    addressButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.outline,
      padding: 16,
      minHeight: 72,
    },
    addressButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    addressButtonText: {
      flex: 1,
      marginLeft: 12,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
      backgroundColor: colors.surface,
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    instructionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    instructionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    warningCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.errorContainer || colors.error + '20',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      padding: 20,
      paddingTop: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.outline,
    },
    cancelButton: {
      flex: 1,
      borderRadius: 12,
      borderColor: '#EF4444',
      borderWidth: 2,
      height: 48,
    },
    getLocationButton: {
      flex: 1,
      borderRadius: 12,
      height: 48,
    },
  });

export default RestaurantSignupStep2;