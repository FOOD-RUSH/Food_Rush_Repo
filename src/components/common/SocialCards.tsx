import { View, Text, Pressable } from 'react-native';
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
    <Pressable
      className="bg-white border rounded-xl shadow-sm mb-2 px-3 py-1"
      id={id}
      onPress={() => {}}
      style={({ pressed }) => [
        {
          borderColor: pressed ? '#007aff' : 'gray',
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex flex-row item-center">
        <Ionicons
          name={icon_name}
          color={'#007aff'}
          size={18}
          className="mr-2"
        />
        <Text className="text-2xl font-bold flex-1 text-center">
          {social_platform}
        </Text>
      </View>
    </Pressable>
  );
};

export default SocialCards;
