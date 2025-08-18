import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';

interface ResettingPasswordProps {
  isPending: boolean;
}

const ResettingPassword: React.FC<ResettingPasswordProps> = ({ isPending }) => {
  return (
    <View className="items-center p-6">
      <Image
        source={require('@/assets/images/Food Emojies/🍔02.png')}
        className="w-32 h-32 mb-6"
      />
      <Text className="text-2xl font-bold text-center mb-4">Resetting password</Text>
      <Button mode="contained" loading={isPending} disabled={isPending}>
        Please wait...
      </Button>
    </View>
  );
};

export default ResettingPassword;
