import { View, Text, ImageBackground, Image, Button, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'



const Onboarding = () => {
    // onboarding information
    const onboardingInfo = [
        {
            heading: "We Serve Incomparable Delicacies",
            description: "All the best restaurant with thier top menu waiting for you, they can't wait for your order!!",
            backgroundImage: require("../../assets/images/background.png"),

        },
         {
            heading: "Fast Delivery , Fast Craving",
            description: "No more waiting lines, or traffic jams indulge in delicious and enjoy food from the comfort of your home",
            backgroundImage: require("../../assets/images/background2.png"),


        },
         {
            heading: "Crave It, We Deliver It",
            description: "Your one-stop app for all Cameroonian cuisines - spicy jollof rice to sweet puff-puff, Discover, Order & Enjoy the flavors!", 
            backgroundImage: require("../../assets/images/background3.png"),

        }
    
    ];
    //logo Image
    const logoImage = require("../../assets/images/Foodrushlogo.png");
    //function for progress bar 
    const [progress , setProgress] = useState(0);
    
    return (
    <ImageBackground source={onboardingInfo[0].backgroundImage} className='flex-1 flex-col items-start justify-between'>
            <Image source={logoImage} className='' height={50} width={50}/>
            <View className='h-[250px] w-[300px] bg-primaryColor justify-center items-center rounded-xl m-3 p-4 '>
                <Text className='text-center text-2xl text-white font-bold' >
                {onboardingInfo[0].heading}
                </Text>
                <Text className='text-[15px] color-white mt-2'>
                    {onboardingInfo[0].description}
                </Text>
                {/* progress bar */}
                <Text>Slider Button</Text>
                <View className='flex flex-row justify-between'>
                <TouchableHighlight className='color-primaryColor' >
                    <Text  className='text-xs'>next</Text>
                </TouchableHighlight>
                 <TouchableHighlight className='color-primaryColor' >
                    <Text  className='text-xs'>skip</Text>
                </TouchableHighlight>

            </View>
        </View>
    </ImageBackground>
  )
}

export default Onboarding