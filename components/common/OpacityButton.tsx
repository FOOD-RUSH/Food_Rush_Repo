import { TouchableOpacity, Text} from 'react-native'
import React from 'react'

type ButtonProps = {
    label: string;
    onpress: () => void;
}

const OpacityButton = ({label,onpress}: ButtonProps) => {
  return (
    <TouchableOpacity className='h-10 bg-primaryColor w-full rounded-[20px] m-2 ' onPress={onpress} activeOpacity={0.5}>
        <Text className='text-white p-2 text-center font-bold'>{label} </Text>
    </TouchableOpacity>
  )
}

export default OpacityButton

