import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
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
import {
  Heading1,
  Heading2,
  Body,
  Label,
} from '@/src/components/common/Typography';
import * as yup from 'yup';

interface Step2FormData {
  restaurantName: string;
}

interface Step1Data {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const step2Schema = yup.object().shape({
  restaurantName: yup
    .string()
    .required('Restaurant name is required')
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(100, 'Restaurant name must be less than 100 characters'),
});

const { height } = Dimensions.get('window');
const RestaurantBgImage = require('@/assets/images/vendor_background.jpg');

const RestaurantSignupStep2: React.FC<
  AuthStackScreenProps<'RestaurantSignupStep2'>
> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();
  const {
    mutate: registerRestaurantMutation,
    isPending,
    error: registerError,
  } = useRegisterRestaurant();
  const { clearError, setError, error: authError } = useAuthStore();

  // Get step 1 data from route params
  const step1Data: Step1Data = route.params?.step1Data;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // Animations
  const overlayAnim = useRef(new Animated.Value(1)).current;
  const formAnim = useRef(new Animated.Value(height)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Use location service
  const { hasPermission, requestPermissionWithLocation } = useLocation({
    autoRequest: false,
    requestOnMount: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2FormData>({
    resolver: yupResolver(step2Schema) as any,
    mode: 'onChange',
    defaultValues: { restaurantName: '' },
  });

  // Memoized styles
  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 24,
      paddingTop: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 15,
    }),
    [colors.surface],
  );

  const buttonStyle = useMemo(
    () => ({
      borderRadius: 14,
      marginTop: 8,
    }),
    [],
  );

  // Entrance animations
  useEffect(() => {
    const animateEntrance = () => {
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(overlayAnim, {
            toValue: 0.5,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(formAnim, {
            toValue: height * 0.35,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    };

    animateEntrance();
  }, []);

  // Animate loading indicator
  useEffect(() => {
    if (isGettingLocation) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      rotation.start();
      return () => rotation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isGettingLocation, rotateAnim]);

  const checkNetwork = useCallback(() => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No internet connection. Please check your network settings.',
        position: 'top',
      });
      return false;
    }
    return true;
  }, [isConnected, isInternetReachable, t]);

  // Get exact GPS location
  const getExactLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
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

      if (
        locationResult.success &&
        locationResult.location &&
        !locationResult.location.isFallback
      ) {
        setSelectedLocation(locationResult.location);
        Toast.show({
          type: 'success',
          text1: 'Location Found',
          text2: 'Exact GPS coordinates obtained successfully',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2:
            locationResult.error ||
            'Could not get exact GPS location. Please try again.',
          position: 'top',
        });
      }
    } catch (error) {
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

  const onSubmit = useCallback(
    async (data: Step2FormData) => {
      if (!checkNetwork()) return;

      if (!termsAccepted) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: 'Please accept the terms and conditions',
          position: 'top',
        });
        return;
      }

      if (!selectedLocation || selectedLocation.isFallback) {
        Toast.show({
          type: 'error',
          text1: 'Exact Location Required',
          text2: 'Please get your exact GPS location before registering',
          position: 'top',
        });
        return;
      }

      clearError();

      try {
        const registrationData = {
          fullName: step1Data.fullName.trim(),
          email: step1Data.email.trim(),
          phoneNumber: step1Data.phoneNumber.replace('+237', ''),
          password: step1Data.password,
          name: data.restaurantName.trim(),
          address: selectedLocation.formattedAddress,
          phone: step1Data.phoneNumber,
          nearLat: selectedLocation.latitude,
          nearLng: selectedLocation.longitude,
          ...(documentUri && { document: documentUri }),
        };

        registerRestaurantMutation(registrationData, {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: 'Registration Successful',
              text2:
                'Your restaurant registration has been submitted and is awaiting approval.',
              position: 'top',
            });
            navigation.navigate('AwaitingApproval');
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
    [
      checkNetwork,
      termsAccepted,
      selectedLocation,
      clearError,
      setError,
      registerRestaurantMutation,
      navigation,
      step1Data,
      documentUri,
      t,
    ],
  );

  const toggleTerms = useCallback(() => setTermsAccepted((prev) => !prev), []);

  const openTerms = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: 'Terms of service will be implemented',
      position: 'top',
    });
  }, [t]);

  const openPrivacyPolicy = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: 'Privacy policy will be implemented',
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
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Image with Overlay */}
      <ImageBackground
        source={RestaurantBgImage}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${overlayAnim})`,
          }}
        />
      </ImageBackground>

      {/* Header */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          opacity: titleAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: 12,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Title Section */}
      <Animated.View
        style={{
          position: 'absolute',
          top: height * 0.12,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: titleAnim,
          transform: [
            {
              translateY: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        {/* Profile Image Section */}
        <TouchableOpacity
          onPress={pickProfileImage}
          style={{
            position: 'relative',
            marginBottom: 20,
          }}
        >
          {profileImageUri ? (
            <Image
              source={{ uri: profileImageUri }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: 'rgba(255, 255, 255, 0.8)',
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderStyle: 'dashed',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Ionicons
                name="camera-outline"
                size={36}
                color="rgba(255, 255, 255, 0.8)"
              />
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: colors.primary,
              borderRadius: 16,
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'white',
            }}
          >
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <Heading1
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            marginBottom: 8,
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
            fontFamily: 'Urbanist-Bold',
          }}
        >
          Restaurant Details
        </Heading1>

        <Body
          style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontFamily: 'Urbanist-Medium',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          Step 2 of 2 - Almost done!
        </Body>
      </Animated.View>

      {/* Form Container */}
      <Animated.View
        style={{
          position: 'absolute',
          top: formAnim,
          left: 0,
          right: 0,
          bottom: 0,
          ...containerStyle,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Drag Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: colors.outline,
                borderRadius: 2,
                alignSelf: 'center',
                marginBottom: 24,
              }}
            />

            {/* Restaurant Name Input */}
            <Controller
              control={control}
              name="restaurantName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 24 }}>
                  <TextInput
                    label="Restaurant Name"
                    placeholder="Enter your restaurant name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    mode="outlined"
                    left={<TextInput.Icon icon="storefront-outline" />}
                    error={!!errors.restaurantName}
                    style={{
                      backgroundColor: colors.surfaceVariant,
                      fontFamily: 'Urbanist-Regular',
                    }}
                    contentStyle={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 14,
                    }}
                  />
                  <HelperText type="error" visible={!!errors.restaurantName}>
                    {errors.restaurantName?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Location Button */}
            <View style={{ marginBottom: 24 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLocation
                    ? colors.primary + '15'
                    : colors.surfaceVariant,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: selectedLocation
                    ? colors.primary
                    : colors.outline,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => setShowLocationModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={
                    selectedLocation ? colors.primary : colors.onSurfaceVariant
                  }
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Label
                    style={{
                      color: selectedLocation
                        ? colors.primary
                        : colors.onSurface,
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Restaurant Location
                  </Label>
                  {selectedLocation ? (
                    <Body
                      style={{
                        color: colors.onSurface,
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                      }}
                      numberOfLines={2}
                    >
                      {selectedLocation.formattedAddress}
                    </Body>
                  ) : (
                    <Body
                      style={{
                        color: colors.onSurfaceVariant,
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                      }}
                    >
                      Tap to set your exact location
                    </Body>
                  )}
                </View>
                {isGettingLocation ? (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          }),
                        },
                      ],
                    }}
                  >
                    <Ionicons name="refresh" size={20} color={colors.primary} />
                  </Animated.View>
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Document Upload */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.outline,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
              }}
              onPress={pickDocument}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-attach-outline"
                size={24}
                color={colors.primary}
              />
              <Body
                style={{
                  marginLeft: 12,
                  color: colors.onSurface,
                  fontFamily: 'Urbanist-Regular',
                  flex: 1,
                }}
              >
                {documentName || 'Upload Document (Optional)'}
              </Body>
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 24,
              }}
            >
              <Checkbox
                status={termsAccepted ? 'checked' : 'unchecked'}
                onPress={toggleTerms}
                color={colors.primary}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Body
                  style={{
                    color: colors.onSurface,
                    fontFamily: 'Urbanist-Regular',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  I agree to the{' '}
                  <TextButton onPress={openTerms} text="Terms of Service" /> and{' '}
                  <TextButton
                    onPress={openPrivacyPolicy}
                    text="Privacy Policy"
                  />
                </Body>
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
              disabled={
                isPending ||
                !termsAccepted ||
                !isValid ||
                !selectedLocation ||
                (selectedLocation && selectedLocation.isFallback)
              }
              style={buttonStyle}
              contentStyle={{ paddingVertical: 10 }}
              labelStyle={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Urbanist-Bold',
              }}
            >
              {isPending ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.outline,
              backgroundColor: colors.surface,
            }}
          >
            <Heading2
              style={{
                fontFamily: 'Urbanist-Bold',
                color: colors.onSurface,
              }}
            >
              Restaurant Location
            </Heading2>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <Ionicons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 24,
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="location"
                size={64}
                color={colors.primary}
                style={{ marginBottom: 20 }}
              />

              <Heading2
                style={{
                  textAlign: 'center',
                  marginBottom: 16,
                  fontFamily: 'Urbanist-Bold',
                  color: colors.onSurface,
                }}
              >
                Location Instructions
              </Heading2>

              <View style={{ width: '100%', gap: 16, marginBottom: 20 }}>
                {[
                  'You must be physically present at your restaurant location',
                  'Ensure GPS and location services are enabled',
                  'This will be your official address for deliveries',
                ].map((instruction, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: 'row', alignItems: 'flex-start' }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                    <Body
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        fontFamily: 'Urbanist-Regular',
                        color: colors.onSurface,
                      }}
                    >
                      {instruction}
                    </Body>
                  </View>
                ))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  backgroundColor: colors.errorContainer || colors.error + '20',
                  borderRadius: 12,
                  padding: 16,
                  width: '100%',
                }}
              >
                <Ionicons name="warning" size={24} color={colors.error} />
                <Body
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontFamily: 'Urbanist-Regular',
                    color: colors.error,
                  }}
                >
                  Ensure you are at the correct location before proceeding
                </Body>
              </View>
            </View>
          </ScrollView>

          {/* Modal Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              padding: 20,
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.outline,
            }}
          >
            <Button
              mode="outlined"
              onPress={() => setShowLocationModal(false)}
              style={{ flex: 1, borderRadius: 12 }}
              labelStyle={{ fontFamily: 'Urbanist-SemiBold' }}
            >
              Cancel
            </Button>

            <Button
              mode="contained"
              onPress={async () => {
                setShowLocationModal(false);
                await getExactLocation();
              }}
              loading={isGettingLocation}
              disabled={isGettingLocation}
              style={{ flex: 1, borderRadius: 12 }}
              labelStyle={{ fontFamily: 'Urbanist-Bold' }}
            >
              {isGettingLocation ? 'Getting Location...' : 'Get Location'}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RestaurantSignupStep2;
