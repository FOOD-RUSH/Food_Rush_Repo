import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Checkbox, useTheme } from 'react-native-paper';
import { MaterialCommunityIcon } from './icons';

interface CustomCheckboxProps {
  status: 'checked' | 'unchecked' | 'indeterminate';
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  uncheckedColor?: string;
  size?: number;
  testID?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  status,
  onPress,
  disabled = false,
  color,
  uncheckedColor,
  size = 20,
  testID,
}) => {
  const { colors, dark } = useTheme();

  // Determine colors based on theme and props
  const checkedColor = color || colors.primary;
  const defaultUncheckedColor = dark ? colors.onSurfaceVariant : '#000000';
  const finalUncheckedColor = uncheckedColor || defaultUncheckedColor;

  // For iOS, we'll create a custom checkbox with better visibility
  if (Platform.OS === 'ios') {
    const borderColor = status === 'checked' ? checkedColor : finalUncheckedColor;
    const backgroundColor = status === 'checked' ? checkedColor : 'transparent';
    const borderWidth = status === 'checked' ? 0 : 2;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: 4,
            borderWidth: borderWidth,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            // Add shadow for better visibility in light mode
            shadowColor: dark ? 'transparent' : '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: dark ? 0 : 0.1,
            shadowRadius: 2,
            elevation: dark ? 0 : 1,
          }}
        >
          {status === 'checked' && (
            <MaterialCommunityIcon
              name="check"
              size={size * 0.7}
              color={dark ? colors.onPrimary : '#ffffff'}
            />
          )}
          {status === 'indeterminate' && (
            <View
              style={{
                width: size * 0.5,
                height: 2,
                backgroundColor: dark ? colors.onPrimary : '#ffffff',
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // For Android, use the default Paper checkbox but with enhanced colors
  return (
    <Checkbox
      status={status}
      onPress={onPress}
      disabled={disabled}
      color={checkedColor}
      uncheckedColor={finalUncheckedColor}
      testID={testID}
    />
  );
};

export default CustomCheckbox;