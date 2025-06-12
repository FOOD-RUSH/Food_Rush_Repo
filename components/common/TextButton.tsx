import { Text, TouchableOpacity } from 'react-native'
import React from 'react'



export const TextButton = ({text, onPress}) => {
    
  return (
     <TouchableOpacity onPress={onPress}>
                  <Text className="text-primaryColor text-base font-medium">
                    {text}
                  </Text>
    </TouchableOpacity>
  )
}

