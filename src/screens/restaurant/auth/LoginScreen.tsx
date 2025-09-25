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
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import { Checkbox, HelperText, TextInput, useTheme } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useLoginRestaurant } from '@/src/hooks/restaurant/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import {
  Heading1,
  Heading2,
  Body,
  Label,
} from '@/src/components/common/Typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LoginFormData {
  email: string;
  password: string;
}

const RestaurantLoginScreen: React.FC<AuthStackScreenProps<'SignIn'>> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const loginMutation = useLoginRestaurant();
  const { error: authError, clearError } = useAuthStore();

  // Optimized animations - only essential ones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Simplified entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScaleAnim]);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (!isConnected || !isInternetReachable) {
        return;
      }
      clearError();

      try {
        await loginMutation.mutateAsync({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        });

        console.log('Restaurant login successful');
        navigation.getParent()?.navigate('RestaurantApp');
      } catch (error: any) {
        console.error('Restaurant login failed:', error);
      }
    },
    [isConnected, isInternetReachable, loginMutation, clearError, navigation],
  );

  const handleGoogleSignIn = useCallback(() => {
    console.log('Google login pressed');
  }, []);

  const handleAppleSignIn = useCallback(() => {
    console.log('Apple login pressed');
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleRememberMe = useCallback(() => {
    setRememberMe((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                <Text style={styles.logoText}>🍽️</Text>
              </View>
            </View>
            <Heading1 color={colors.onBackground} weight="bold" align="center">
              {t('welcome_back')}
            </Heading1>
            <Body
              color={colors.onSurfaceVariant}
              align="center"
              style={styles.subtitle}
            >
              Sign in to your restaurant dashboard
            </Body>
          </Animated.View>

          {/* Form Section */}
          <Animated.View style={[styles.formSection, { opacity: fadeAnim }]}>
            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={t('email_placeholder')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    left={
                      <TextInput.Icon
                        icon="email-outline"
                        color={colors.primary}
                      />
                    }
                    style={styles.textInput}
                    outlineStyle={[
                      styles.inputOutline,
                      errors.email && styles.inputError,
                    ]}
                    error={!!errors.email}
                    theme={{ colors: { primary: colors.primary } }}
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
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={t('enter_password')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    left={
                      <TextInput.Icon
                        icon="lock-outline"
                        color={colors.primary}
                      />
                    }
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        onPress={togglePassword}
                        color={colors.primary}
                      />
                    }
                    style={styles.textInput}
                    outlineStyle={[
                      styles.inputOutline,
                      errors.password && styles.inputError,
                    ]}
                    error={!!errors.password}
                    theme={{ colors: { primary: colors.primary } }}
                  />
                  {errors.password && (
                    <HelperText type="error" visible={!!errors.password}>
                      {errors.password.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Options Row */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={toggleRememberMe}
              >
                <Checkbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={toggleRememberMe}
                  uncheckedColor={colors.outline}
                  color={colors.primary}
                />
                <Label
                  color={colors.onSurfaceVariant}
                  style={styles.rememberText}
                >
                  {t('remember_me')}
                </Label>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Label color={colors.primary} weight="semibold">
                  {t('forgot_password')}
                </Label>
              </TouchableOpacity>
            </View>

            {/* Error Display */}
            <ErrorDisplay
              error={loginMutation.error?.message || authError || null}
              visible={!!(loginMutation.error?.message || authError)}
            />

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={loginMutation.isPending || !isValid}
              style={[
                styles.loginButton,
                { backgroundColor: colors.primary },
                (loginMutation.isPending || !isValid) &&
                  styles.loginButtonDisabled,
              ]}
            >
              <Heading2 color={colors.onPrimary} weight="bold">
                {loginMutation.isPending ? t('logging_in') : t('login')}
              </Heading2>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: colors.outline },
                ]}
              />
              <Label color={colors.onSurfaceVariant} style={styles.dividerText}>
                {t('or_signin_with')}
              </Label>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: colors.outline },
                ]}
              />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                  },
                ]}
                onPress={handleGoogleSignIn}
                disabled={loginMutation.isPending}
              >
                <Ionicons
                  name="logo-google"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <Body color={colors.onSurfaceVariant} weight="medium">
                  Google
                </Body>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                  },
                ]}
                onPress={handleAppleSignIn}
                disabled={loginMutation.isPending}
              >
                <Ionicons
                  name="logo-apple"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <Body color={colors.onSurfaceVariant} weight="medium">
                  Apple
                </Body>
              </TouchableOpacity>
            </View>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Body color={colors.onSurfaceVariant}>
                {t('dont_have_account')}{' '}
              </Body>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SignUp', {
                    userType: route.params?.userType || 'restaurant',
                  })
                }
              >
                <Label color={colors.primary} weight="bold">
                  {t('signup')}
                </Label>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
    },

    header: {
      paddingTop: 50,
      paddingBottom: 20,
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    logoSection: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    logoContainer: {
      marginBottom: 24,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    logoText: {
      fontSize: 32,
    },
    subtitle: {
      marginTop: 8,
    },

    formSection: {
      flex: 1,
      paddingBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    textInput: {
      backgroundColor: colors.surface,
      fontSize: 16,
      fontFamily: 'Urbanist-Regular',
    },
    inputOutline: {
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.outline,
    },
    inputError: {
      borderColor: colors.error,
    },

    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    rememberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rememberText: {
      marginLeft: 8,
      fontFamily: 'Urbanist-Medium',
    },

    loginButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },

    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
    },
    dividerText: {
      paddingHorizontal: 16,
      fontFamily: 'Urbanist-Medium',
    },

    socialButtons: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 32,
    },
    socialButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      gap: 8,
    },

    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default RestaurantLoginScreen;
