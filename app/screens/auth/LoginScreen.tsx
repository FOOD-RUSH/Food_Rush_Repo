import '@/config/firebase.native';
import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput, HelperText, Checkbox } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/utils/validation';
import { TextButton } from '@/components/common/TextButton';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen( ) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { signIn, error } = useAuth();
  const WelcomeImage = require('@/assets/images/Welcome.png');

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      Alert.alert('Success', 'Welcome back' );
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      // TODO: Implement Google Sign-in
      console.log('Google sign-in pressed');
    } catch (error) {
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      // TODO: Implement Apple Sign-in
      console.log('Apple sign-in pressed');
    } catch (error) {
      Alert.alert('Error', 'Apple sign-in failed. Please try again.');
      alert(error)
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Navigate to forgot password');
  };

  const handleSignUp = () => {
    // TODO: Navigate to signup screen
    console.log('Navigate to signup');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Welcome illustration */}
          <View className="items-center px-6 py-8">
            <View className="w-48 h-48 bg-blue-50 rounded-lg items-center justify-center mb-8">
              {/* Placeholder for illustration - you can replace with actual image */}
              <Image className="w-32 h-32" source={WelcomeImage} />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
          </View>
              {/* Error Message */}
              {error && (
                <Text className="text-red-500 bg-gray-400 text-center text-sm mt-2 h-10 w-40">
                  {error}
                </Text>
              )}
          {/* Form */}
          <View className="flex-1 px-6">
            <View className="space-y-4">
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
                      autoComplete="password"
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

              {/* Remember me and Forgot password */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                    color="#007AFF"
                  />
                  <Text className="text-sm text-gray-600 ml-2">
                    Remember me
                  </Text>
                </View>

                <TextButton
                  text="Forgot Password?"
                  onPress={handleForgotPassword}
                />
              </View>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                buttonColor="#007AFF"
                contentStyle={{ paddingVertical: 12 }}
                style={{ borderRadius: 25, marginTop: 16 }}
                labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="px-4 text-gray-500 text-sm">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Social Login Buttons */}
              <View className="flex-row space-x-4">
                {/* Google */}
                <Button
                  mode="outlined"
                  onPress={handleGoogleSignIn}
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
                  onPress={handleAppleSignIn}
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

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-8 mb-4">
                <Text className="text-gray-600 text-base">
                  Already have an account?{' '}
                </Text>
                <TextButton text="Login" onPress={handleSignUp} />
              </View>

              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
