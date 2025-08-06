import { View, Text } from 'react-native'
import React from 'react'
import { RootStackScreenProps } from '@/src/navigation/types'
import CommonView from '@/src/components/common/CommonView'

const AdressScreen = ({navigation}: RootStackScreenProps<'AddressScreen'>) => {
  return (
    <CommonView>
      <Text>AdressScreen</Text>
    </CommonView>
  )
}

export default AdressScreen