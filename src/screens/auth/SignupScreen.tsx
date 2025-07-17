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
import { Button, Checkbox, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '@/src/navigation/navigationHelpers';

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

type CountryCode = typeof COUNTRY_CODES[number];

// Memoized components for better performance
const CountryItem = React.memo(({ 
  item, 
  onSelect 
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
));
CountryItem.displayName = 'CountryItem';

const SignupScreen = () => {
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
  const onSubmit = useCallback(async (data: SignUpFormData) => {
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual signup logic
      console.log('Signup data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to verification screen or home
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [termsAccepted]);

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

  const handleLogin = useCallback(() => {
    navigate('Auth', {
      screen: 'SignIn',
    });
  }, []);

  const selectCountryCode = useCallback((country: CountryCode) => {
    setSelectedCountryCode(country);
    setShowCountryModal(false);
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleTerms = useCallback(() => {
    setTermsAccepted(prev => !prev);
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
  const isSubmitDisabled = useMemo(() => 
    loading || !termsAccepted || !isValid, 
    [loading, termsAccepted, isValid]
  );

  const keyExtractor = useCallback((item: CountryCode) => item.code, []);

  const renderCountryItem = useCallback(({ item }: { item: CountryCode }) => (
    <CountryItem item={item} onSelect={selectCountryCode} />
  ), [selectCountryCode]);

  // Optimized phone number placeholder
  const phoneNumberPlaceholder = useMemo(() => 
    `${selectedCountryCode.code} 690 000 000`, 
    [selectedCountryCode.code]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => console.log('Go back')}>
              <Ionicons name="arrow-back" size={24} color="#000" />
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
                      <Ionicons name="chevron-down" size={16} color="#666" />
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
                        errors.phoneNumber && styles.inputError
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
                    left={<TextInput.Icon icon="email" />}
                    outlineStyle={[
                      styles.inputOutline,
                      errors.email && styles.inputError
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
                    left={<TextInput.Icon icon="account" />}
                    outlineStyle={[
                      styles.inputOutline,
                      errors.displayName && styles.inputError
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
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={togglePassword}
                       
                      />
                    }
                    outlineStyle={[
                      styles.inputOutline,
                      errors.password && styles.inputError
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
                    left={<TextInput.Icon icon="lock" />}
                    outlineStyle={[
                      styles.inputOutline,
                      errors.confirmPassword && styles.inputError
                    ]}
                    style={styles.textInput}
                    contentStyle={styles.inputContent}
                    error={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <HelperText type="error" visible={!!errors.confirmPassword}>
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
                  uncheckedColor="#666"
                  color="#007AFF"
                />
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    I Agree with{' '}
                    <TouchableOpacity onPress={openTerms}>
                      <Text style={styles.termsLink}>Terms of Service</Text>
                    </TouchableOpacity>
                    {' '}and{' '}
                    <TouchableOpacity onPress={openPrivacyPolicy}>
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                  </Text>
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={isSubmitDisabled}
              buttonColor="#007AFF"
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
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
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
              <TouchableOpacity onPress={closeCountryModal} activeOpacity={0.7}>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// Optimized styles using StyleSheet.create for better performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#007AFF',
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
    color: '#111',
    marginBottom: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
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
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  selectedCountryFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  selectedCountryCode: {
    fontSize: 16,
    color: '#111',
    marginRight: 8,
    fontWeight: '500',
  },
  phoneInput: {
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: '#f3f4f6',
  },
  phoneTextInput: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#f3f4f6',
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: '#f3f4f6',
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
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
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
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#6b7280',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    borderRadius: 25,
    borderColor: '#f3f4f6',
    borderWidth: 1,
  },
  socialButtonContent: {
    paddingVertical: 12,
  },
  socialButtonLabel: {
    fontSize: 14,
    color: '#374151',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  loginPrompt: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalDoneButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default SignupScreen;
