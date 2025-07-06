import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Checkbox, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/src/utils/validation';
import { TextButton } from '@/src/components/common/TextButton';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '@/src/navigation/navigationHelpers';
// Country codes data
const COUNTRY_CODES = [
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

interface SignUpFormData {
  email: string;
  displayName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const SignupScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    COUNTRY_CODES[0],
  );
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = async (data: SignUpFormData) => {
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    // TODO:
  };

  const handleGoogleSignUp = async () => {
    // TODO:
  };

  const handleAppleSignUp = async () => {
    try {
      setLoading(true);
      // TODO: Implement Apple Sign-up
      console.log('Apple sign-up pressed');
    } catch (error) {
      Alert.alert('Error', 'Apple sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // TODO: Navigate to login screen
    console.log('Navigate to login');
    navigate('Auth', {
      screen: 'SignIn',
    });
  };

  const selectCountryCode = (country: (typeof COUNTRY_CODES)[0]) => {
    setSelectedCountryCode(country);
    setShowCountryModal(false);
  };

  const renderCountryItem = ({ item }: { item: (typeof COUNTRY_CODES)[0] }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-6 border-b border-gray-100"
      onPress={() => selectCountryCode(item)}
    >
      <Text className="text-2xl mr-4">{item.flag}</Text>
      <Text className="flex-1 text-base text-gray-900 font-medium">
        {item.country}
      </Text>
      <Text className="text-base text-gray-600 font-semibold">{item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center px-4 py-2">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </View>

          {/* Logo and Title */}
          <View className="items-center px-6 pt-4 pb-8">
            <View className="w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-6">
              <Text className="text-white text-2xl font-bold">R</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Create New Account
            </Text>
          </View>

          {/* Form */}
          <View className="px-6">
            <View className="space-y-4">
              {/* Country Code + Phone Number */}
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View className="flex-row">
                      <TouchableOpacity
                        className="border border-gray-300 rounded-l-xl px-4 py-4 bg-gray-50 flex-row items-center min-w-[100px]"
                        onPress={() => setShowCountryModal(true)}
                      >
                        <Text className="text-lg mr-2">
                          {selectedCountryCode.flag}
                        </Text>
                        <Text className="text-base font-medium text-gray-700 mr-1">
                          {selectedCountryCode.code}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={16}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>

                      <TextInput
                        placeholder="+237 690 000 000"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        mode="outlined"
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        left={<TextInput.Icon icon="phone-outlined" />}
                        outlineStyle={{
                          borderRadius: 12,
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          borderColor: errors.phoneNumber
                            ? '#EF4444'
                            : '#E5E7EB',
                        }}
                        style={{ backgroundColor: 'white', flex: 1 }}
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

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      placeholder="Email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      left={<TextInput.Icon icon="email-outline" />}
                      outlineStyle={{
                        borderRadius: 12,
                        borderColor: errors.email ? '#EF4444' : '#E5E7EB',
                      }}
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

              {/* Full Name Input */}
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      placeholder="Full Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="default"
                      autoCapitalize="words"
                      autoComplete="name"
                      left={<TextInput.Icon icon="account-outline" />}
                      outlineStyle={{
                        borderRadius: 12,
                        borderColor: errors.displayName ? '#EF4444' : '#E5E7EB',
                      }}
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

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      placeholder="Password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      left={<TextInput.Icon icon="lock-outline" />}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                      outlineStyle={{
                        borderRadius: 12,
                        borderColor: errors.password ? '#EF4444' : '#E5E7EB',
                      }}
                      style={{ backgroundColor: 'white' }}
                      contentStyle={{ paddingHorizontal: 16 }}
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

              {/* Terms and Privacy */}
              <View className="flex-row items-start mt-4">
                <Checkbox
                  status={termsAccepted ? 'checked' : 'unchecked'}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  color="#007AFF"
                />
                <View className="flex-1 ml-2">
                  <Text className="text-sm text-gray-700 leading-5">
                    I Agree with{' '}
                    <TextButton
                      text="Terms of Service"
                      onPress={() => console.log('Show terms')}
                    />{' '}
                    and{' '}
                    <TextButton
                      text="Privacy Policy"
                      onPress={() => console.log('Show privacy policy')}
                    />
                  </Text>
                </View>
              </View>

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading || !termsAccepted}
                buttonColor="#007AFF"
                contentStyle={{ paddingVertical: 12 }}
                style={{ borderRadius: 25, marginTop: 16 }}
                labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
              >
                {loading ? 'Creating Account...' : 'Sign up'}
              </Button>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="px-4 text-gray-500 text-sm">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Social Sign Up Buttons */}
              <View className="flex-row space-x-4">
                {/* Google */}
                <Button
                  mode="outlined"
                  onPress={handleGoogleSignUp}
                  disabled={loading}
                  icon="google"
                  contentStyle={{ paddingVertical: 12 }}
                  style={{
                    flex: 1,
                    borderRadius: 25,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                  }}
                  labelStyle={{ fontSize: 14, color: '#374151' }}
                >
                  Google
                </Button>

                {/* Apple */}
                <Button
                  mode="outlined"
                  onPress={handleAppleSignUp}
                  disabled={loading}
                  icon="apple"
                  contentStyle={{ paddingVertical: 12 }}
                  style={{
                    flex: 1,
                    borderRadius: 25,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                  }}
                  labelStyle={{ fontSize: 14, color: '#374151' }}
                >
                  Apple
                </Button>
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mt-6 mb-4">
                <Text className="text-gray-600 text-base">
                  Already have an account?{' '}
                </Text>
                <TextButton text="Login" onPress={handleLogin} />
              </View>

              {/* Error Message */}
              {/* {error && (
                <Text className="text-red-500 text-center text-sm">
                  {error}
                </Text>
              )} */}
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
                <Text className="text-blue-500 text-base font-medium">
                  Done
                </Text>
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
// 10.7.0
