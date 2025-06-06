import { Image, View ,Text} from 'react-native'
import React from 'react'
const OnboardingScreen = () => {
  const relayLogo = require("../../assets/images/foodrush.svg");
  const gif = require("../../assets/images/Delivery.gif");

  return (
    <View className='flex flex-col p-4 justify-between bg-white items-center'>
      <Image source={relayLogo} />
      <View className='m-3 overflow-hidden'>
        <Image source={gif} className="h-[70px] w-[70px] p-3 m-3" height={70} width={70} />
      </View>
      <View>
         <Text className="text-3xl text-blueTextcolor justify-center font-bold mb-2">Welcome to Food Rush</Text>
      <Text className='text-[16px] pb-2 text-neutral-500 mb-3 '>healthy meals delivered locally <br/>by the tap of a button</Text>
      </View>

    </View>
  )
}

export default OnboardingScreen

