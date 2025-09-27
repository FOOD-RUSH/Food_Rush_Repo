import { IoniconsIcon } from '@/src/components/common/icons';
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
  Dimensions,
  ImageBackground,
  StatusBar,
  Animated,
} from 'react-native';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthStackScreenProps } from '@/src/navigation/types';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Heading1, Body } from '@/src/components/common/Typography';
import * as yup from 'yup';

interface Step1FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const step1Schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{9}$/, 'Phone number must be exactly 9 digits'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const { height } = Dimensions.get('window');
const RestaurantBgImage = require('@/assets/images/vendor_background.jpg');

const RestaurantSignupStep1: React.FC<
  AuthStackScreenProps<'RestaurantSignupStep1'>
> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();

  const [showPassword, setShowPassword] = useState(false);

  // Animations
  const overlayAnim = useRef(new Animated.Value(1)).current;
  const formAnim = useRef(new Animated.Value(height)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: yupResolver(step1Schema) as any,
    mode: 'onChange',
    defaultValues: {
      email: '',
      fullName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Memoized styles
  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 24,
      paddingTop: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 15,
    }),
    [colors.surface],
  );

  const buttonStyle = useMemo(
    () => ({
      borderRadius: 14,
      marginTop: 8,
    }),
    [],
  );

  // Entrance animations
  useEffect(() => {
    const animateEntrance = () => {
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(overlayAnim, {
            toValue: 0.5,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(formAnim, {
            toValue: height * 0.4,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    };

    animateEntrance();
  }, [formAnim, overlayAnim, titleAnim]);

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

  const onSubmit = useCallback(
    async (data: Step1FormData) => {
      if (!checkNetwork()) return;

      navigation.navigate('RestaurantSignupStep2', {
        step1Data: {
          ...data,
          phoneNumber: `+237${data.phoneNumber}`,
        },
      });
    },
    [checkNetwork, navigation],
  );

  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Image with Overlay */}
      <ImageBackground
        source={RestaurantBgImage}
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

      {/* Header */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          opacity: titleAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: 12,
            backdropFilter: 'blur(10px)',
          }}
        >
          <IoniconsIcon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Title Section */}
      <Animated.View
        style={{
          position: 'absolute',
          top: height * 0.15,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: titleAnim,
          transform: [
            {
              translateY: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: 16,
            marginBottom: 20,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Heading1
            style={{
              fontSize: 40,
              color: 'white',
            }}
          >
            🍽️
          </Heading1>
        </View>

        <Heading1
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            marginBottom: 8,
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
            fontFamily: 'Urbanist-Bold',
          }}
        >
          {t('create_Restaurant')}
        </Heading1>

        <Body
          style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontFamily: 'Urbanist-Medium',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 4,
          }}
        >
          {t('step_1')}
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
                marginBottom: 24,
              }}
            />

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 20 }}>
                  <TextInput
                    label="Email Address"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    mode="outlined"
                    left={<TextInput.Icon icon="email-outline" />}
                    error={!!errors.email}
                    style={{
                      backgroundColor: colors.surfaceVariant,
                      fontFamily: 'Urbanist-Regular',
                      borderRadius: 16,
                    }}
                    contentStyle={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 14,
                    }}
                  />
                  <HelperText type="error" visible={!!errors.email}>
                    {errors.email?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Full Name Input */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 20 }}>
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    autoComplete="name"
                    mode="outlined"
                    left={<TextInput.Icon icon="account-outline" />}
                    error={!!errors.fullName}
                    style={{
                      backgroundColor: colors.surfaceVariant,
                      fontFamily: 'Urbanist-Regular',
                      borderRadius: 16,
                    }}
                    contentStyle={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 14,
                    }}
                  />
                  <HelperText type="error" visible={!!errors.fullName}>
                    {errors.fullName?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Phone Number Input */}
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 20 }}>
                  <TextInput
                    label="Phone Number"
                    placeholder="690 000 000"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    mode="outlined"
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Body style={{ marginRight: 4, fontSize: 16 }}>
                              🇨🇲
                            </Body>
                            <Body
                              style={{
                                fontFamily: 'Urbanist-Medium',
                                fontSize: 14,
                                color: colors.onSurface,
                              }}
                            >
                              +237
                            </Body>
                          </View>
                        )}
                      />
                    }
                    error={!!errors.phoneNumber}
                    style={{
                      backgroundColor: colors.surfaceVariant,
                      fontFamily: 'Urbanist-Regular',
                    }}
                    contentStyle={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 14,
                    }}
                  />
                  <HelperText type="error" visible={!!errors.phoneNumber}>
                    {errors.phoneNumber?.message}
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
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        onPress={togglePassword}
                      />
                    }
                    error={!!errors.password}
                    style={{
                      backgroundColor: colors.surfaceVariant,
                      fontFamily: 'Urbanist-Regular',
                    }}
                    contentStyle={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 14,
                    }}
                  />
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Confirm Password Input */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ marginBottom: 32 }}>
                  <TextInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-outline" />}
                    error={!!errors.confirmPassword}
                    style={{
                      backgroundColor: colors.surfaceVariant,
                      fontFamily: 'Urbanist-Regular',
                    }}
                    contentStyle={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 14,
                    }}
                  />
                  <HelperText type="error" visible={!!errors.confirmPassword}>
                    {errors.confirmPassword?.message}
                  </HelperText>
                </View>
              )}
            />

            {/* Next Button */}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              style={buttonStyle}
              contentStyle={{ paddingVertical: 10 }}
              labelStyle={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Urbanist-Bold',
              }}
            >
              Next Step
            </Button>

            {/* Login Link */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 24,
              }}
            >
              <Body
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: 'Urbanist-Regular',
                }}
              >
                Already have an account?
              </Body>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SignIn', { userType: 'restaurant' })
                }
              >
                <Body
                  style={{
                    color: colors.primary,
                    fontFamily: 'Urbanist-Bold',
                  }}
                >
                  Sign In
                </Body>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default RestaurantSignupStep1;
