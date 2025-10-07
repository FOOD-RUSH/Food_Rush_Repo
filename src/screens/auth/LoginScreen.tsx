import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  TextInput,
  HelperText,
  useTheme,
  Button,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/utils/validation';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useLogin } from '@/src/hooks/customer/useAuthhooks';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import { Heading1, Body, Label } from '@/src/components/common/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomCheckbox from '@/src/components/common/CustomCheckbox';

interface LoginFormData {
  email: string;
  password: string;
}

const { height } = Dimensions.get('window');
const WelcomeImage = require('@/assets/images/vendor_background.jpg');

const LoginScreen: React.FC<AuthStackScreenProps<'SignIn'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();
  const { clearError, error: authError } = useAuthStore();
  const loginMutation = useLogin();
  const insets = useSafeAreaInsets();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Animations - simplified to single values
  const overlayAnim = useRef(new Animated.Value(1)).current;
  const formAnim = useRef(new Animated.Value(height)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const userType = route.params?.userType;

  // Memoized styles
  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: insets.bottom + 20, // Add bottom insets
    }),
    [colors.surface, insets.bottom],
  );

  const loginButtonStyle = useMemo(
    () => ({
      backgroundColor: colors.primary,
      borderRadius: 14,
      marginBottom: 24,
    }),
    [colors.primary],
  );

  const socialButtonStyle = useMemo(
    () => ({
      backgroundColor: colors.surfaceVariant,
      borderRadius: 14,
      flex: 1,
    }),
    [colors.surfaceVariant],
  );

  // Input style without borders and labels, rounded 16px
  const inputStyle = useMemo(
    () => ({
      backgroundColor: colors.surfaceVariant,
      borderWidth: 0,
      borderRadius: 16,
    }),
    [colors.surfaceVariant],
  );

  const inputOutlineStyle = useMemo(
    () => ({
      borderWidth: 0,
      borderRadius: 16,
    }),
    [],
  );

  // Entrance animations - run once
  useEffect(() => {
    const animateEntrance = () => {
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(overlayAnim, {
            toValue: 0.4,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(formAnim, {
            toValue: height * 0.3, // Increased height slightly
            duration: 400,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    };

    animateEntrance();
  }, [formAnim, overlayAnim, titleAnim]);

  // Network check helper
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

  // Submit handler
  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (!checkNetwork()) return;

      clearError();

      try {
        await loginMutation.mutateAsync({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        });

        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: 'Login successful!',
          position: 'top',
        });

        navigation.getParent()?.navigate('CustomerApp');
      } catch (error: any) {
        let errorMessage = 'Login failed. Please try again.';

        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.status === 401) {
          errorMessage =
            'Invalid email or password. Please check your credentials.';
        } else if (error?.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error?.code === 'NETWORK_ERROR') {
          errorMessage =
            'Network error. Please check your internet connection.';
        }

        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: errorMessage,
          position: 'top',
        });
      }
    },
    [checkNetwork, clearError, loginMutation, navigation, t],
  );

  // Event handlers
  const handleSocialSignIn = useCallback(
    (provider: string) => {
      if (!checkNetwork()) return;

      Toast.show({
        type: 'info',
        text1: t('info'),
        text2: `${provider} Sign In not implemented yet`,
        position: 'top',
      });
    },
    [checkNetwork, t],
  );

  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );
  const toggleRememberMe = useCallback(
    () => setRememberMe((prev) => !prev),
    [],
  );
  const handleForgotPassword = useCallback(
    () => navigation.navigate('ForgotPassword'),
    [navigation],
  );
  const handleSignUp = useCallback(
    () => navigation.navigate('SignUp', { userType }),
    [navigation, userType],
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background with Overlay */}
      <ImageBackground
        source={WelcomeImage}
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

      {/* Welcome Title */}
      <Animated.View
        style={{
          position: 'absolute',
          top: height * 0.12,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: titleAnim,
        }}
      >
        <Heading1
          style={{
            fontSize: 32,
            fontWeight: '800',
            color: 'white',
            textAlign: 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}
        >
          {t('welcome_back')}
        </Heading1>
        <Body
          style={{
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Sign in to continue
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
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Drag Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: colors.outline,
                borderRadius: 2,
                alignSelf: 'center',
                marginBottom: 32,
              }}
            />

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 16 }}>
                  <TextInput
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    mode="outlined"
                    left={<TextInput.Icon icon="email-outline" />}
                    error={!!errors.email}
                    style={inputStyle}
                    outlineStyle={inputOutlineStyle}
                    contentStyle={{ borderRadius: 16 }}
                  />
                  <HelperText type="error" visible={!!errors.email}>
                    {errors.email?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 20 }}>
                  <TextInput
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        onPress={togglePassword}
                      />
                    }
                    error={!!errors.password}
                    style={inputStyle}
                    outlineStyle={inputOutlineStyle}
                    contentStyle={{ borderRadius: 16 }}
                  />
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Remember Me & Forgot Password */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={toggleRememberMe}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <CustomCheckbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={toggleRememberMe}
                  uncheckedColor={colors.onSurfaceVariant}
                  color={colors.primary}
                />
                <Body style={{ marginLeft: 4 }}>Remember me</Body>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Body style={{ color: colors.primary }}>Forgot Password?</Body>
              </TouchableOpacity>
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
              style={loginButtonStyle}
              contentStyle={{ paddingVertical: 8 }}
            >
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.outline }}
              />
              <Body
                style={{ marginHorizontal: 16, color: colors.onSurfaceVariant }}
              >
                or sign in with
              </Body>
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.outline }}
              />
            </View>

            {/* Social Login Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
              <Button
                mode="outlined"
                onPress={() => handleSocialSignIn('Google')}
                disabled={loginMutation.isPending}
                style={socialButtonStyle}
                icon="google"
              >
                Google
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleSocialSignIn('Apple')}
                disabled={loginMutation.isPending}
                style={socialButtonStyle}
                icon="apple"
              >
                Apple
              </Button>
            </View>

            {/* Sign Up Link */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20,
              }}
            >
              <Body style={{ color: colors.onSurfaceVariant }}>
                Don&apos;t have an account?{' '}
              </Body>
              <TouchableOpacity onPress={handleSignUp}>
                <Body style={{ color: colors.primary, fontWeight: 'bold' }}>
                  Sign Up
                </Body>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;
