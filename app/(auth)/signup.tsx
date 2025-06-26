import React, { useState } from 'react';
import { ScrollView, Text, View, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { signUpUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  interface SignupFormData {
    displayName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { error, isLoading } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });
  const router = useRouter();

  const onSubmit = (data: SignupFormData) => {
    dispatch(signUpUser({ email: data.email, password: data.password }))
      .unwrap()
      .then(() => {
        Alert.alert('Signup Successful', 'Your account has been created.');
        router.replace('/');
      })
      .catch((err: any) => {
        Alert.alert('Signup Error', err?.message || 'An error occurred during signup.');
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 leading-tight">
              Create Account
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Please fill in the details to create your account.
            </Text>
          </View>

          <View className="space-y-4">
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">Full Name</Text>
                  <TextInput
                    placeholder="Enter your full name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    autoCapitalize="words"
                    error={!!errors.displayName}
                  />
                  {errors.displayName && <HelperText type="error">{errors.displayName.message}</HelperText>}
                </View>
              )}
            />

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
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">Phone Number</Text>
                  <TextInput
                    placeholder="Enter your phone number"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    error={!!errors.phoneNumber}
                  />
                  {errors.phoneNumber && <HelperText type="error">{errors.phoneNumber.message}</HelperText>}
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">Confirm Password</Text>
                  <TextInput
                    placeholder="Confirm your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    secureTextEntry={!showConfirmPassword}
                    error={!!errors.confirmPassword}
                    right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                  />
                  {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword.message}</HelperText>}
                </View>
              )}
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              contentStyle={{ paddingVertical: 8 }}
              style={{ marginTop: 24 }}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>

            {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-primaryColor text-base font-medium">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
