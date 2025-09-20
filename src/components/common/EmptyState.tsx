import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Heading5, Heading4, Heading3, Body, BodyLarge, Label } from './Typography';

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
          TitleComponent: Heading5,
          DescriptionComponent: Body,
          padding: 'py-6 px-4',
        };
      case 'large':
        return {
          iconSize: 96,
          TitleComponent: Heading3,
          DescriptionComponent: BodyLarge,
          padding: 'py-12 px-6',
        };
      default: // medium
        return {
          iconSize: 64,
          TitleComponent: Heading4,
          DescriptionComponent: Body,
          padding: 'py-8 px-6',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const { TitleComponent, DescriptionComponent } = sizeStyles;

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

      <TitleComponent
        color={colors.onSurface}
        weight="semibold"
        align="center"
        style={{ marginBottom: 8 }}
      >
        {title}
      </TitleComponent>

      <DescriptionComponent
        color={colors.onSurfaceVariant}
        align="center"
        style={{ marginBottom: 16 }}
      >
        {description}
      </DescriptionComponent>

      {actionText && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
        >
          <Label color={colors.onPrimary} weight="semibold">
            {actionText}
          </Label>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
