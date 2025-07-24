import { View, Text } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Checkbox } from 'react-native-paper';

const Language = () => {
  return (
    <CommonView>
      <View className="py-3 space-y-4">
        <View className="flex-row justify-between">
          <Text>English (US)</Text>
          <Checkbox status={'checked'} color={'#007aff'} />
        </View>
        <View className="flex-row justify-between">
          <Text>English (US)</Text>
          <Checkbox status={'checked'} color={'#007aff'} />
        </View>
      </View>
    </CommonView>
  );
};

export default Language;
