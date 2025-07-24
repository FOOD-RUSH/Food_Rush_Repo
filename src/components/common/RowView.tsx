import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface rowView {
  leftIconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  rightIconName?: keyof typeof MaterialIcons.glyphMap;
  title: string;
}
const RowView = ({
  leftIconName,
  onPress,
  rightIconName = 'arrow-forward-ios',
  title,
}: rowView) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between mb-4 items-center px-4 py-2">
        <Ionicons name={leftIconName} size={22} />

        <Text className="font-semibold text-[16px]">{title}</Text>
        <MaterialIcons name={rightIconName} size={18} />
      </View>
    </TouchableOpacity>
  );
};

export default RowView;
