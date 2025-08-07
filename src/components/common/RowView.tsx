import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';

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
  const { theme } = useTheme();
  const iconColor = theme === 'light' ? 'black' : 'white';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between mb-4 items-center px-4 py-2">
        <Ionicons name={leftIconName} size={22} color={iconColor} />

        <Text className={`font-semibold text-base ${textColor}`}>{title}</Text>
        <MaterialIcons name={rightIconName} size={18} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default RowView;
