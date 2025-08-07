import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/hooks/useTheme';

type TextButtonProps = {
  text: string;
  onPress: () => void;
};

export const TextButton: React.FC<TextButtonProps> = ({ text, onPress }) => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-primary' : 'text-primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-items-center"
    >
      <Text className={`text-base font-medium ${textColor}`}>{text}</Text>
    </TouchableOpacity>
  );
};
