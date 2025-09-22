import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
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

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<AuthStackScreenProps<'SignIn'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const overlayAnim = useRef(new Animated.Value(1)).current;
  const formAnim = useRef(new Animated.Value(height)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

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

  const userType = route.params?.userType;
  const WelcomeImage = require('@/assets/images/Welcome.png');
  const { clearError } = useAuthStore();

  const loginMutation = useLogin();
  const { error: authError } = useAuthStore();

  // Staggered entrance animations
  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(formAnim, {
          toValue: height * 0.35,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (!isConnected || !isInternetReachable) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: 'No internet connection. Please check your network settings.',
          position: 'top',
        });
        return;
      }

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

        navigation.getParent()?.navigate('CustomerApp');
      } catch (error: any) {
        console.error('Customer login failed:', error);
        
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
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image with Overlay */}
      <ImageBackground
        source={WelcomeImage}
        style={{ 
          position: 'absolute',
          top: -10,
          left: 15,
          right: 0,
          bottom: 10,
          width: 400,
          height: 400,
        }}
        resizeMode="cover"
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${overlayAnim})`,
          }}
        />
      </ImageBackground>

      {/* Welcome Title Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: height * 0.12,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: titleAnim,
          transform: [{
            translateY: titleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })
          }],
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
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          Sign in to continue
        </Body>
      </Animated.View>

      {/* Sliding Form Container */}
      <Animated.View
        style={{
          position: 'absolute',
          top: formAnim,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingTop: 24,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
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
            <View style={{ marginBottom: 16 }}>
              <Label style={{ 
                color: colors.onSurfaceVariant, 
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Email Address
              </Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View
                      style={{
                        backgroundColor: colors.surfaceVariant,
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: errors.email 
                          ? colors.error 
                          : emailFocused 
                            ? colors.primary 
                            : colors.outline,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <TextInput.Icon 
                        icon="email-outline" 
                        color={emailFocused ? colors.primary : colors.onSurfaceVariant}
                        size={20}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        placeholder="Enter your email"
                        onBlur={() => {
                          onBlur();
                          setEmailFocused(false);
                        }}
                        onFocus={() => setEmailFocused(true)}
                        onChangeText={onChange}
                        value={value}
                        mode="flat"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        style={{
                          flex: 1,
                          backgroundColor: 'transparent',
                          fontSize: 16,
                        }}
                        contentStyle={{
                          backgroundColor: 'transparent',
                          paddingHorizontal: 0,
                          paddingVertical: 0,
                        }}
                        underlineStyle={{ display: 'none' }}
                        placeholderTextColor={colors.onSurfaceVariant}
                      />
                    </View>
                    {errors.email && (
                      <HelperText 
                        type="error" 
                        visible={!!errors.email}
                        style={{ marginLeft: 4, marginTop: 4 }}
                      >
                        {errors.email.message}
                      </HelperText>
                    )}
                  </>
                )}
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20 }}>
              <Label style={{ 
                color: colors.onSurfaceVariant, 
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Password
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View
                      style={{
                        backgroundColor: colors.surfaceVariant,
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: errors.password 
                          ? colors.error 
                          : passwordFocused 
                            ? colors.primary 
                            : colors.outline,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <TextInput.Icon 
                        icon="lock-outline" 
                        color={passwordFocused ? colors.primary : colors.onSurfaceVariant}
                        size={20}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        placeholder="Enter your password"
                        onBlur={() => {
                          onBlur();
                          setPasswordFocused(false);
                        }}
                        onFocus={() => setPasswordFocused(true)}
                        onChangeText={onChange}
                        value={value}
                        mode="flat"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        style={{
                          flex: 1,
                          backgroundColor: 'transparent',
                          fontSize: 16,
                        }}
                        contentStyle={{
                          backgroundColor: 'transparent',
                          paddingHorizontal: 0,
                          paddingVertical: 0,
                        }}
                        underlineStyle={{ display: 'none' }}
                        placeholderTextColor={colors.onSurfaceVariant}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{ paddingLeft: 8 }}
                      >
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          color={colors.primary}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <HelperText 
                        type="error" 
                        visible={!!errors.password}
                        style={{ marginLeft: 4, marginTop: 4 }}
                      >
                        {errors.password.message}
                      </HelperText>
                    )}
                  </>
                )}
              />
            </View>

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
                onPress={() => setRememberMe(!rememberMe)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Checkbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                  color={colors.primary}
                />
                <Body style={{ marginLeft: 4, color: colors.onSurface }}>
                  Remember me
                </Body>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Body style={{ color: colors.primary, fontWeight: '600' }}>
                  Forgot Password?
                </Body>
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
              disabled={loginMutation.isPending}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingVertical: 18,
                marginBottom: 24,
                opacity: loginMutation.isPending ? 0.7 : 1,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Body
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 17,
                  fontWeight: '700',
                }}
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Body>
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginVertical: 24,
            }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.outline }} />
              <Body 
                style={{ 
                  marginHorizontal: 16, 
                  color: colors.onSurfaceVariant,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                or sign in with
              </Body>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.outline }} />
            </View>

            {/* Social Login Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                disabled={loginMutation.isPending}
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: 14,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: colors.outline,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TextInput.Icon icon="google" size={50} color={colors.onSurfaceVariant } opacity={0.2} />
                <Body style={{ marginLeft: 8, color: colors.onSurfaceVariant, fontWeight: '600' }}>
                  Google
                </Body>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAppleSignIn}
                disabled={loginMutation.isPending}
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: 14,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: colors.outline,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TextInput.Icon icon="apple" size={50} color={colors.onSurfaceVariant} opacity={0.2} />
                <Body style={{ marginLeft: 8, color: colors.onSurfaceVariant, fontWeight: '600' }}>
                  Apple
                </Body>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingBottom: 20,
            }}>
              <Body style={{ color: colors.onSurfaceVariant }}>
                Don't have an account?{' '}
              </Body>
              <TouchableOpacity onPress={handleSignUp}>
                <Body style={{ color: colors.primary, fontWeight: '700' }}>
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