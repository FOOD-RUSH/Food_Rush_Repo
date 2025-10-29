import React from 'react';
import { View } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Heading5,
  Body,
  Caption,
} from '@/src/components/common/Typography';

interface BreakdownItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface BreakdownCardProps {
  title: string;
  data: BreakdownItem[];
  showCounts?: boolean;
}

const BreakdownCard: React.FC<BreakdownCardProps> = ({
  title,
  data,
  showCounts = true,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
        <View style={{ padding: 16 }}>
          <Heading5
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: 16 }}
          >
            {title}
          </Heading5>
          <Caption color={colors.onSurfaceVariant}>
            {t('no_data_available')}
          </Caption>
        </View>
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
      <View style={{ padding: 16 }}>
        <Heading5
          color={colors.onSurface}
          weight="bold"
          style={{ marginBottom: 16 }}
        >
          {title}
        </Heading5>
        {data.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: index < data.length - 1 ? 12 : 0,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: item.color || colors.primary,
                  marginRight: 12,
                }}
              />
              <Body color={colors.onSurface} numberOfLines={2}>
                {item.label || t('unknown')}
              </Body>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              {showCounts && (
                <Body color={colors.onSurface} weight="semibold">
                  {item.count || 0}
                </Body>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: showCounts ? 4 : 0,
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 4,
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: 2,
                    marginRight: 8,
                  }}
                >
                  <View
                    style={{
                      width: `${Math.min(Math.max(item.percentage || 0, 0), 100)}%`,
                      height: 4,
                      backgroundColor: item.color || colors.primary,
                      borderRadius: 2,
                    }}
                  />
                </View>
                <Caption color={colors.onSurfaceVariant} weight="semibold">
                  {(item.percentage || 0).toFixed(1)}%
                </Caption>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default BreakdownCard;
