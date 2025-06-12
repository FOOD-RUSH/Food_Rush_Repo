import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button,  Checkbox,  HelperText, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {registerSchema} from '@/utils/validation';
import { TextButton } from '@/components/common/TextButton';

 const Signup = () => {
//interface for sign up
 interface SignUpFormData {
    email: string;
    displayName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;

 }
 // Boolean variables 
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 
//  form controller for register customer
  const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
     resolver: yupResolver(registerSchema),
     defaultValues: {
       email: '',
       password: '',
       confirmPassword: '',
       phoneNumber: '',
       displayName: ''
     }
   });
//on Submit 
 const onSubmit = (data: SignUpFormData) => {
    setLoading(true);
    // logic  for onSubmit , should be async
 }
const handleLogin = () => {
    // navigate to login for customer
}

  return (

   <SafeAreaView>
    <ScrollView className='flex-1 bg-white '>
        <View className='flex-1 px-6 py-8'>
            {/* Header */}
             <View className="mb-8">
                      <Text className="text-4xl font-bold text-gray-900 leading-tight">
                       Create Your{'\n'}Account
                      </Text>
                      <Text className="text-base text-gray-500 mt-2">
                        Create an account to start looking for the food you like
                      </Text>
            </View>
            {/* Login Form */}
            <View className='space-y-4'>
                {/* username Input */}
                <Controller 
                    key='formUsername'
                    control={control}
                    name='displayName'
                    render={({field: {onChange, onBlur, value}}) => (

                        <View> 
                            <Text className='text-base font-semibold text-gray-900 mb-2'>
                                Username
                            </Text>
                            <TextInput
                                placeholder='Enter your username'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                mode='outlined'
                                keyboardType='default'
                                autoCapitalize='none'
                                autoComplete='name'
                                outlineStyle= {{borderRadius: 12}}
                                style={{backgroundColor: 'white'}}
                                contentStyle= {{paddingHorizontal: 16}}
                                error={!!errors.displayName}
                            />
                            {errors.displayName && (
                                <HelperText type='error' visible={!!errors.displayName}>
                                    {errors.displayName.message}
                                </HelperText>
                            )}
                        </View>
                    )}
                />
                {/* email controller */}
                 <Controller 
                    key='formEmail'
                    control={control}
                    name='email'
                    render={({field: {onChange, onBlur, value}}) => (

                        <View> 
                            <Text className='text-base font-semibold text-gray-900 mb-2'>
                                Email address
                            </Text>
                            <TextInput
                                placeholder='Enter your email'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                mode='outlined'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoComplete='email'
                                outlineStyle= {{borderRadius: 12}}
                                style={{backgroundColor: 'white'}}
                                contentStyle= {{paddingHorizontal: 16}}
                                error={!!errors.email}
                            />
                            {errors.email && (
                                <HelperText type='error' visible={!!errors.email}>
                                    {errors.email.message}
                                </HelperText>
                            )}
                        </View>
                    )}
                />
                
                {/* phone number controller */}

                {/* password controller */}
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
                {/* confirmPassword controller */}
                <Controller
                            key="formPassword"
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                              <View>
                                <Text className="text-base font-semibold text-gray-900 mb-2">
                                  Confirm Password
                                </Text>
                                <TextInput
                                  placeholder="Confirm your password"
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
                                {errors.confirmPassword && (
                                  <HelperText type="error" visible={!!errors.password}>
                                    {errors.confirmPassword.message}
                                  </HelperText>
                                )}
                              </View>
                            )}
                          />

                           {/* terms of privacy  */}
                    <View className='flex flex-row'>
                        <Checkbox 
                   status='unchecked'
                   onPress={()=> {}}
                   color='#007aff'
                   uncheckedColor='white'
                   />
                   <Text className=''>I agree with </Text> <TextButton text='terms of service' onPress={()=> {}} /> and <TextButton text='privacy Policy' onPress={()=> {}} /> 
                    </View>
                          {/* Register Buttton */}
                          <Button
                          mode='outlined'
                          onPress={handleSubmit(onSubmit)}
                          loading={loading}
                          disabled={loading}
                          buttonColor='#007aff'
                          contentStyle={{paddingVertical: 8}}
                          style={{borderRadius: 12, marginTop: 24}}
                          labelStyle={{fontSize: 16, fontWeight: '600'}}
                          >
                            {loading ? 'Registering ...' : 'Register'}
                          </Button>
                    
                   
                    
                      {/* Divider with "Or sign in with" */}
                              <View className="flex-row items-center my-6">
                                <View className="flex-1 h-px bg-gray-300" />
                                <Text className="px-4 text-gray-500 text-sm">Or sign in with</Text>
                                <View className="flex-1 h-px bg-gray-300" />
                              </View>
                    
                
            </View>

        </View>

    </ScrollView>
   </SafeAreaView>
  )
}

export default Signup;