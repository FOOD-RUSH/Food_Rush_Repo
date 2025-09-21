import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Button,
  HelperText,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Heading2, Body } from '@/src/components/common/Typography';
import * as yup from 'yup';

// Only Cameroon country code
const COUNTRY_CODES = [
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
] as const;

interface Step1FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

type CountryCode = (typeof COUNTRY_CODES)[number];

// Validation schema for step 1
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
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const RestaurantSignupStep1: React.FC<AuthStackScreenProps<'RestaurantSignupStep1'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode] = useState<CountryCode>(COUNTRY_CODES[0]);

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

  const onSubmit = useCallback(
    async (data: Step1FormData) => {
      if (!isConnected || !isInternetReachable) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('no_internet_connection'),
          position: 'top',
        });
        return;
      }

      // Navigate to step 2 with step 1 data
      navigation.navigate('RestaurantSignupStep2', {
        step1Data: {
          ...data,
          phoneNumber: `${selectedCountryCode.code}${data.phoneNumber}`,
        },
      });
    },
    [isConnected, isInternetReachable, navigation, selectedCountryCode, t]
  );

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <CommonView>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {/* Logo and Title */}
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
              <Heading2 color={colors.onSurface} weight="bold" style={{ marginBottom: 8, fontFamily: 'Urbanist' }}>
                {t('create_account')} - Step 1
              </Heading2>
              <Body color={colors.onSurfaceVariant} style={{ textAlign: 'center', fontFamily: 'Urbanist' }}>
                Personal Information
              </Body>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('email')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      left={
                        <TextInput.Icon icon="email" color={colors.onSurface} />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.email && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
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
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('full_name')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="default"
                      autoCapitalize="words"
                      autoComplete="name"
                      left={
                        <TextInput.Icon
                          icon="account"
                          color={colors.onSurface}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.fullName && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.fullName}
                    />
                    {errors.fullName && (
                      <HelperText type="error" visible={!!errors.fullName}>
                        {errors.fullName.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Phone Number with Cameroon Prefix */}
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="690 000 000"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      left={
                        <TextInput.Icon 
                          icon={() => (
                            <View style={styles.cameroonPrefix}>
                              <Text style={{ marginRight: 4, fontSize: 16 }}>🇨🇲</Text>
                              <Text style={{ fontFamily: 'Urbanist', fontWeight: '500', color: colors.onSurface }}>+237</Text>
                            </View>
                          )}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.phoneNumber && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <HelperText type="error" visible={!!errors.phoneNumber}>
                        {errors.phoneNumber.message}
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
                      placeholder={t('password')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      left={
                        <TextInput.Icon icon="lock" color={colors.onSurface} />
                      }
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={togglePassword}
                          color={colors.onSurface}
                        />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.password && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
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

              {/* Confirm Password Input */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t('confirm_password')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      left={
                        <TextInput.Icon icon="lock" color={colors.onSurface} />
                      }
                      outlineStyle={[
                        styles.inputOutline,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      style={[styles.textInput, { fontFamily: 'Urbanist' }]}
                      contentStyle={[styles.inputContent, { fontFamily: 'Urbanist' }]}
                      error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <HelperText type="error" visible={!!errors.confirmPassword}>
                        {errors.confirmPassword.message}
                      </HelperText>
                    )}
                  </View>
                )}
              />

              {/* Next Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                buttonColor={colors.primary}
                contentStyle={styles.buttonContent}
                style={styles.nextButton}
                labelStyle={styles.nextButtonLabel}
              >
                Next Step
              </Button>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Body color={colors.onSurface}>
                  {t('already_have_account')}{' '}
                </Body>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignIn', { userType: 'restaurant' })}
                >
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    {t('login')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScrollView>
    </CommonView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    logoContainer: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    restaurantImage: {
      width: 120,
      height: 120,
      borderRadius: 20,
      marginBottom: 24,
    },
    formContainer: {
      paddingHorizontal: 8,
    },
    inputContainer: {
      marginBottom: 20,
    },
    textInput: {
      backgroundColor: colors.surfaceVariant,
      height: 64,
      fontFamily: 'Urbanist',
    },
    cameroonPrefix: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    inputOutline: {
      borderRadius: 12,
      borderColor: colors.surfaceVariant,
    },
    inputError: {
      borderColor: '#EF4444',
    },
    inputContent: {
      paddingHorizontal: 16,
      fontFamily: 'Urbanist',
      fontSize: 16,
    },
    nextButton: {
      borderRadius: 25,
      marginTop: 8,
    },
    buttonContent: {
      paddingVertical: 12,
    },
    nextButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    loginLinkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
  });

export default RestaurantSignupStep1;