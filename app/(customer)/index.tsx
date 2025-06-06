import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

// IN HERE I CHECK FOR AUTHENTICATION


const CustomerIndex = () => {
  return (
     <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0ea5e9" />
    </View>
  )
}

export default CustomerIndex