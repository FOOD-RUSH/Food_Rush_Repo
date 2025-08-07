import { View, Text, TouchableHighlight } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SocialDataProps } from '@/src/constants/SocialData';
import { useTheme } from '@/src/hooks/useTheme';

const SocialCards = ({
  id,
  icon_name,
  social_platform,
  link,
}: SocialDataProps) => {
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'bg-white' : 'bg-secondary';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const iconColor = theme === 'light' ? '#007aff' : '#3b82f6';
  const underlayColor = theme === 'light' ? '#bfdbfe' : '#1e293b';

  return (
    <TouchableHighlight
      className={`border border-gray-50 rounded-xl drop-shadow-lg my-2 px-3 py-3 ${cardBackgroundColor}`}
      style={{ boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)' }}
      underlayColor={underlayColor}
      id={id}
      onPress={() => {}}
    >
      <View className="flex flex-row item-center ">
        <Ionicons
          name={icon_name}
          color={iconColor}
          size={25}
          className="mr-2 align-middle"
        />
        <Text
          className={`text-lg font-semibold flex-1 text-center ${textColor}`}
        >
          {social_platform}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default SocialCards;
