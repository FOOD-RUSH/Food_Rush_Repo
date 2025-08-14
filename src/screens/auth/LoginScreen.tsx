import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
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
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';

interface LoginFormData {
  email: string;
  password: string;
}
const LoginScreen: React.FC<AuthStackScreenProps<'SignIn'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();

  useLayoutEffect(() => {});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const loginUser = useAuthStore((state) => state.loginUser);
  // const loginError = useAuthStore((state) => state.error);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    // TODO:
    console.log('Usertype: ' + userType);
    try {
      await loginUser('customer', data.email.trim(), data.password);
      // navigate to homer
      navigation.navigate('CustomerApp', {
        screen: 'Home',
        params: {
          screen: 'HomeScreen',
        },
      });
    } catch (error) {
      Alert.alert('Login failed' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // TODO:
  };

  const handleAppleSignIn = async () => {
    // TODO:
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Navigating to forgot password');
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    // TODO: Navigate to signup screen
    console.log('Navigating to signup');
    navigation.navigate('SignUp', { userType: userType });
  };

  return (
    // ADD LOGIC FOR SIGNING IN USER AND SIGNING IN CUSTOMER
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
            <Text
              className={`text-3xl font-bold mb-2 `}
              style={{ color: colors.onSurface }}
            >
              Welcome Back
            </Text>
          </View>
          {/* Error Message */}
          {/* {error && (
            <Text className="text-red-500 bg-gray-400 text-center text-sm mt-2 h-10 w-40">
              {error}
            </Text>
          )} */}
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
                      placeholder="Email"
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
                      placeholder="Password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password"
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
                        borderColor: errors.email
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
                  <Text
                    className={`text-base ml-2 `}
                    style={{ color: colors.onSurface }}
                  >
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
                buttonColor={colors.primary}
                contentStyle={{ paddingVertical: 12 }}
                style={{ borderRadius: 25, marginTop: 16 }}
                labelStyle={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View
                  className={`flex-1 h-px`}
                  style={{ backgroundColor: colors.outline }}
                />
                <Text className={`px-4 text-sm text-[${colors.onSurface}]`}>
                  {' '}
                  or Sign in{' '}
                </Text>
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
                  disabled={loading}
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
                  disabled={loading}
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
                <Text className={`text-base text-[${colors.onSurface}]`}>
                  Don&apos;t Already have an account?{' '}
                </Text>
                <TextButton text="Sign Up" onPress={handleSignUp} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CommonView>
  );
};
export default LoginScreen;
