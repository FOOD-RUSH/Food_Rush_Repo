import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'alert-circle-outline',
  title,
  description,
  actionText,
  onActionPress,
  size = 'medium',
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 48,
          titleSize: 'text-lg',
          descriptionSize: 'text-sm',
          padding: 'py-6 px-4',
        };
      case 'large':
        return {
          iconSize: 96,
          titleSize: 'text-2xl',
          descriptionSize: 'text-lg',
          padding: 'py-12 px-6',
        };
      default: // medium
        return {
          iconSize: 64,
          titleSize: 'text-xl',
          descriptionSize: 'text-base',
          padding: 'py-8 px-6',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      className={`items-center justify-center ${sizeStyles.padding}`}
      style={[{ backgroundColor: colors.background }, style]}
    >
      <Ionicons
        name={icon}
        size={sizeStyles.iconSize}
        color={colors.onSurfaceVariant}
        style={{ marginBottom: 16 }}
      />

      <Text
        className={`${sizeStyles.titleSize} font-semibold text-center mb-2`}
        style={{ color: colors.onSurface }}
      >
        {title}
      </Text>

      <Text
        className={`${sizeStyles.descriptionSize} text-center mb-4`}
        style={{ color: colors.onSurfaceVariant }}
      >
        {description}
      </Text>

      {actionText && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
        >
          <Text className="font-semibold" style={{ color: colors.onPrimary }}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
