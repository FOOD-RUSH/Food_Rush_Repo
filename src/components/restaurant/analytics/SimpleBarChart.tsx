import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ChartDataPoint } from '@/src/types/analytics';
import { Typography, Overline } from '@/src/components/common/Typography';

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  maxHeight?: number;
  showValues?: boolean;
  showLabels?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  maxHeight = 100,
  showValues = true,
  showLabels = true,
}) => {
  const { colors } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View
        style={{
          height: maxHeight + 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Overline color={colors.onSurfaceVariant}>No data available</Overline>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value || 0), 1); // Ensure minimum of 1 to avoid division by zero

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: maxHeight + 40,
        paddingHorizontal: 4,
      }}
    >
      {data.map((item, index) => {
        const value = item.value || 0;
        const height = maxValue > 0 ? (value / maxValue) * maxHeight : 0;
        const barWidth = Math.max(12, Math.min(32, 100 / data.length - 4)); // Dynamic width with limits

        return (
          <View
            key={`${item.label || 'bar'}-${index}`}
            style={{
              alignItems: 'center',
              flex: 1,
              marginHorizontal: 1,
              maxWidth: barWidth + 8,
            }}
          >
            <View
              style={{
                width: barWidth,
                height: Math.max(height, value > 0 ? 2 : 0), // Show minimum height only if value > 0
                backgroundColor: item.color || colors.primary,
                borderRadius: 2,
                marginBottom: 4,
              }}
            />
            {showLabels && item.label && (
              <Overline
                color={colors.onSurfaceVariant}
                align="center"
                style={{
                  fontSize: 10,
                  lineHeight: 12,
                }}
                numberOfLines={2}
              >
                {item.label}
              </Overline>
            )}
            {showValues && value > 0 && (
              <Overline
                color={colors.onSurface}
                weight="bold"
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  lineHeight: 12,
                }}
                numberOfLines={1}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Overline>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default SimpleBarChart;
