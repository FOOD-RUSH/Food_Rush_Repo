import { View, Text } from 'react-native'
import React from 'react'
import { RootStackScreenProps } from '@/src/navigation/types'

const AdressScreen = ({navigation}: RootStackScreenProps<'AddressScreen'>) => {
  return (
    <View>
      <Text>AdressScreen</Text>
    </View>
  )
}

export default AdressScreen