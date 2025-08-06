import { View, Text, Pressable, TouchableHighlight } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SocialDataProps } from '@/src/constants/SocialData';

//id : 1
// icon name
//social media Name
// link
const SocialCards = ({
  id,
  icon_name,
  social_platform,
  link,
}: SocialDataProps) => {
  return (
    <TouchableHighlight
      className="bg-white border border-gray-50 rounded-xl drop-shadow-lg my-2 px-3 py-3 "
      underlayColor={'#bfdbfe'}
      id={id}
      onPress={() => {}}
    >
      <View className="flex flex-row item-center ">
        <Ionicons
          name={icon_name}
          color={'#007aff'}
          size={25}
          className="mr-2 align-middle"
        />
        <Text className="text-[20px] font-semibold flex-1 text-center">
          {social_platform}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default SocialCards;
