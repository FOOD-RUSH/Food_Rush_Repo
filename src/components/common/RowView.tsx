import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

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
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between mb-4 items-center px-4 py-2">
        <Ionicons name={leftIconName} size={22} color={colors.onSurface} />

        <Text
          className={`font-semibold text-base `}
          style={{ color: colors.onSurface }}
        >
          {title}
        </Text>
        <MaterialIcons
          name={rightIconName}
          size={18}
          color={colors.onSurface}
        />
      </View>
    </TouchableOpacity>
  );
};

export default RowView;
