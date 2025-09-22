import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  TextInput,
  HelperText,
  Checkbox,
  useTheme,
  Card,
  IconButton,
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
import { Heading1, Body, Label } from '@/src/components/common/Typography';

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

  // Animation values (useRef to persist across renders)
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeInAnim, slideUpAnim, scaleAnim]);

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient Background */}
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60%',
          backgroundColor: colors.primary,
          opacity: 0.03,
        }}
      />
      
      <CommonView>
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleGoBack}
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 60 : 20,
            left: 20,
            zIndex: 100,
          }}
        >
          <IconButton
            icon="arrow-left"
            size={28}
            iconColor={colors.primary}
            style={{
              backgroundColor: colors.surface,
              elevation: 4,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Welcome Section with Enhanced Design */}
            <Animated.View 
              style={{
                opacity: fadeInAnim,
                transform: [{ scale: scaleAnim }],
              }}
              className="items-center px-6 pt-16 pb-8"
            >
              {/* Floating Card for Welcome Image */}
              <Card 
                style={{
                  backgroundColor: colors.surface,
                  elevation: 12,
                  borderRadius: 32,
                  padding: 32,
                  marginBottom: 24,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 24,
                }}
              >
                <View className="items-center justify-center">
                  <Image 
                    className="w-32 h-32" 
                    source={WelcomeImage}
                    style={{ tintColor: colors.primary }}
                  />
                </View>
              </Card>

              <Heading1
                color={colors.onSurface}
                weight="bold"
                style={{ 
                  marginBottom: 8,
                  fontSize: 32,
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}
              >
                {t('welcome_back')}
              </Heading1>
              
              <Body
                color={colors.onSurfaceVariant}
                style={{ 
                  textAlign: 'center',
                  fontSize: 16,
                  opacity: 0.8,
                  marginBottom: 16,
                }}
              >
                Sign in to continue your journey
              </Body>
            </Animated.View>

            {/* Enhanced Form Card */}
            <Animated.View
              style={{
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }],
              }}
              className="flex-1 px-4"
            >
              <Card
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 32,
                  padding: 24,
                  marginHorizontal: 8,
                  elevation: 8,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                }}
              >
                <View className="space-y-6">
                  {/* Email Input with Enhanced Styling */}
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className="mb-2">
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
                            <TextInput.Icon 
                              icon="email" 
                              color={errors.email ? colors.error : colors.primary} 
                            />
                          }
                          outlineStyle={{
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: errors.email
                              ? colors.error
                              : value 
                                ? colors.primary 
                                : colors.outline,
                          }}
                          style={{ 
                            backgroundColor: colors.surfaceVariant,
                            fontSize: 16,
                          }}
                          contentStyle={{
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            color: colors.onSurface,
                          }}
                          placeholderTextColor={colors.onSurfaceVariant}
                          error={!!errors.email}
                        />
                        {errors.email && (
                          <HelperText 
                            type="error" 
                            visible={!!errors.email}
                            style={{ marginLeft: 16, marginTop: 4 }}
                          >
                            {errors.email.message}
                          </HelperText>
                        )}
                      </View>
                    )}
                  />

                  {/* Password Input with Enhanced Styling */}
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
                            <TextInput.Icon 
                              icon="lock" 
                              color={errors.password ? colors.error : colors.primary} 
                            />
                          }
                          right={
                            <TextInput.Icon
                              icon={showPassword ? 'eye-off' : 'eye'}
                              onPress={() => setShowPassword(!showPassword)}
                              color={colors.primary}
                            />
                          }
                          outlineStyle={{
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: errors.password
                              ? colors.error
                              : value 
                                ? colors.primary 
                                : colors.outline,
                          }}
                          style={{ 
                            backgroundColor: colors.surfaceVariant,
                            fontSize: 16,
                          }}
                          contentStyle={{ 
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            color: colors.onSurface,
                          }}
                          placeholderTextColor={colors.onSurfaceVariant}
                          error={!!errors.password}
                        />
                        {errors.password && (
                          <HelperText 
                            type="error" 
                            visible={!!errors.password}
                            style={{ marginLeft: 16, marginTop: 4 }}
                          >
                            {errors.password.message}
                          </HelperText>
                        )}
                      </View>
                    )}
                  />

                  {/* Remember Me & Forgot Password */}
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <Checkbox
                        status={rememberMe ? 'checked' : 'unchecked'}
                        onPress={() => setRememberMe(!rememberMe)}
                        color={colors.primary}
                      />
                      <Body
                        color={colors.onSurface}
                        style={{ marginLeft: 8, fontSize: 15 }}
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

                  {/* Enhanced Login Button */}
                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                    buttonColor={colors.primary}
                    contentStyle={{ 
                      paddingVertical: 16,
                      paddingHorizontal: 24,
                    }}
                    style={{ 
                      borderRadius: 28,
                      marginTop: 8,
                      elevation: 4,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                    labelStyle={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'white',
                      letterSpacing: 0.5,
                    }}
                  >
                    {loginMutation.isPending ? t('logging_in') : t('login')}
                  </Button>

                  {/* Enhanced Divider */}
                  <View className="flex-row items-center my-8">
                    <View
                      className="flex-1 h-0.5"
                      style={{ backgroundColor: colors.outline }}
                    />
                    <Label
                      color={colors.onSurfaceVariant}
                      style={{ 
                        paddingHorizontal: 20,
                        fontSize: 14,
                        fontWeight: '500',
                        backgroundColor: colors.surface,
                      }}
                    >
                      or sign in with
                    </Label>
                    <View
                      className="flex-1 h-0.5"
                      style={{ backgroundColor: colors.outline }}
                    />
                  </View>

                  {/* Enhanced Social Login Buttons */}
                  <View className="flex-row justify-between space-x-4">
                    <Button
                      mode="outlined"
                      onPress={handleGoogleSignIn}
                      disabled={loginMutation.isPending}
                      icon="google"
                      contentStyle={{ 
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        flexDirection: 'row-reverse',
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 20,
                        borderColor: colors.outline,
                        borderWidth: 1.5,
                        marginRight: 8,
                        backgroundColor: colors.surface,
                      }}
                      labelStyle={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.onSurface,
                        marginRight: 8,
                      }}
                    >
                      Google
                    </Button>

                    <Button
                      mode="outlined"
                      onPress={handleAppleSignIn}
                      disabled={loginMutation.isPending}
                      icon="apple"
                      contentStyle={{ 
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        flexDirection: 'row-reverse',
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 20,
                        borderColor: colors.outline,
                        borderWidth: 1.5,
                        marginLeft: 8,
                        backgroundColor: colors.surface,
                      }}
                      labelStyle={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.onSurface,
                        marginRight: 8,
                      }}
                    >
                      Apple
                    </Button>
                  </View>

                  {/* Enhanced Sign Up Link */}
                  <View className="flex-row items-center justify-center mt-6 mb-2">
                    <Body
                      color={colors.onSurfaceVariant}
                      style={{ fontSize: 15 }}
                    >
                      {t('dont_have_account')}{' '}
                    </Body>
                    <TextButton 
                      text={t('signup')} 
                      onPress={handleSignUp}
                    />
                  </View>
                </View>
              </Card>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </CommonView>
    </View>
  );
};

export default LoginScreen;