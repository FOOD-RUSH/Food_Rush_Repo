import { ScrollView, Text,View } from 'react-native'
import { TextInput } from 'react-native-paper'
import OpacityButton from '@/components/common/OpacityButton'
import React, { useState } from 'react'

const LoginScreen = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  return (
        <ScrollView className='bg-white'>
 <View className='flex flex-col p-4 space-x-1 ' >
     <Text className='text-4xl pb-2'>Login To Your <br/>Account</Text>
     <Text className='text-[16px] pb-2 text-neutral-500 mb-3'>please login into your account</Text>
      <Text className='text-[17px] font-bold pb-2 '>Email Address</Text>
      <TextInput placeholder='Enter email address' className='border-2 border-primaryColor h-10 w-full p-2 mb-2 mr-2 rounded-xl' keyboardType='email-address' />

       <Text className='text-[17px] font-bold pb-2 '>Password</Text>
      <TextInput 
      placeholder='Enter Password' 
      className='border-2 border-primaryColor h-10 w-full p-2 mb-2 mr-2 bg-slate-100 rounded-xl'
      // onChange={set}
      outlineStyle= ''
      value={Email}
      />
      <Text className="text-primaryColor float-right mb-2" onPress={()=>{}}>Forgot passowrd? </Text>
      <OpacityButton label='Sign In' onpress={()=>{}} />
    </View>
        </ScrollView>
  )
}

export default LoginScreen

