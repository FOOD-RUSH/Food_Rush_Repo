import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
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
  displayName: string;
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
  const styles = useMemo(() => createStyles(colors), [colors]);
  const registerUser = useAuthStore((state) => state.registerUser);
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
  const [loading, setLoading] = useState(false);
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
      displayName: '',
    },
  });

  // Optimized callbacks with useCallback to prevent unnecessary re-renders
  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      if (!termsAccepted) {
        Alert.alert('Terms Required', 'Please accept the terms and conditions');
        return;
      }

      setLoading(true);
      try {
        // TODO: Implement actual signup logic
        console.log('Signup data:', data);

        // Simulate API call
        await registerUser({
          email: data.email,
          fullName: data.displayName,
          password: data.password,
          phoneNumber: data.phoneNumber,
          role: 'customer',
        });
        // Navigate to verification screen or home
        Alert.alert('Success', 'Account created successfully!');
      } catch (error) {
        console.error('Signup error:', error);
        Alert.alert('Error', 'Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [registerUser, termsAccepted],
  );

  const handleGoogleSignUp = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement Google Sign-up
      console.log('Google sign-up pressed');
      Alert.alert('Info', 'Google sign-up not implemented yet');
    } catch (error) {
      console.error('Google signup error:', error);
      Alert.alert('Error', 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAppleSignUp = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement Apple Sign-up
      console.log('Apple sign-up pressed');
      Alert.alert('Info', 'Apple sign-up not implemented yet');
    } catch (error) {
      console.error('Apple signup error:', error);
      Alert.alert('Error', 'Apple sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

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
    console.log('Show terms');
    // TODO: Navigate to terms screen
  }, []);

  const openPrivacyPolicy = useCallback(() => {
    console.log('Show privacy policy');
    // TODO: Navigate to privacy policy screen
  }, []);

  const openCountryModal = useCallback(() => {
    setShowCountryModal(true);
  }, []);

  const closeCountryModal = useCallback(() => {
    setShowCountryModal(false);
  }, []);

  // Memoized values to prevent unnecessary recalculations
  const isSubmitDisabled = useMemo(
    () => loading || !termsAccepted || !isValid,
    [loading, termsAccepted, isValid],
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
                  console.log('Go back');
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
              <Text style={styles.title}>Create New Account</Text>
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
                      placeholder="Email"
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
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Full Name"
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
                        errors.displayName && styles.inputError,
                      ]}
                      style={styles.textInput}
                      contentStyle={styles.inputContent}
                      error={!!errors.displayName}
                    />
                    {errors.displayName && (
                      <HelperText type="error" visible={!!errors.displayName}>
                        {errors.displayName.message}
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
                      placeholder="Password"
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
                      placeholder="Confirm Password"
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
                    <Text style={styles.termsText}>I Agree with </Text>
                    <TextButton onPress={openTerms} text="Term of service" />
                    <Text> and </Text>

                    <TextButton
                      onPress={openPrivacyPolicy}
                      text="privacy policy
                      "
                    />
                  </View>
                </View>
              </View>

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={isSubmitDisabled}
                buttonColor={colors.primary}
                contentStyle={styles.buttonContent}
                style={styles.signUpButton}
                labelStyle={styles.signUpButtonLabel}
              >
                {loading ? 'Creating Account...' : 'Sign up'}
              </Button>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Sign Up Buttons */}
              <View style={styles.socialButtonsContainer}>
                <Button
                  mode="outlined"
                  onPress={handleGoogleSignUp}
                  disabled={loading}
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
                  disabled={loading}
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
                  Already have an account?{' '}
                </Text>
                <TextButton
                  onPress={() => navigation.navigate('SignIn')}
                  text="Login"
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
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity
                  onPress={closeCountryModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalDoneButton}>Done</Text>
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
    },
    termsText: {
      fontSize: 14,
      color: colors.onSurface,
      lineHeight: 20,
    },
    termsLink: {
      color: colors.primary,
      textDecorationLine: 'underline',
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
      backgroundColor: colors.background,
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
    loginLink: {
      color: colors.primary,
      textDecorationLine: 'underline',
      fontWeight: '600',
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
// {
//   "status_code": 201,
//   "message": "OTP verified successfully",
//   "data": {
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NTg4ZTc2Mi03YTMwLTQ4MmMtOTIwMS02M2M4MTNjZTQ1MzciLCJlbWFpbCI6InRvY2h1a3d1cGF1bDIxQGdtYWlsLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc1NTA1MzkzMCwiZXhwIjoxNzU1MDYxMTMwfQ.urCQ28O0tRFj_E-Mrpegzm_-4cmYrXSZlCi9MHjeZ6c",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NTg4ZTc2Mi03YTMwLTQ4MmMtOTIwMS02M2M4MTNjZTQ1MzciLCJlbWFpbCI6InRvY2h1a3d1cGF1bDIxQGdtYWlsLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc1NTA1MzkzMCwiZXhwIjoxNzU1NjU4NzMwfQ._w0APGSaPxMWdGTDqX8wFZP6WnFnet0iFIF95wcxwvA",
//     "user": {
//       "id": "4588e762-7a30-482c-9201-63c813ce4537",
//       "email": "tochukwupaul21@gmail.com",
//       "fullName": "paul@example",
//       "role": "customer",
//       "status": "active",
//       "isEmailVerified": true,
//       "isPhoneVerified": false
//     }
//   }
// }
