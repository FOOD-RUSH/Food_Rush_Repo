import { Text, TouchableOpacity } from 'react-native'
import React from 'react'



type TextButtonProps = {
  text: string;
  onPress: () => void;
};

export const TextButton: React.FC<TextButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text className="text-primaryColor text-base font-medium">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

