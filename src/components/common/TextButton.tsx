import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

type TextButtonProps = {
  text: string;
  onPress: () => void;
};

export const TextButton: React.FC<TextButtonProps> = ({ text, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-items-center"
    >
      <Text
        className={`text-base font-medium `}
        style={{ color: colors.primary }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
