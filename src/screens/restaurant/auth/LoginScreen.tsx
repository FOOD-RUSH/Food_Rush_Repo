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
import { Checkbox, HelperText, TextInput, useTheme } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/AuthStore';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useLoginRestaurant } from '@/src/hooks/restaurant/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import { LinearGradient } from 'expo-linear-gradient';

// ✅ Add logo assets
const googleLogo = require('@/assets/images/google.png');
const appleLogo = require('@/assets/images/apple.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  }, [fadeAnim, formSlideAnim, logoRotateAnim, logoScaleAnim, slideAnim, socialButtonsAnim]);

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
      
      try {
        await loginMutation.mutateAsync({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        });

        console.log('🍽️ Restaurant login successful');
        
        // Navigate to restaurant app - the RootNavigator will handle routing based on auth state
        navigation.getParent()?.navigate('RestaurantApp');
      } catch (error: any) {
        console.error('🍽️ Restaurant login failed:', error);
        // Error is handled by React Query
      }
    },
    [isConnected, isInternetReachable, loginMutation, clearError, navigation],
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
        colors={[colors.surfaceVariant, colors.background, colors.surfaceVariant]}
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
                <Ionicons name="arrow-back" size={24} color={colors.primary} />
              </TouchableOpacity>
            </Animated.View>

            {/* Logo */}
            <Animated.View 
              style={[styles.logoContainer, { transform: [{ scale: logoScaleAnim }] }]}
            >
              <Animated.View 
                style={[styles.logoWrapper, { transform: [{ rotate: logoRotate }] }]}
              >
                <LinearGradient colors={[colors.primary, colors.primaryContainer]} style={styles.logo}>
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
                      left={<TextInput.Icon icon="email-outline" color={colors.primary} />}
                      style={styles.textInput}
                      outlineStyle={[styles.inputOutline, errors.email && styles.inputError]}
                      error={!!errors.email}
                      theme={{ colors: { primary: colors.primary, outline: colors.outline } }}
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
                      left={<TextInput.Icon icon="lock-outline" color={colors.primary} />}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          onPress={() => setShowPassword(!showPassword)}
                          color={colors.primary}
                        />
                      }
                      style={styles.textInput}
                      outlineStyle={[styles.inputOutline, errors.password && styles.inputError]}
                      error={!!errors.password}
                      theme={{ colors: { primary: colors.primary, outline: colors.outline } }}
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
                    uncheckedColor={colors.outline}
                    color={colors.primary}
                  />
                  <Text style={styles.rememberMeText}>{t('remember_me')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPasswordText}>{t('forgot_password')}</Text>
                </TouchableOpacity>
              </View>

              {/* Error */}
              <ErrorDisplay error={loginMutation.error?.message || authError || null} visible={!!(loginMutation.error?.message || authError)} />

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loginMutation.isPending || !isValid}
                style={[styles.loginButton, (!isValid || loginMutation.isPending) && styles.loginButtonDisabled]}
              >
                <LinearGradient
                  colors={
                    loginMutation.isPending || !isValid
                      ? [colors.outline, colors.outline]
                      : [colors.primary, colors.primaryContainer]
                  }
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {loginMutation.isPending ? t('logging_in') : t('login')}
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
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={loginMutation.isPending}>
                  <Image source={googleLogo} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn} disabled={loginMutation.isPending}>
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

const createStyles = (colors: any) => StyleSheet.create({
  gradientBackground: { flex: 1 },
  scrollContainer: { flex: 1 },
  container: { flex: 1, minHeight: SCREEN_HEIGHT },

  header: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 16, marginTop: 40 },
  backButton: { padding: 10, borderRadius: 25, backgroundColor: colors.surface },

  logoContainer: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 30 },
  logoWrapper: { marginBottom: 20 },
  logo: { width: 90, height: 90, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.onBackground, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.onSurfaceVariant, textAlign: 'center' },

  formContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  inputContainer: { marginBottom: 20 },
  textInput: { backgroundColor: colors.surface, fontSize: 16, minHeight: 60 },
  inputOutline: { borderRadius: 15, borderWidth: 2, borderColor: colors.outline },
  inputError: { borderColor: colors.error },

  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  rememberMeContainer: { flexDirection: 'row', alignItems: 'center' },
  rememberMeText: { marginLeft: 8, color: colors.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  forgotPasswordText: { color: colors.primary, fontSize: 14, fontWeight: '600' },

  loginButton: { borderRadius: 30, marginBottom: 30 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonGradient: { paddingVertical: 18, borderRadius: 30, alignItems: 'center', minHeight: 60 },
  loginButtonText: { fontSize: 18, fontWeight: 'bold', color: colors.onPrimary },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.outline },
  dividerText: { paddingHorizontal: 16, color: colors.onSurfaceVariant, fontSize: 14, fontWeight: '500' },

  socialButtonsContainer: { flexDirection: 'column', gap: 15, marginBottom: 30 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: 25, paddingVertical: 16, borderWidth: 2, borderColor: colors.outline },
  socialIcon: { width: 24, height: 24, resizeMode: 'contain', marginRight: 8 },
  socialButtonText: { fontSize: 16, color: colors.onSurfaceVariant, fontWeight: '600' },

  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signupPrompt: { color: colors.onSurfaceVariant, fontSize: 16 },
  signupLink: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
});

export default RestaurantLoginScreen;