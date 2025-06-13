import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { emailValidation } from '@/utils/validation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';

const ForgotPassword = () => {
  // EMAIL SCHEMA
  const schema = yup.object({
    email: emailValidation,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });
  //handle forgot password
  const handleForgotPassword = () => {
    console.log();
  };

  return (
    <SafeAreaView>
      <View className="flex flex-1 bg-white px-6 py-8">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 leading-tight">
            Forgot your Password ?
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            Enter your email so that we could send your email to verify your
            account
          </Text>
        </View>
        {/* email input */}
        <Controller
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
                right={
                  <TextInput.Icon
                    icon="close-circle-outline"
                    onPress={() => onChange('')}
                  />
                }
              />
              {errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email.message}
                </HelperText>
              )}
            </View>
          )}
        />
        {/* forgot Password Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(handleForgotPassword)}
          buttonColor="#007aff"
          textColor="white"
          contentStyle={{ paddingVertical: 8 }}
          style={{ borderRadius: 12, marginTop: 24 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
