import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  IoniconsIcon,
  MaterialIcon,
  type IoniconsName,
  type MaterialIconsName,
} from './icons';
import { useTheme } from 'react-native-paper';

interface rowView {
  leftIconName: IoniconsName;
  onPress: () => void;
  rightIconName?: MaterialIconsName;
  title: string;
  subtitle?: string;
  iconColor?: string;
  showIconBackground?: boolean;
}
const RowView = ({
  leftIconName,
  onPress,
  rightIconName = 'arrow-forward-ios',
  title,
  subtitle,
  iconColor,
  showIconBackground = false,
}: rowView) => {
  const { colors } = useTheme();
  const finalIconColor = iconColor || colors.onSurface;

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between mb-4 items-center px-2 py-2">
        {showIconBackground ? (
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: finalIconColor + '15',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IoniconsIcon
              name={leftIconName}
              size={22}
              color={finalIconColor}
            />
          </View>
        ) : (
          <IoniconsIcon name={leftIconName} size={22} color={finalIconColor} />
        )}

        <View className="flex-1 ml-3">
          <Text
            className="font-semibold text-base"
            style={{ color: colors.onSurface }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-sm mt-1"
              style={{ color: colors.onSurfaceVariant }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <MaterialIcon name={rightIconName} size={18} color={colors.onSurface} />
      </View>
    </TouchableOpacity>
  );
};

export default RowView;
