import { ScrollView, Text,View } from 'react-native'
import { Button, HelperText, TextInput } from 'react-native-paper'
import OpacityButton from '@/components/common/OpacityButton'
import React, { useState } from 'react'
import { loginSchema } from '@/utils/validation'
import {Controller, useForm} from 'react-hook-form'
import { ObjectSchema, AnyObject } from 'yup'

//import library for the react-hook-form

const LoginScreen = () => {
 
  const [showPassword, setShowPassword] = useState(false);
  //setting up for form handling
  const {control, handleSubmit, formState: {errors}} = useForm({
    resolver: YupResolver(loginSchema)
  })
  const onSubmit = (data: object) => {
    console.log(data)
  }

  return (
  <ScrollView className='bg-white'>
 <View className='flex flex-col p-4 space-x-1 ' >
     <Text className='text-4xl pb-2'>Login To Your <br/>Account</Text>

     <Text className='text-[16px] pb-2 text-neutral-500 mb-3'>please login into your account</Text>
     {/* wrap the tags into the controller  */}
     {/* email input  */}
      <Controller key='formEmail'
      control={control}
      rules={{
        required: true
      }}
      render={({
        field : {onChange, onBlur, value}
      }) => (
        <>
      <Text className='text-[17px] font-bold pb-2 '>Email Address</Text>
      <TextInput  placeholder='Enter your Email address'
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        mode='outlined'
        inputMode='email'
      />
            {errors.email && (<HelperText type='error' > {errors.email.message } </HelperText>)}

      </>)}
      name='email'
      
      />

      {/* Password controller */}
 <Controller key='formPassword'
      control={control}
      rules={{
        required: true
      }}
      render={({
        field : {onChange, onBlur, value}
      }) => (
        <>
      <Text className='text-[17px] font-bold pb-2 '>Password</Text>
      <TextInput  placeholder='Enter your Password'
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        mode='outlined'
      
      />
            {errors.email && (<HelperText type='error' > {errors.email.message} </HelperText>)}

      </>)}
      name='Password'
      />
    

     

      
      <Text className="text-primaryColor float-right mb-2" onPress={()=>{}}>Forgot passowrd? </Text>
        <Button onPress={handleSubmit(onSubmit)} className='bg-primaryColor mb-2' mode='contained-tonal' >Login</Button>
    </View>
        </ScrollView>
  )
}

export default LoginScreen

function YupResolver(loginSchema: ObjectSchema<{ email: string; password: string }, AnyObject, { email: undefined; password: undefined }, "">): import("react-hook-form").Resolver<import("react-hook-form").FieldValues, any, import("react-hook-form").FieldValues> | undefined {
  throw new Error('Function not implemented.')
}

