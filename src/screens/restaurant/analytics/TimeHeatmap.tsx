import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, Card, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import {
  RestaurantAnalyticsStackScreenProps,
  RootStackScreenProps,
} from '@/src/navigation/types';
import {
  Typography,
  Heading1,
  Heading5,
  Body,
  Label,
  Caption,
  Overline,
} from '@/src/components/common/Typography';

interface HeatmapData {
  hour: number;
  day: string;
  orders: number;
  intensity: number; // 0-1 scale
}

const TimeHeatmap: React.FC<
  RootStackScreenProps<'RestaurantTimeHeatmap'>
> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>(
    'week',
  );

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Mock data - replace with actual API call
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];

    daysOfWeek.forEach((day) => {
      hours.forEach((hour) => {
        let orders = 0;

        // Simulate realistic order patterns
        if (hour >= 6 && hour <= 10) {
          // Breakfast
          orders = Math.floor(Math.random() * 15) + 5;
        } else if (hour >= 11 && hour <= 15) {
          // Lunch
          orders = Math.floor(Math.random() * 25) + 15;
        } else if (hour >= 17 && hour <= 21) {
          // Dinner
          orders = Math.floor(Math.random() * 30) + 20;
        } else {
          orders = Math.floor(Math.random() * 5);
        }

        // Weekend boost
        if (day === 'Sat' || day === 'Sun') {
          orders = Math.floor(orders * 1.3);
        }

        data.push({
          hour,
          day,
          orders,
          intensity: Math.min(orders / 50, 1), // Normalize to 0-1
        });
      });
    });

    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return colors.surfaceVariant;
    if (intensity <= 0.2) return '#007aff20';
    if (intensity <= 0.4) return '#007aff40';
    if (intensity <= 0.6) return '#007aff60';
    if (intensity <= 0.8) return '#007aff80';
    return '#007aff';
  };

  const getDataForCell = (day: string, hour: number) => {
    return heatmapData.find((d) => d.day === day && d.hour === hour);
  };

  const getPeakHours = () => {
    const hourTotals = hours.map((hour) => {
      const total = heatmapData
        .filter((d) => d.hour === hour)
        .reduce((sum, d) => sum + d.orders, 0);
      return { hour, total };
    });

    return hourTotals.sort((a, b) => b.total - a.total).slice(0, 3);
  };

  const getBusiestDays = () => {
    const dayTotals = daysOfWeek.map((day) => {
      const total = heatmapData
        .filter((d) => d.day === day)
        .reduce((sum, d) => sum + d.orders, 0);
      return { day, total };
    });

    return dayTotals.sort((a, b) => b.total - a.total).slice(0, 3);
  };

  const peakHours = getPeakHours();
  const busiestDays = getBusiestDays();

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Heading1 color={colors.onBackground} weight="bold">
            {t('time_heatmap')}
          </Heading1>
          <Body color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
            {t('hourly_order_patterns')}
          </Body>
        </View>

        {/* Period Selector */}
        <View style={{ padding: 16, paddingTop: 12 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => setSelectedPeriod('week')}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor:
                  selectedPeriod === 'week' ? '#007aff' : colors.surfaceVariant,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Label
                color={
                  selectedPeriod === 'week' ? 'white' : colors.onSurfaceVariant
                }
                weight="semibold"
                align="center"
              >
                {t('this_week')}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPeriod('month')}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor:
                  selectedPeriod === 'month'
                    ? '#007aff'
                    : colors.surfaceVariant,
                borderRadius: 8,
                marginLeft: 8,
              }}
            >
              <Label
                color={
                  selectedPeriod === 'month' ? 'white' : colors.onSurfaceVariant
                }
                weight="semibold"
                align="center"
              >
                {t('this_month')}
              </Label>
            </TouchableOpacity>
          </View>
        </View>

        {/* Insights */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surface, marginBottom: 16 }}>
            <View style={{ padding: 16 }}>
              <Heading5
                color={colors.onSurface}
                weight="bold"
                style={{ marginBottom: 12 }}
              >
                {t('key_insights')}
              </Heading5>

              <View style={{ marginBottom: 12 }}>
                <Label
                  color={colors.onSurface}
                  weight="semibold"
                  style={{ marginBottom: 4 }}
                >
                  {t('peak_hours')}
                </Label>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {peakHours.map((item, index) => (
                    <Chip
                      key={index}
                      style={{
                        backgroundColor: '#007aff20',
                        marginRight: 8,
                        marginBottom: 4,
                      }}
                      textStyle={{ color: '#007aff', fontSize: 12 }}
                      compact
                    >
                      {item.hour}:00 ({item.total} orders)
                    </Chip>
                  ))}
                </View>
              </View>

              <View>
                <Label
                  color={colors.onSurface}
                  weight="semibold"
                  style={{ marginBottom: 4 }}
                >
                  {t('busiest_days')}
                </Label>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {busiestDays.map((item, index) => (
                    <Chip
                      key={index}
                      style={{
                        backgroundColor: '#00C85120',
                        marginRight: 8,
                        marginBottom: 4,
                      }}
                      textStyle={{ color: '#00C851', fontSize: 12 }}
                      compact
                    >
                      {item.day} ({item.total} orders)
                    </Chip>
                  ))}
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Heatmap */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surface }}>
            <View style={{ padding: 16 }}>
              <Heading5
                color={colors.onSurface}
                weight="bold"
                style={{ marginBottom: 16 }}
              >
                {t('order_heatmap')}
              </Heading5>

              {/* Hour labels */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <View style={{ width: 40 }} />
                {[6, 9, 12, 15, 18, 21].map((hour) => (
                  <View key={hour} style={{ flex: 1, alignItems: 'center' }}>
                    <Overline color={colors.onSurfaceVariant}>
                      {hour}:00
                    </Overline>
                  </View>
                ))}
              </View>

              {/* Heatmap grid */}
              {daysOfWeek.map((day) => (
                <View
                  key={day}
                  style={{ flexDirection: 'row', marginBottom: 4 }}
                >
                  <View style={{ width: 40, justifyContent: 'center' }}>
                    <Caption color={colors.onSurfaceVariant} weight="semibold">
                      {day}
                    </Caption>
                  </View>
                  {hours.map((hour) => {
                    const cellData = getDataForCell(day, hour);
                    return (
                      <View
                        key={hour}
                        style={{
                          flex: 1,
                          aspectRatio: 1,
                          backgroundColor: getIntensityColor(
                            cellData?.intensity || 0,
                          ),
                          marginHorizontal: 1,
                          borderRadius: 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {cellData && cellData.orders > 0 && (
                          <Typography
                            variant="overline"
                            color={
                              cellData.intensity > 0.5
                                ? 'white'
                                : colors.onSurface
                            }
                            weight="bold"
                            style={{ fontSize: 8 }}
                          >
                            {cellData.orders}
                          </Typography>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}

              {/* Legend */}
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Caption
                  color={colors.onSurfaceVariant}
                  style={{ marginBottom: 8 }}
                >
                  {t('order_volume')}
                </Caption>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Overline
                    color={colors.onSurfaceVariant}
                    style={{ marginRight: 8 }}
                  >
                    {t('low')}
                  </Overline>
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
                    <View
                      key={index}
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: getIntensityColor(intensity),
                        marginHorizontal: 1,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                  <Overline
                    color={colors.onSurfaceVariant}
                    style={{ marginLeft: 8 }}
                  >
                    {t('high')}
                  </Overline>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default TimeHeatmap;
