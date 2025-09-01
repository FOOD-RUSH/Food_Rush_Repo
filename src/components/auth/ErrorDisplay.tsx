import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface ErrorDisplayProps {
  error: string | null;
  visible?: boolean;
  style?: any;
  containerStyle?: any;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  visible = true,
  style,
  containerStyle,
}) => {
  const { colors } = useTheme();

  if (!error || !visible) {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: colors.errorContainer,
          borderRadius: 12,
          padding: 16,
          marginVertical: 8,
          flexDirection: 'row',
          alignItems: 'flex-start',
          borderWidth: 1,
          borderColor: colors.error,
        },
        containerStyle,
      ]}
    >
      <Ionicons
        name="alert-circle"
        size={20}
        color={colors.error}
        style={{ marginRight: 12, marginTop: 2 }}
      />
      <Text
        style={[
          {
            color: colors.onErrorContainer,
            fontSize: 14,
            lineHeight: 20,
            flex: 1,
          },
          style,
        ]}
      >
        {error}
      </Text>
    </View>
  );
};

export default ErrorDisplay;
