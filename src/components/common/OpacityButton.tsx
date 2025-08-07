import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { useTheme } from '@/src/hooks/useTheme';

type ButtonProps = {
  label: string;
  onpress: () => void;
};

const OpacityButton = ({ label, onpress }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      className={`h-10 w-full rounded-[20px] m-2 ${theme === 'light' ? 'bg-primary' : 'bg-primary'}`}
      onPress={onpress}
      activeOpacity={0.5}
    >
      <Text className={`text-white p-2 text-center font-bold`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default OpacityButton;

