import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import LocationPicker from '@/src/components/common/LocationPicker';
import { Location } from '@/src/location/types';
import { Heading2, Heading5, Body, Label } from '@/src/components/common/Typography';
import { ResponsiveContainer } from '@/src/components/common/ResponsiveContainer';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';

// Optimized country codes data - moved outside component to prevent recreation
const COUNTRY_CODES = [
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
] as const;

interface RestaurantSignUpFormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  name: string; // Restaurant name
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
  const { isSmallScreen, wp, hp } = useResponsive();
  const spacing = useResponsiveSpacing();

  // get usertype gotten from params
  const userType = route.params?.userType || 'restaurant';

  // Memoized components for better performance
  const CountryItem = React.memo(
    ({
      item,
      onSelect,
    }: {
      item: CountryCode;
      onSelect: (country: CountryCode) => void;
    }) => (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <Body style={{ marginRight: 16 }}>{item.flag}</Body>
        <Label color={colors.onSurface} weight="medium" style={{ flex: 1 }}>{item.country}</Label>
        <Label color={colors.onSurface} weight="semibold">{item.code}</Label>
      </TouchableOpacity>
    ),
  );
  CountryItem.displayName = 'CountryItem';

  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(
    COUNTRY_CODES[0],
  );
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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
    },
  }); // Added missing closing brace and parenthesis

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

      if (!selectedLocation) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('location_required_for_restaurant'),
          position: 'top',
        });
        return;
      }

      clearError();

      try {
        // Prepare registration data
        const registrationData = {
          role: userType,
          fullName: data.fullName.trim(),
          phoneNumber: `${selectedCountryCode.code}${data.phoneNumber.trim()}`,
          email: data.email.trim(),
          password: data.password,
          name: data.name.trim(), // Restaurant name
          ...(documentUri && { documentUri }), // Optional document
          ...(selectedLocation && {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: selectedLocation.formattedAddress, // Use address from location modal
            locationAddress: selectedLocation.formattedAddress,
            exactLocation: selectedLocation.exactLocation,
          }), // Location data
        };

        registerRestaurantMutation(registrationData, {
            onSuccess: (response) => {
              // Show awaiting approval message
              Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Your restaurant registration has been submitted and is awaiting approval. You will be notified once approved.',
                position: 'top',
                // duration: 5000,

              }, );
              console.log('Restaurant registration response:', response.data);

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
    [
      isConnected,
      isInternetReachable,
      termsAccepted,
      registerRestaurantMutation,
      clearError,
      setError,
      t,
      selectedCountryCode,
      userType,
      navigation,
      documentUri,
      selectedLocation,
    ],
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

  const selectCountryCode = useCallback((country: CountryCode) => {
    setSelectedCountryCode(country);
    setShowCountryModal(false);
  }, []);

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

  const openCountryModal = useCallback(() => {
    setShowCountryModal(true);
  }, []);

  const closeCountryModal = useCallback(() => {
    setShowCountryModal(false);
  }, []);

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

  // Optimized phone number placeholder
  const phoneNumberPlaceholder = useMemo(
    () => `${selectedCountryCode.code} 690 000 000`,
    [selectedCountryCode.code],
  );

  const keyExtractor = useCallback((item: CountryCode) => item.code, []);

  const renderCountryItem = useCallback(
    ({ item }: { item: CountryCode }) => (
      <CountryItem item={item} onSelect={selectCountryCode} />
    ),
    [CountryItem, selectCountryCode],
  );

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
              <View style={styles.logo}>
                <Heading2 color="white" weight="bold">R</Heading2>
              </View>
              <Heading2 color={colors.onSurface} weight="bold" style={{ marginBottom: 8 }}>{t('create_account')}</Heading2>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Country Code + Phone Number */}
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <View style={styles.phoneInputRow}>
                      <TouchableOpacity
                        style={styles.countrySelector}
                        onPress={openCountryModal}
                        activeOpacity={0.7}
                      >
                        <Body style={{ marginRight: 8 }}>
                          {selectedCountryCode.flag}
                        </Body>
                        <Label color={colors.onSurface} weight="medium" style={{ marginRight: 8 }}>
                          {selectedCountryCode.code}
                        </Label>
                        <Ionicons
                          name="chevron-down"
                          size={16}
                          color={colors.onSurface}
                        />
                      </TouchableOpacity>

                      <TextInput
                        placeholder={phoneNumberPlaceholder}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        mode="outlined"
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        outlineStyle={[
                          styles.phoneInput,
                          errors.phoneNumber && styles.inputError,
                        ]}
                        style={[styles.textInput, styles.phoneTextInput]}
                        contentStyle={styles.inputContent}
                        error={!!errors.phoneNumber}
                      />
                    </View>
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
                      style={styles.textInput}
                      contentStyle={styles.inputContent}
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
                      style={styles.textInput}
                      contentStyle={styles.inputContent}
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
                      style={styles.textInput}
                      contentStyle={styles.inputContent}
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

              {/* Location Picker - This will instantly pop up when clicked and provide the address */}
              <LocationPicker
                onLocationSelected={setSelectedLocation}
                selectedLocation={selectedLocation}
                required={true}
                label={t('restaurant_location')}
                placeholder={t('tap_to_select_location')}
              />

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
                      style={styles.textInput}
                      contentStyle={styles.inputContent}
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
                      style={styles.textInput}
                      contentStyle={styles.inputContent}
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
                disabled={isPending || !termsAccepted || !isValid || !selectedLocation}
                buttonColor={colors.primary}
                contentStyle={styles.buttonContent}
                style={styles.signUpButton}
                labelStyle={styles.signUpButtonLabel}
              >
                {isPending ? t('creating_account') : t('signup')}
              </Button>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Label color={colors.outline} style={{ paddingHorizontal: 16 }}>{t('or_continue_with')}</Label>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Sign Up Buttons */}
              <View style={styles.socialButtonsContainer}>
                <Button
                  mode="outlined"
                  onPress={handleGoogleSignUp}
                  disabled={isPending}
                  icon="google"
                  contentStyle={styles.socialButtonContent}
                  style={styles.socialButton}
                  labelStyle={styles.socialButtonLabel}
                >
                  Google
                </Button>

                <Button
                  mode="outlined"
                  onPress={handleAppleSignUp}
                  disabled={isPending}
                  icon="apple"
                  contentStyle={styles.socialButtonContent}
                  style={styles.socialButton}
                  labelStyle={styles.socialButtonLabel}
                >
                  Apple
                </Button>
              </View>

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

          {/* Country Code Modal */}
          <Modal
            visible={showCountryModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={closeCountryModal}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Heading5 color={colors.onSurface} weight="semibold">{t('select_country')}</Heading5>
                <TouchableOpacity
                  onPress={closeCountryModal}
                  activeOpacity={0.7}
                >
                  <Label color={colors.primary} weight="medium">{t('ok')}</Label>
                </TouchableOpacity>
              </View>
              <FlatList
                data={COUNTRY_CODES}
                renderItem={renderCountryItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                  length: 60,
                  offset: 60 * index,
                  index,
                })}
              />
            </SafeAreaView>
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
    logo: {
      width: 64,
      height: 64,
      backgroundColor: colors.primary,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
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
      marginBottom: 16,
    },
    phoneInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countrySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      minWidth: 120,
      borderWidth: 1,
      borderColor: colors.surfaceVariant,
    },
    selectedCountryFlag: {
      fontSize: 18,
      marginRight: 8,
    },
    selectedCountryCode: {
      fontSize: 16,
      color: colors.onSurface,
      marginRight: 8,
      fontWeight: '500',
    },
    phoneInput: {
      borderRadius: 12,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderColor: colors.surfaceVariant,
    },
    phoneTextInput: {
      flex: 1,
    },
    textInput: {
      backgroundColor: colors.surfaceVariant,
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
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.outline,
    },
    dividerText: {
      paddingHorizontal: 16,
      color: colors.outline,
      fontSize: 14,
    },
    socialButtonsContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    socialButton: {
      flex: 1,
      borderRadius: 25,
      borderColor: colors.outline,
      borderWidth: 1,
    },
    socialButtonContent: {
      paddingVertical: 12,
    },
    socialButtonLabel: {
      fontSize: 14,
      color: colors.onSurface,
    },
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
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
    },
    modalDoneButton: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '500',
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    countryFlag: {
      fontSize: 24,
      marginRight: 16,
    },
    countryName: {
      flex: 1,
      fontSize: 16,
      color: colors.onSurface,
      fontWeight: '500',
    },
    countryCode: {
      fontSize: 16,
      color: colors.onSurface,
      fontWeight: '600',
    },
  });

export default RestaurantSignupScreen;