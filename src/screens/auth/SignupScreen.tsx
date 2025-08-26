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
import { registerSchema } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import { TextButton } from '@/src/components/common/TextButton';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useRegister } from '@/src/hooks/customer/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';

// Optimized country codes data - moved outside component to prevent recreation
const COUNTRY_CODES = [
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
] as const;

interface SignUpFormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

type CountryCode = (typeof COUNTRY_CODES)[number];

const SignupScreen: React.FC<AuthStackScreenProps<'SignUp'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();
  const {
    mutate: registerUserMutation,
    isPending,
    error: registerError,
  } = useRegister();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { clearError, setError, error: authError } = useAuthStore();

  // get usertype gotten from params
  const userType = route.params?.userType || 'customer';

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
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <Text style={styles.countryName}>{item.country}</Text>
        <Text style={styles.countryCode}>{item.code}</Text>
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

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      fullName: '',
    },
  });

  // Optimized callbacks with useCallback to prevent unnecessary re-renders
  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
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
        // Prepare registration data
        const registrationData = {
          role: userType,
          fullName: data.fullName.trim(),
          phoneNumber: `${selectedCountryCode.code}${data.phoneNumber.trim()}`,
          email: data.email.trim(),
          password: data.password,
        };

        registerUserMutation(registrationData, {
          onSuccess: (response) => {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('account_created_successfully'),
              position: 'top',
            });
            console.log(response.data.userId);

            // Navigate to OTP verification screen with the response data
            navigation.navigate('OTPVerification', {
              userId: response.data.userId, // Handle different response structures
              email: data.email,
              phone: registrationData.phoneNumber,
              userType,
              type: 'email',
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
      registerUserMutation,
      clearError,
      setError,
      t,
      selectedCountryCode,
      userType,
      navigation,
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

  // Memoized values to prevent unnecessary recalculations
  const isSubmitDisabled = useMemo(
    () => isPending || !termsAccepted || !isValid,
    [isPending, termsAccepted, isValid],
  );

  const keyExtractor = useCallback((item: CountryCode) => item.code, []);

  const renderCountryItem = useCallback(
    ({ item }: { item: CountryCode }) => (
      <CountryItem item={item} onSelect={selectCountryCode} />
    ),
    [CountryItem, selectCountryCode],
  );

  // Optimized phone number placeholder
  const phoneNumberPlaceholder = useMemo(
    () => `${selectedCountryCode.code} 690 000 000`,
    [selectedCountryCode.code],
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
                <Text style={styles.logoText}>R</Text>
              </View>
              <Text style={styles.title}>{t('create_account')}</Text>
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
                        <Text style={styles.selectedCountryFlag}>
                          {selectedCountryCode.flag}
                        </Text>
                        <Text style={styles.selectedCountryCode}>
                          {selectedCountryCode.code}
                        </Text>
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
                    <Text style={styles.termsText}>
                      {t('terms_agreement')}{' '}
                    </Text>
                    <TextButton
                      onPress={openTerms}
                      text={t('terms_of_service')}
                    />
                    <Text style={styles.termsText}> {t('and')} </Text>
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
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                disabled={isSubmitDisabled}
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
                <Text style={styles.dividerText}>{t('or_continue_with')}</Text>
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
                <Text style={styles.loginPrompt}>
                  {t('already_have_account')}{' '}
                </Text>
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
                <Text style={styles.modalTitle}>{t('select_country')}</Text>
                <TouchableOpacity
                  onPress={closeCountryModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalDoneButton}>{t('ok')}</Text>
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

export default SignupScreen;
