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
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Checkbox, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/utils/validation';
import { TextButton } from '@/components/common/TextButton';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import type { AppDispatch, RootState } from '@/store/store';

// Country codes data - you can move this to a separate file
const COUNTRY_CODES = [
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  // Add more countries as needed
];

const SignupScreen = () => {
  // Interface for sign up
  interface SignUpFormData {
    email: string;
    displayName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }

  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    COUNTRY_CODES[0],
  ); // Default to Cameroon
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form controller for register customer
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      displayName: '',
    },
  });

  const {error, signUp} = useAuth();
  // Watch password for confirm password validation
  const password = watch('password');

  // Submit handler
  const onSubmit = async (data: SignUpFormData) => {
    if (!termsAccepted) {
      // Show error toast or alert
      alert('Please accept terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Prepare data with country code
      const signupData = {
        ...data,
        phoneNumber: `${selectedCountryCode.code}${data.phoneNumber}`,
      };

      // TODO: Implement signup logic
      await signUp(signupData.email, signupData.password, 'customer', {phoneNumber: signupData.phoneNumber, userName: signupData.displayName})
      // Show success toast or alert
      console.log('Signup successful');
      Alert.alert('Success', 'Account created successfully');
      alert('Account created successfully!');

      console.log('SignupScreen data:', signupData);
    } catch (error: any ) {
      console.error('SignupScreen error:', error);

      // Handle error - show toast/alert
          Alert.alert('Signup Failed', error || 'Could not create account');

    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // TODO: Navigate to login screen
    // navigation.navigate('Login');
    console.log('Navigate to login');
  };

  const selectCountryCode = (country: (typeof COUNTRY_CODES)[0]) => {
    setSelectedCountryCode(country);
    setShowCountryModal(false);
  };

  const renderCountryItem = ({ item }: { item: (typeof COUNTRY_CODES)[0] }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 px-4 border-b border-gray-100"
      onPress={() => selectCountryCode(item)}
    >
      <Text className="text-2xl mr-3">{item.flag}</Text>
      <Text className="flex-1 text-base text-gray-900">{item.country}</Text>
      <Text className="text-base text-gray-600 font-medium">{item.code}</Text>
    </TouchableOpacity>
  );

  return (
     <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
    <SafeAreaView className="flex-1 flex-col bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 leading-tight">
              Create Your{'\n'}Account
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Create an account to start looking for the food you like
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Username Input */}
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Username
                  </Text>
                  <TextInput
                    placeholder="Enter your username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    keyboardType="default"
                    autoCapitalize="words"
                    autoComplete="name"
                    outlineStyle={{ borderRadius: 12 }}
                    style={{ backgroundColor: 'white' }}
                    contentStyle={{ paddingHorizontal: 16 }}
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

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Email address
                  </Text>
                  <TextInput
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    outlineStyle={{ borderRadius: 12 }}
                    style={{ backgroundColor: 'white' }}
                    contentStyle={{ paddingHorizontal: 16 }}
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

            {/* Phone Number Input with Country Code */}
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Phone number
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      className="border border-gray-300 rounded-l-xl px-3 py-4 bg-gray-50 flex-row items-center"
                      onPress={() => setShowCountryModal(true)}
                    >
                      <Text className="text-lg mr-1">
                        {selectedCountryCode.flag}
                      </Text>
                      <Text className="text-base font-medium text-gray-700 mr-1">
                        {selectedCountryCode.code}
                      </Text>
                      <Text className="text-gray-400">▼</Text>
                    </TouchableOpacity>
                    <TextInput
                      placeholder="Enter phone number"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      outlineStyle={{
                        borderRadius: 12,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      style={{
                        backgroundColor: 'white',
                        flex: 1,
                      }}
                      contentStyle={{ paddingHorizontal: 16 }}
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

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Password
                  </Text>
                  <TextInput
                    placeholder="Enter your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    outlineStyle={{ borderRadius: 12 }}
                    style={{ backgroundColor: 'white' }}
                    contentStyle={{ paddingHorizontal: 16 }}
                    error={!!errors.password}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
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
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    Confirm Password
                  </Text>
                  <TextInput
                    placeholder="Confirm your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    outlineStyle={{ borderRadius: 12 }}
                    style={{ backgroundColor: 'white' }}
                    contentStyle={{ paddingHorizontal: 16 }}
                    error={!!errors.confirmPassword}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    }
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
            <View className="flex-row items-start">
              <Checkbox
                status={termsAccepted ? 'checked' : 'unchecked'}
                onPress={() => setTermsAccepted(!termsAccepted)}
                color="#007aff"
              />
              <View className="flex-1 ml-2 ">
                <Text className="text-sm text-gray-700 leading-5">
                  I agree with{' '}
                  <TextButton
                    text="terms of service"
                    onPress={() => {
                      // TODO: Navigate to terms screen
                      console.log('Show terms of service');
                    }}
                  />{' '}
                  and{' '}
                  <TextButton
                    text="privacy policy"
                    onPress={() => {
                      // TODO: Navigate to privacy policy screen
                      console.log('Show privacy policy');
                    }}
                  />
                </Text>
              </View>
            </View>

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading || !termsAccepted}
              buttonColor="#007aff"
              contentStyle={{ paddingVertical: 12 }}
              style={{ borderRadius: 12, marginTop: 8 }}
              labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500 text-sm">
                Or continue with
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="space-y-3">
              <Button
                mode="outlined"
                onPress={() => {
                  // TODO: Implement Google signup
                  console.log('Google signup');
                }}
                icon="google"
                contentStyle={{ paddingVertical: 8 }}
                style={{ borderRadius: 12, borderColor: '#e5e5e5' }}
                labelStyle={{ fontSize: 16, color: '#374151' }}
              >
                Continue with Google
              </Button>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-6 mb-4">
              <Text className="text-gray-600 text-base">
                Already have an account?{' '}
              </Text>
              <TextButton text="Sign In" onPress={handleLogin} />
            </View>
            {error && (
  <Text className="text-red-500 text-center mb-2">{error}</Text>
)}
          </View>
        </View>
      </ScrollView>

      {/* Country Code Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryModal(false)}>
              <Text className="text-blue-500 text-base font-medium">Done</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={COUNTRY_CODES}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
