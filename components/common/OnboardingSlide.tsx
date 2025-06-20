import { View, Text, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { Image } from 'react-native'
import React from 'react'
import { OnboardingSlide as onboardingInfo } from '@/types'
import { SafeAreaView } from 'react-native-safe-area-context'



const OnboardingSlide = (slide: onboardingInfo, next: Function, skip: Function) => {
      const relayLogo = require('@/assets/images/Foodrushlogo.png');

  return (
    <SafeAreaView className='flex-1 flex-col  items-center justify-between'>
        <ImageBackground className='flex-1' resizeMode='stretch' source={slide.image}>
            {/* foodrushLogo */}
            <View className='p-3 m-2' >
                <Image height={100} width={100} source={relayLogo}/> 
            </View>
            {/* container */}
            < View className='bg-primaryColor p-3 rounded-2xl text-center'>
                <Text className='text-[20px] mb-2'>
                    {slide.title}
                </Text>
                <Text className='text-[16px] mb-2 text-center'>
                    {slide.description}
                </Text>
                {/* ProgressIndicator TODO: */}
            </View>
            {/* Onboarding controls */}
            <View className='flex-row justify-between'>
                {/* Next Button */}
                <TouchableWithoutFeedback onPress={()=> next}>
                    <Text>Next</Text>
                </TouchableWithoutFeedback>

            </View>
            


        </ImageBackground>

    </SafeAreaView>
  )
}

export default OnboardingSlide