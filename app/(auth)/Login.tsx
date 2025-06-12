import React, { useState } from 'react';
import { Image, ScrollView, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Button, Divider, HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/utils/validation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/config/firebase'; // Adjust path to your firebase config
// import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Uncomment if using Google Sign-in

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('User logged in successfully:', userCredential.user);
      // Navigate to main app screen
      // navigation.navigate('Home'); // Uncomment and adjust based on your navigation
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      // Uncomment and configure Google Sign-in
      /*
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log('Google sign-in successful:', userCredential.user);
      */
      console.log('Google sign-in pressed');
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Sign-in Error', 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen or show modal
    console.log('Forgot password pressed');
    // navigation.navigate('ForgotPassword'); // Uncomment and adjust
  };

  const logoImage = require("@/assets/images/Foodrushlogo.png");

  return (
    <ScrollView className="bg-white flex-1">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 leading-tight">
            Login To Your{'\n'}Account
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            Please login to your account
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <Controller
            key="formEmail"
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Email Address
                </Text>
                <TextInput
                  placeholder="Enter your email address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  outlineStyle={{ borderRadius: 12 }}
                  style={{ backgroundColor: 'white' }}
                  contentStyle={{ paddingHorizontal: 16 }}
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
            key="formPassword"
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Password
                </Text>
                <TextInput
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  outlineStyle={{ borderRadius: 12 }}
                  style={{ backgroundColor: 'white' }}
                  contentStyle={{ paddingHorizontal: 16 }}
                  error={!!errors.password}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {errors.password && (
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          {/* Forgot Password */}
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-blue-600 text-base font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            buttonColor="#0ea5e9"
            textColor="white"
            contentStyle={{ paddingVertical: 8 }}
            style={{ borderRadius: 12, marginTop: 24 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {/* Divider with "Or sign in with" */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">Or sign in with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Sign-in Button */}
          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            disabled={loading}
            icon="google"
            buttonColor="white"
            textColor="#374151"
            contentStyle={{ paddingVertical: 8 }}
            style={{ 
              borderRadius: 12, 
              borderColor: '#d1d5db',
              borderWidth: 1 
            }}
            labelStyle={{ fontSize: 16, fontWeight: '500' }}
          >
            Continue with Google
          </Button>

          {/* Logo */}
          <View className="items-center mt-8">
            <Image
              source={logoImage}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600 text-base">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => console.log('Navigate to sign up')}>
              <Text className="text-blue-600 text-base font-medium">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
