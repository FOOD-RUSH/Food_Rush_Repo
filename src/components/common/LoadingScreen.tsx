import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

const LoadingScreen = () => {
  return (
     <View className='flex-1 justify-center items-center'>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
  )
}

export default LoadingScreen