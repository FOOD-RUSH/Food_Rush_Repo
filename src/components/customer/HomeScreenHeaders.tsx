import { View, Text } from 'react-native';
import React from 'react';
import { TextButton } from '../common/TextButton';
import { Background } from '@react-navigation/elements';
import { Button } from 'react-native-paper';

interface HeaderProps {
  title: string;
  onPress: () => void;
}
const HomeScreenHeaders = ({ onPress, title }: HeaderProps) => {
  return (
    <View className="mx-2 mt-7">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-xl">{title}</Text>
        <Button onPress={onPress} style={{marginLeft: 15}}>
          <Text className="text-primaryColor">See More</Text>{' '}
        </Button>
        {/* {generate the list of food to be a list of 10} */}
      </View>
    </View>
  );
};

export default HomeScreenHeaders;
