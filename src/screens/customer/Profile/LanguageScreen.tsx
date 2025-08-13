import { View, Text } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import {  RadioButton } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';

const LanguageScreen = ({
  navigation,
}: RootStackScreenProps<'LanguageScreen'>) => {
  return (
    <CommonView>
      <View className="py-5 space-y-4">
        <View className="flex-row justify-between mb-3">
          <Text className="text-[18px] font-semibold ">English (US)</Text>
          <RadioButton status={'checked'} color={'#007aff'} value={'Eng'} />
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[18px] font-semibold">French (FRE)</Text>
          <RadioButton status={'checked'} color={'#007aff'} value={'Eng'} />
        </View>
      </View>
    </CommonView>
  );
};

export default LanguageScreen;
