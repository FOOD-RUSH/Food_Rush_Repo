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
import { restaurantRegisterSchema } from '@/src/utils/validation';
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
// Removed LocationPicker import - using custom GPS location button instead
import { Location } from '@/src/location/types';
import { useLocation } from '@/src/location/useLocation';
import LocationService from '@/src/location/LocationService';
import { Heading2, Body, Label } from '@/src/components/common/Typography';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';

// Only Cameroon country code
const COUNTRY_CODES = [
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
] as const;

interface RestaurantSignUpFormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  name: string; // Restaurant name
  address: string; // Restaurant address
 
}

type CountryCode = (typeof COUNTRY_CODES)[number];

const RestaurantSignupScreen: React.FC<AuthStackScreenProps<'SignUp'>> = ({
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

  // get usertype gotten from params
  const userType = route.params?.userType || 'restaurant';

  // Removed CountryItem component - only Cameroon supported

  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(
    COUNTRY_CODES[0],
  );
  // Removed showCountryModal state - only Cameroon supported
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
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

  // Location handler with console logging
  const handleLocationSelected = useCallback((location: Location | null) => {
    console.log('📍 Location Selected:');
    console.log('Latitude:', location?.latitude);
    console.log('Longitude:', location?.longitude);
    console.log('Formatted Address:', location?.formattedAddress);
    console.log('Full Location Object:', location);
    setSelectedLocation(location);
  }, []);

  // Get exact GPS location using your service
  const getExactLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      console.log('📍 Getting exact GPS location...');
      
      // First check if location services are enabled
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

      // Request permission if not granted
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

      // Get current location with force refresh to avoid fallbacks
      const locationResult = await LocationService.getCurrentLocation(true);
      
      if (locationResult.success && locationResult.location && !locationResult.location.isFallback) {
        console.log('✅ Exact GPS location obtained:');
        console.log('Latitude:', locationResult.location.latitude);
        console.log('Longitude:', locationResult.location.longitude);
        console.log('Address:', locationResult.location.formattedAddress);
        console.log('Is Fallback:', locationResult.location.isFallback);
        
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

  // Modal functions
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

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RestaurantSignUpFormData>({
    resolver: yupResolver(restaurantRegisterSchema) as any,
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      fullName: '',
      name: '',
      address: '',
    },
  });

  // Removed watchedAddress - using GPS location instead of manual address validation

  // Optimized callbacks with useCallback to prevent unnecessary re-renders
  const onSubmit = useCallback(
    async (data: RestaurantSignUpFormData) => {
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
        // Validate that we have exact GPS coordinates (not fallback)
        if (!selectedLocation || selectedLocation.isFallback) {
          Toast.show({
            type: 'error',
            text1: 'Exact Location Required',
            text2: 'Please get your exact GPS location before registering',
            position: 'top',
          });
          return;
        }

        // Prepare registration data to match backend requirements
        const registrationData = {
          fullName: data.fullName.trim(),
          email: data.email.trim(),
          phoneNumber: data.phoneNumber.trim(), // Just the number without country code
          password: data.password,
          name: data.name.trim(), // Restaurant name
          address: selectedLocation.formattedAddress, // Use exact GPS location address
          phone: `${selectedCountryCode.code}${data.phoneNumber.trim()}`, // Full phone with country code
          nearLat: selectedLocation.latitude, // Exact GPS latitude
          nearLng: selectedLocation.longitude, // Exact GPS longitude
          ...(documentUri && { document: documentUri }), // Optional document
        };

        // Console log the exact coordinates being sent to backend
        console.log('🚀 Sending EXACT GPS coordinates to backend:');
        console.log('nearLat:', registrationData.nearLat);
        console.log('nearLng:', registrationData.nearLng);
        console.log('address:', registrationData.address);
        console.log('isFallback:', selectedLocation.isFallback);
        console.log('timestamp:', selectedLocation.timestamp);

        registerRestaurantMutation(registrationData, {
            onSuccess: (response) => {
              // Show awaiting approval message
              Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Your restaurant registration has been submitted and is awaiting approval. You will be notified once approved.',
                position: 'top',

              });

              console.log('Registraction sucessful', response)
              // Navigate to awaiting approval screen instead of RestaurantApp
              navigation.navigate('AwaitingApproval', {
                // Pass any necessary params if needed
              });
            },
          onError: (error: any) => {
            const errorMessage =
              error?.message || t('failed_to_create_account');
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
    [isConnected, isInternetReachable, termsAccepted, registerRestaurantMutation, clearError, setError, t, selectedCountryCode, navigation, documentUri, selectedLocation],
  );

  const handleGoogleSignUp = useCallback(async () => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('no_internet_connection'),
        position: 'top',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: t('google_signup_not_implemented'),
      position: 'top',
    });
  }, [isConnected, isInternetReachable, t]);

  const handleAppleSignUp = useCallback(async () => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('no_internet_connection'),
        position: 'top',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: t('apple_signup_not_implemented'),
      position: 'top',
    });
  }, [isConnected, isInternetReachable, t]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

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

  // Removed phone number placeholder, keyExtractor, and renderCountryItem - only Cameroon supported

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
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
              <Heading2 color={colors.onSurface} weight="bold" style={{ marginBottom: 8, fontFamily: 'Urbanist' }}>{t('create_account')}</Heading2>
              <Body color={colors.onSurfaceVariant} style={{ textAlign: 'center', fontFamily: 'Urbanist' }}>Join our platform and start serving delicious meals</Body>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Phone Number with Cameroon Prefix */}
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="690 000 000"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      left={
                        <TextInput.Icon 
                          icon={() => (
                            <View style={styles.cameroonPrefix}>
                              <Text style={{ marginRight: 4, fontSize: 16 }}>🇨🇲</Text>
                              <Text style={{ fontFamily: 'Urbanist', fontWeight: '500', color: colors.onSurface }}>+237</Text>
                            </View>
                          )}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.phoneNumber && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <HelperText type="error" visible={!!errors.phoneNumber}>
                        {errors.phoneNumber.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('email')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      left={
                        <TextInput.Icon icon="email" color={colors.onSurface} />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.email && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <HelperText type="error" visible={!!errors.email}>
                        {errors.email.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Full Name Input */}
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('full_name')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="default"
                      autoCapitalize="words"
                      autoComplete="name"
                      left={
                        <TextInput.Icon
                          icon="account"
                          color={colors.onSurface}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.fullName && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.fullName}
                    />
                    {errors.fullName && (
                      <HelperText type="error" visible={!!errors.fullName}>
                        {errors.fullName.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Restaurant Name Input */}
              <Controller
                control={control}
                name="name"
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
                        errors.name && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.name}
                    />
                    {errors.name && (
                      <HelperText type="error" visible={!!errors.name}>
                        {errors.name.message}
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

              {/* Manual address removed - using GPS location only */}

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

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('password')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      left={
                        <TextInput.Icon icon="lock" color={colors.onSurface} />
                      }
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={togglePassword}
                          color={colors.onSurface}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.password && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.password}
                    />
                    {errors.password && (
                      <HelperText type="error" visible={!!errors.password}>
                        {errors.password.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Confirm Password Input */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('confirm_password')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      left={
                        <TextInput.Icon icon="lock" color={colors.onSurface} />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <HelperText
                        type="error"
                        visible={!!errors.confirmPassword}
                      >
                        {errors.confirmPassword.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

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

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSubmit((data: RestaurantSignUpFormData) => onSubmit(data))}
                loading={isPending}
                disabled={isPending || !termsAccepted || !isValid || !selectedLocation || (selectedLocation && selectedLocation.isFallback)}
                buttonColor={colors.primary}
                contentStyle={styles.buttonContent}
                style={styles.signUpButton}
                labelStyle={styles.signUpButtonLabel}
              >
                {isPending ? t('creating_account') : t('signup')}
              </Button>

              {/* Social login removed for simplicity */}

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Body color={colors.onSurface}>
                  {t('already_have_account')}{' '}
                </Body>
                <TextButton
                  onPress={() => navigation.navigate('SignIn', { userType })}
                  text={t('login')}
                />
              </View>
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

// Optimized styles using StyleSheet.create for better performance
const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
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
    restaurantImage: {
      width: 120,
      height: 120,
      borderRadius: 20,
      marginBottom: 24,
    },
    logoText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onSurface,
      marginBottom: 8,
    },
    formContainer: {
      paddingHorizontal: 8,
    },
    inputContainer: {
      marginBottom: 20,
    },
    textInput: {
      backgroundColor: colors.surfaceVariant,
      height: 64, // Increased height
      fontFamily: 'Urbanist',
    },
    cameroonPrefix: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
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
    documentUploadText: {
      marginLeft: 12,
      color: colors.onSurface,
      fontSize: 16,
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
    termsText: {
      fontSize: 14,
      color: colors.onSurface,
      lineHeight: 20,
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
    // Social button styles removed for simplicity
    loginLinkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    loginPrompt: {
      color: colors.onSurface,
      fontSize: 16,
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

export default RestaurantSignupScreen;