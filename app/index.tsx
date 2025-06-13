import { Link } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableHighlight,
} from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold">Edit app/index.tsx to edit this screen.</Text>
      <Link href="./(auth)/Login">Login </Link>
    </View>
  );
}

const Onboarding = () => {
  // onboarding information
  const onboardingInfo = [
    {
      heading: 'We Serve Incomparable Delicacies',
      description:
        "All the best restaurant with thier top menu waiting for you, they can't wait for your order!!",
      backgroundImage: require('@/assets/images/background.png'),
    },
    {
      heading: 'Fast Delivery , Fast Craving',
      description:
        'No more waiting lines, or traffic jams indulge in delicious and enjoy food from the comfort of your home',
      backgroundImage: require('@/assets/images/background2.png'),
    },
    {
      heading: 'Crave It, We Deliver It',
      description:
        'Your one-stop app for all Cameroonian cuisines - spicy jollof rice to sweet puff-puff, Discover, Order & Enjoy the flavors!',
      backgroundImage: require('@/assets/images/background3.png'),
    },
  ];
  //logo Image
  const logoImage = require('@/assets/images/Foodrushlogo.png');
  //function for progress bar
  const [progress, setProgress] = useState(0);

  return (
    <ImageBackground
      source={onboardingInfo[0].backgroundImage}
      resizeMode="cover"
      className="flex-1 flex-col items-start justify-between"
    >
      <Image source={logoImage} className="" height={50} width={50} />
      <View className="h-[250px] w-[300px] bg-primaryColor justify-center items-center rounded-xl m-3 p-4 ">
        <Text className="text-center text-2xl text-white font-bold">
          {onboardingInfo[0].heading}
        </Text>
        <Text className="text-[15px] color-white mt-2">
          {onboardingInfo[0].description}
        </Text>
        {/* progress bar */}
        <Text>Slider Button</Text>
        <View className="flex flex-row justify-between">
          <TouchableHighlight className="color-primaryColor">
            <Text className="text-xs">next</Text>
          </TouchableHighlight>
          <TouchableHighlight className="color-primaryColor">
            <Text className="text-xs">skip</Text>
          </TouchableHighlight>
        </View>
      </View>
    </ImageBackground>
  );
};
//FIRST onboarding screen
const OnboardingScreen = () => {
  const relayLogo = require('@/assets/images/Foodrushlogo.png');
  const gif = require('@/assets/images/Delivery.gif');

  return (
    <View className="flex flex-col p-4 justify-between bg-white items-center">
      <Image source={relayLogo} />
      <View className="m-3 overflow-hidden">
        <Image
          source={gif}
          className="h-[70px] w-[70px] p-3 m-3"
          height={70}
          width={70}
        />
      </View>
      <View>
        <Text className="text-3xl text-blueTextcolor justify-center font-bold mb-2">
          Welcome to Food Rush
        </Text>
        <Text className="text-[16px] pb-2 text-neutral-500 mb-3 ">
          healthy meals delivered locally <br />
          by the tap of a button
        </Text>
      </View>
    </View>
  );
};
