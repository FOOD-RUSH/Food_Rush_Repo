import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface LogoutContentProps {
  onDismiss: () => void;
  onConfirmLogout: () => void;
}

const LogoutContent: React.FC<LogoutContentProps> = ({
  onDismiss,
  onConfirmLogout,
}) => {
  const { colors } = useTheme();

  return (
    <View className="flex-1 justify-between">
      {/* Icon and message */}
      <View className="items-center flex-1 justify-center">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: colors.errorContainer }}
        >
          <MaterialIcons
            name="logout"
            size={32}
            color={colors.onErrorContainer}
          />
        </View>

        <Text
          style={{ color: colors.onSurface }}
          className="text-center text-base leading-6 px-2"
        >
          Are you sure you want to log out of your account?
        </Text>
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-3 pt-4">
        <TouchableOpacity
          onPress={onDismiss}
          className="flex-1 py-3 rounded-lg items-center justify-center border"
          style={{
            backgroundColor: 'transparent',
            borderColor: colors.outline,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{ color: colors.onSurface }}
            className="text-base font-medium"
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirmLogout}
          className="flex-1 py-3 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.error }}
          activeOpacity={0.7}
        >
          <Text
            style={{ color: colors.onError }}
            className="text-base font-medium"
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoutContent;
