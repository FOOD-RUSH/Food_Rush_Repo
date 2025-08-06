import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Card } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import { lightTheme } from '@/src/config/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface dataProps {
  title: string;
  id: number;
  description: string;
  show: boolean;
}

const data: dataProps[] = [
  {
    id: 1,
    title: 'What is foodRush',
    description:
      'food vbgbnfvnnfvbjtbfnv fvbbnv nj  fvjnjush is a slkckscnbnfvnfvfvfv mfvnffbncv fbn gbntgbfkv nf bnbnfvn',
    show: false,
  },
];

const FAQ = () => {
  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <QuestionCard />
      </ScrollView>
    </CommonView>
  );
};

export default FAQ;

const QuestionCard = () => {
  return (
    <Card mode="outlined" style={{ padding: 20 }}>
      <View>
        <View className="flex-row justify-between ">
          <Text className="text-[20px] text-semi">What is foodRush</Text>
          <TouchableOpacity>
            <MaterialIcons
              name="text-rotation-angledown"
              size={20}
              color={lightTheme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <Seperator backgroundColor="bg-gray-400" />
      </View>
    </Card>
  );
};
