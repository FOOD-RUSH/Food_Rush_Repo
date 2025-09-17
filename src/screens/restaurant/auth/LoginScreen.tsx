import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Checkbox, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore, User } from '@/src/stores/customerStores/AuthStore';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useLoginRestaurant } from '@/src/hooks/restaurant/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import { RestaurantLoginResponse } from '@/src/services/restaurant/authApi';
import { LinearGradient } from 'expo-linear-gradient';

// ✅ Add logo assets
const googleLogo = require('@/assets/images/google.png');
const appleLogo = require('@/assets/images/apple.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// White/Blue theme colors
interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  white: string;
  lightBlue: string;
  darkBlue: string;
  gray: string;
  outline: string;
  error: string;
  success: string;
}

const blueTheme: ThemeColors = {
  primary: '#2563EB',
  primaryLight: '#204685ff',
  primaryDark: '#1D4ED8',
  white: '#FFFFFF',
  lightBlue: '#EFF6FF',
  darkBlue: '#1E40AF',
  gray: '#6B7280',
  outline: '#D1D5DB',
  error: '#EF4444',
  success: '#10B981',
};

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
  const {
    mutate: loginMutation,
    isPending,
    error: loginError,
  } = useLoginRestaurant();
  const styles = useMemo(() => createStyles(blueTheme), []);
  const { clearError, setError } = useAuthStore();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;
  const socialButtonsAnim = useRef(new Animated.Value(0)).current;

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

  // Run intro animations
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(formSlideAnim, {
          toValue: 0,
          tension: 35,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(socialButtonsAnim, {
        toValue: 1,
        tension: 30,
        friction: 6,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (!isConnected || !isInternetReachable) {
        return;
      }
      clearError();
      loginMutation(
        { email: data.email, password: data.password },
        {
          onSuccess: (response) => {
            const responseData = response.data as RestaurantLoginResponse;
            if (responseData?.data?.user) {
              const { setUser } = useAuthStore.getState();

              // ✅ Ensure all required fields in User are present
              const apiUser = responseData.data.user;
              const user: User = {
                id: apiUser.id,
                email: apiUser.email,
                fullName: apiUser.fullName,
                role: apiUser.role as 'customer' | 'restaurant',
                status: apiUser.status,
                isEmailVerified: apiUser.isEmailVerified,
                isPhoneVerified: apiUser.isPhoneVerified,
                phoneNumber: apiUser.phoneNumber || '',
              };

              setUser(user);
              // User is now authenticated through the setUser call
              navigation.getParent()?.navigate('RestaurantApp');
            }
          },
          onError: (error: any) => {
            setError(error?.message || t('login_failed_try_again'));
          },
        },
      );
    },
    [isConnected, isInternetReachable, loginMutation, clearError, setError, t, navigation],
  );

  // Social handlers
  const handleGoogleSignIn = useCallback(() => {
    console.log('Google login pressed');
  }, []);

  const handleAppleSignIn = useCallback(() => {
    console.log('Apple login pressed');
  }, []);

  return (
    <CommonView>
      <LinearGradient
        colors={[blueTheme.lightBlue, blueTheme.white, blueTheme.lightBlue]}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            {/* Back button */}
            <Animated.View 
              style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={blueTheme.primary} />
              </TouchableOpacity>
            </Animated.View>

            {/* Logo */}
            <Animated.View 
              style={[styles.logoContainer, { transform: [{ scale: logoScaleAnim }] }]}
            >
              <Animated.View 
                style={[styles.logoWrapper, { transform: [{ rotate: logoRotate }] }]}
              >
                <LinearGradient colors={[blueTheme.primary, blueTheme.primaryLight]} style={styles.logo}>
                  <Text style={styles.logoEmoji}>🍽️</Text>
                </LinearGradient>
              </Animated.View>
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.title}>{t('welcome_back')}</Text>
                <Text style={styles.subtitle}>Sign in to your restaurant dashboard</Text>
              </Animated.View>
            </Animated.View>

            {/* Form */}
            <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
              {/* Email */}
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
                      left={<TextInput.Icon icon="email-outline" color={blueTheme.primary} />}
                      style={styles.textInput}
                      outlineStyle={[styles.inputOutline, errors.email && styles.inputError]}
                      error={!!errors.email}
                      theme={{ colors: { primary: blueTheme.primary, outline: blueTheme.outline } }}
                    />
                    {errors.email && (
                      <HelperText type="error" visible={!!errors.email}>
                        {errors.email.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Password */}
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
                      left={<TextInput.Icon icon="lock-outline" color={blueTheme.primary} />}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          onPress={() => setShowPassword(!showPassword)}
                          color={blueTheme.primary}
                        />
                      }
                      style={styles.textInput}
                      outlineStyle={[styles.inputOutline, errors.password && styles.inputError]}
                      error={!!errors.password}
                      theme={{ colors: { primary: blueTheme.primary, outline: blueTheme.outline } }}
                    />
                    {errors.password && (
                      <HelperText type="error" visible={!!errors.password}>
                        {errors.password.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Remember / Forgot */}
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                    uncheckedColor={blueTheme.outline}
                    color={blueTheme.primary}
                  />
                  <Text style={styles.rememberMeText}>{t('remember_me')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPasswordText}>{t('forgot_password')}</Text>
                </TouchableOpacity>
              </View>

              {/* Error */}
              <ErrorDisplay error={loginError?.message || null} visible={!!loginError?.message} />

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isPending || !isValid}
                style={[styles.loginButton, (!isValid || isPending) && styles.loginButtonDisabled]}
              >
                <LinearGradient
                  colors={
                    isPending || !isValid
                      ? [blueTheme.outline, blueTheme.outline]
                      : [blueTheme.primary, blueTheme.primaryLight]
                  }
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {isPending ? t('logging_in') : t('login')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('or_signin_with')}</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ✅ Social Login Buttons */}
              <Animated.View 
                style={[
                  styles.socialButtonsContainer,
                  { opacity: socialButtonsAnim, transform: [{ translateY: socialButtonsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })}] }
                ]}
              >
                {/* Google */}
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={isPending}>
                  <Image source={googleLogo} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn} disabled={isPending}>
                  <Image source={appleLogo} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Signup */}
              <Animated.View style={[styles.signupContainer, { opacity: socialButtonsAnim }]}>
                <Text style={styles.signupPrompt}>{t('dont_have_account')} </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp', { userType: route.params?.userType || 'restaurant' })}>
                  <Text style={styles.signupLink}>{t('signup')}</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </CommonView>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  gradientBackground: { flex: 1 },
  scrollContainer: { flex: 1 },
  container: { flex: 1, minHeight: SCREEN_HEIGHT },

  header: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, marginTop: 40 },
  backButton: { padding: 10, borderRadius: 25, backgroundColor: theme.white },

  logoContainer: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 30 },
  logoWrapper: { marginBottom: 20 },
  logo: { width: 90, height: 90, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.darkBlue, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.gray, textAlign: 'center' },

  formContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  inputContainer: { marginBottom: 20 },
  textInput: { backgroundColor: theme.white, fontSize: 16, minHeight: 60 },
  inputOutline: { borderRadius: 15, borderWidth: 2, borderColor: theme.outline },
  inputError: { borderColor: theme.error },

  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  rememberMeContainer: { flexDirection: 'row', alignItems: 'center' },
  rememberMeText: { marginLeft: 8, color: theme.gray, fontSize: 14, fontWeight: '500' },
  forgotPasswordText: { color: theme.primary, fontSize: 14, fontWeight: '600' },

  loginButton: { borderRadius: 30, marginBottom: 30 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonGradient: { paddingVertical: 18, borderRadius: 30, alignItems: 'center', minHeight: 60 },
  loginButtonText: { fontSize: 18, fontWeight: 'bold', color: theme.white },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.outline },
  dividerText: { paddingHorizontal: 16, color: theme.gray, fontSize: 14, fontWeight: '500' },

  socialButtonsContainer: { flexDirection: 'column', gap: 15, marginBottom: 30 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.white, borderRadius: 25, paddingVertical: 16, borderWidth: 2, borderColor: theme.outline },
  socialIcon: { width: 24, height: 24, resizeMode: 'contain', marginRight: 8 },
  socialButtonText: { fontSize: 16, color: theme.gray, fontWeight: '600' },

  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signupPrompt: { color: theme.gray, fontSize: 16 },
  signupLink: { color: theme.primary, fontSize: 16, fontWeight: 'bold' },
});

export default RestaurantLoginScreen;
