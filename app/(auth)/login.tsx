import React, { useState } from 'react';
import { ScrollView, Text, View, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/utils/validation';
import { TextButton } from '@/components/common/TextButton';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { signInUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  interface LoginFormData {
    email: string;
    password: string;
  }
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { error, isLoading } = useSelector((state: RootState) => state.auth);

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
  const router = useRouter();


const onSubmit = async (data: LoginFormData) => {
  try {
    await dispatch(signInUser({
      email: data.email,
      password: data.password
    })).unwrap();
    
    router.replace('/(customer)/(tabs)/HomeScreen');
  } catch (error: any) {
    Alert.alert('Login Failed', error.message || 'Authentication error');
  }
};

  // const onSubmit = (data: LoginFormData) => {
  //   dispatch(signInUser({ email: data.email, password: data.password }))
  //     .unwrap()
  //     .then(() => {
  //       Alert.alert('Login Successful', 'You have successfully logged in.');
  //       router.replace('/(customer)/(tabs)/HomeScreen');
  //     })
  //     .catch((err: any) => {
  //       Alert.alert('Login Error', err?.message || 'An error occurred during login.');
  //     });
  // };

  const handleGoogleSignIn = async () => {
    // Implement Google Sign-in logic
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 leading-tight">
            Login To Your{'\n'}Account
          </Text>
          <Text className="text-base text-gray-500 mt-2">
              Please login to your account.
          </Text>
        </View>

        <View className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">Email Address</Text>
                <TextInput
                  placeholder="Enter your email address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                />
                  {errors.email && <HelperText type="error">{errors.email.message}</HelperText>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  error={!!errors.password}
                    right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
                  />
                  {errors.password && <HelperText type="error">{errors.password.message}</HelperText>}
              </View>
            )}
          />

          <View className="flex-row justify-end">
              <TextButton text="Forgot password?" onPress={handleForgotPassword} />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
            contentStyle={{ paddingVertical: 8 }}
              style={{ marginTop: 24 }}
          >
              {isLoading ? 'Logging in...' : 'Login'}
          </Button>

            {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">Or sign in with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
              disabled={isLoading}
            icon="google"
          >
            Continue with Google
          </Button>

          <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-base">Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text className="text-primaryColor text-base font-medium">Sign Up</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

