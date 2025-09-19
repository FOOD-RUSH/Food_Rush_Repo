import React, { useState, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {
  Button,
  TextInput,
  HelperText,
  Checkbox,
  useTheme,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/utils/validation';
import { TextButton } from '@/src/components/common/TextButton';
import { AuthStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useLogin } from '@/src/hooks/customer/useAuthhooks';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import { Typography, Heading1, Body, Label } from '@/src/components/common/Typography';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC<AuthStackScreenProps<'SignIn'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  // get usertype gotten from params
  const userType = route.params?.userType;

  const WelcomeImage = require('@/assets/images/Welcome.png');
  const { clearError } = useAuthStore();

  // Using the refactored React Query hooks
  const loginMutation = useLogin();
  const { error: authError } = useAuthStore();

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      // Check network connectivity
      if (!isConnected || !isInternetReachable) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: 'No internet connection. Please check your network settings.',
          position: 'top',
        });
        return;
      }

      // Clear any previous errors
      clearError();

      console.log('Attempting login with email:', data.email);

      try {
        await loginMutation.mutateAsync({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        });

        console.log('Customer login successful');
        
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: 'Login successful!',
          position: 'top',
        });

        // Navigate to main app - the RootNavigator will handle routing based on auth state
        navigation.getParent()?.navigate('CustomerApp');
      } catch (error: any) {
        console.error('Customer login failed:', error);
        
        // Determine error message
        let errorMessage = 'Login failed. Please try again.';

        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error?.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error?.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error. Please check your internet connection.';
        }

        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: errorMessage,
          position: 'top',
        });
      }
    },
    [isConnected, isInternetReachable, clearError, t, loginMutation, navigation],
  );

  const handleGoogleSignIn = async () => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No internet connection. Please check your network settings.',
        position: 'top',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: 'Google Sign In not implemented yet',
      position: 'top',
    });
  };

  const handleAppleSignIn = async () => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No internet connection. Please check your network settings.',
        position: 'top',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: t('info'),
      text2: 'Apple Sign In not implemented yet',
      position: 'top',
    });
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp', { userType: userType });
  };

  return (
    <CommonView>
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
              <Image className="w-32 h-32" source={WelcomeImage} />
            </View>
            <Heading1
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 8 }}
            >
              {t('welcome_back')}
            </Heading1>
          </View>

          {/* Form */}
          <View className="flex-1 px-2">
            <View className="space-y-4 mb-2">
              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="mb-4">
                    <TextInput
                      placeholder={t('email')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      left={
                        <TextInput.Icon icon="email" color={colors.onSurface} />
                      }
                      outlineStyle={{
                        borderRadius: 16,
                        borderColor: errors.email
                          ? colors.error
                          : colors.surfaceVariant,
                      }}
                      style={{ backgroundColor: colors.surfaceVariant }}
                      contentStyle={{
                        paddingHorizontal: 16,
                        color: colors.onSurfaceVariant,
                      }}
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
                  <View className="mb-2">
                    <TextInput
                      placeholder={t('password')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect={false}
                      left={
                        <TextInput.Icon icon="lock" color={colors.onSurface} />
                      }
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(!showPassword)}
                          color={colors.onSurface}
                        />
                      }
                      outlineStyle={{
                        borderRadius: 16,
                        borderColor: errors.password
                          ? colors.error
                          : colors.surfaceVariant,
                      }}
                      style={{ backgroundColor: colors.surfaceVariant }}
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
                    color={colors.primary}
                  />
                  <Body
                    color={colors.onSurface}
                    style={{ marginLeft: 8 }}
                  >
                    {t('remember_me')}
                  </Body>
                </View>

                <TextButton
                  text={t('forgot_password')}
                  onPress={handleForgotPassword}
                />
              </View>

              {/* Error Display */}
              <ErrorDisplay
                error={loginMutation.error?.message || authError || null}
                visible={!!(loginMutation.error?.message || authError)}
              />

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
                buttonColor={colors.primary}
                contentStyle={{ paddingVertical: 12 }}
                style={{ borderRadius: 25, marginTop: 16 }}
                labelStyle={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                {loginMutation.isPending ? t('logging_in') : t('login')}
              </Button>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View
                  className={`flex-1 h-px`}
                  style={{ backgroundColor: colors.outline }}
                />
                <Label
                  color={colors.onBackground}
                  style={{ paddingHorizontal: 16 }}
                >
                  {' '}
                  or Sign in{' '}
                </Label>
                <View
                  className={`flex-1 h-px`}
                  style={{ backgroundColor: colors.outline }}
                />
              </View>

              {/* Social Login Buttons */}
              <View className="flex-row justify-between">
                {/* Google */}
                <Button
                  mode="outlined"
                  onPress={handleGoogleSignIn}
                  disabled={loginMutation.isPending}
                  icon="google"
                  contentStyle={{ paddingVertical: 12 }}
                  style={{
                    flex: 1,
                    borderRadius: 25,
                    borderColor: colors.outline,
                    borderWidth: 1,
                    marginHorizontal: 2,
                  }}
                  labelStyle={{
                    fontSize: 14,
                    color: colors.onSurface,
                  }}
                >
                  Google
                </Button>

                {/* Apple */}
                <Button
                  mode="outlined"
                  onPress={handleAppleSignIn}
                  disabled={loginMutation.isPending}
                  icon="apple"
                  contentStyle={{ paddingVertical: 12 }}
                  style={{
                    flex: 1,
                    borderRadius: 25,
                    borderColor: colors.outline,
                    borderWidth: 1,
                    marginHorizontal: 2,
                  }}
                  labelStyle={{
                    fontSize: 14,
                    color: colors.onSurface,
                  }}
                >
                  Apple
                </Button>
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-8 mb-4">
                <Body
                  color={colors.onBackground}
                >
                  {t('dont_have_account')}{' '}
                </Body>
                <TextButton text={t('signup')} onPress={handleSignUp} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CommonView>
  );
};

export default LoginScreen;
