import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

interface HeaderProps {
  title: string;
  onPress: () => void;
}
const HomeScreenHeaders = ({ onPress, title }: HeaderProps) => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const primaryColor = theme === 'light' ? 'text-primary' : 'text-primary';

  return (
    <View className="mx-2 mt-7">
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`font-bold text-xl ${textColor}`}>{title}</Text>
        <Button onPress={onPress} style={{ marginLeft: 15 }}>
          <Text className={`${primaryColor}`}>See More</Text>
        </Button>
      </View>
    </View>
  );
};

export default HomeScreenHeaders;
