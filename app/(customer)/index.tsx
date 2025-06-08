import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

// IN HERE I CHECK FOR AUTHENTICATION


const CustomerIndex = () => {
  // dummy authentication check to see if it works 
  const router = useRouter();
  // dummy authentication setup, firebase setup still to be done 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(()=> {
    if (isAuthenticated)
    {
      // redirect to home tab
      // router.replace('/(customer)/(tabs)/home');
    }
    else {
      // redirect to login
      // router.replace('/(auth)/login');
    }
  }, )
  return (
     <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0ea5e9" />
    </View>
  )
}

export default CustomerIndex