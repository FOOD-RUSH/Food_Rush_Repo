import { ScrollView, StyleSheet, Text, TextInput,View } from 'react-native'
import OpacityButton from '../components/OpacityButton'
import React from 'react'

const LoginScreen = () => {
  return (
        <ScrollView className='bg-white'>
 <View className='flex flex-col p-4 space-x-1 ' >
     <Text className='text-4xl pb-2'>Login To Your <br/>Account</Text>
     <Text className='text-[16px] pb-2 text-neutral-500 mb-3'>please login into your account</Text>
      <Text className='text-[17px] font-bold pb-2 '>Email Address</Text>
      <TextInput placeholder='Enter email address' className='border-2 border-primaryColor h-10 w-full p-2 mb-2 mr-2 rounded-xl'/>
       <Text className='text-[17px] font-bold pb-2 '>Password</Text>
      <TextInput placeholder='Enter email address' className='border-2 border-primaryColor h-10 w-full p-2 mb-2 mr-2 bg-slate-100 rounded-xl'/>
      <Text className="text-primaryColor float-right mb-2" onPress={()=>{}}>Forgot passowrd? </Text>
      <OpacityButton label='Sign In' onpress={()=>{}} />
    </View>
        </ScrollView>
  )
}

export default LoginScreen

