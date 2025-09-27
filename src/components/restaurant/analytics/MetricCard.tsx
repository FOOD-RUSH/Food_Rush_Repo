import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

import { MetricCardData } from '@/src/types/analytics';
import {
  Typography,
  Heading1,
  Body,
  Caption,
  Overline,
} from '@/src/components/common/Typography';

interface MetricCardProps extends MetricCardData {
  onPress?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color,
  subtitle,
  onPress,
}) => {
  const { colors } = useTheme();

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return '#00D084';
      case 'negative':
        return '#FF3B30';
      default:
        return colors.onSurfaceVariant;
    }
  };

  const getChangeIcon = (): keyof MaterialCommunityIconName => {
    switch (changeType) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Card
      style={{
        flex: 1,
        margin: 6,
        backgroundColor: colors.surface,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <CardComponent onPress={onPress} style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: (color || colors.primary) + '20',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcon               name={icon as keyof MaterialCommunityIconName}
              size={20}
              color={color || colors.primary}
            />
          </View>
          {change && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcon                 name={getChangeIcon()}
                size={16}
                color={getChangeColor()}
              />
              <Overline
                color={getChangeColor()}
                weight="semibold"
                style={{ marginLeft: 4 }}
              >
                {change}
              </Overline>
            </View>
          )}
        </View>
        <Heading1
          color={colors.onSurface}
          weight="bold"
          style={{ marginBottom: 4 }}
          numberOfLines={1}
        >
          {value || '0'}
        </Heading1>
        <Body color={colors.onSurfaceVariant} weight="medium" numberOfLines={2}>
          {title || 'Untitled'}
        </Body>
        {subtitle && (
          <Caption
            color={colors.onSurfaceVariant}
            style={{ marginTop: 2 }}
            numberOfLines={1}
          >
            {subtitle}
          </Caption>
        )}
      </CardComponent>
    </Card>
  );
};

export default MetricCard;
