import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, Card, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAnalyticsStackScreenProps } from '@/src/navigation/types';

interface HeatmapData {
  hour: number;
  day: string;
  orders: number;
  intensity: number; // 0-1 scale
}

const TimeHeatmap: React.FC<RestaurantAnalyticsStackScreenProps<'TimeHeatmap'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Mock data - replace with actual API call
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    
    daysOfWeek.forEach(day => {
      hours.forEach(hour => {
        let orders = 0;
        
        // Simulate realistic order patterns
        if (hour >= 6 && hour <= 10) { // Breakfast
          orders = Math.floor(Math.random() * 15) + 5;
        } else if (hour >= 11 && hour <= 15) { // Lunch
          orders = Math.floor(Math.random() * 25) + 15;
        } else if (hour >= 17 && hour <= 21) { // Dinner
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
    return heatmapData.find(d => d.day === day && d.hour === hour);
  };

  const getPeakHours = () => {
    const hourTotals = hours.map(hour => {
      const total = heatmapData
        .filter(d => d.hour === hour)
        .reduce((sum, d) => sum + d.orders, 0);
      return { hour, total };
    });
    
    return hourTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  };

  const getBusiestDays = () => {
    const dayTotals = daysOfWeek.map(day => {
      const total = heatmapData
        .filter(d => d.day === day)
        .reduce((sum, d) => sum + d.orders, 0);
      return { day, total };
    });
    
    return dayTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  };

  const peakHours = getPeakHours();
  const busiestDays = getBusiestDays();

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.onBackground }}>
            {t('time_heatmap')}
          </Text>
          <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 }}>
            {t('hourly_order_patterns')}
          </Text>
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
                backgroundColor: selectedPeriod === 'week' ? '#007aff' : colors.surfaceVariant,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: selectedPeriod === 'week' ? 'white' : colors.onSurfaceVariant,
                }}
              >
                {t('this_week')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPeriod('month')}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: selectedPeriod === 'month' ? '#007aff' : colors.surfaceVariant,
                borderRadius: 8,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: selectedPeriod === 'month' ? 'white' : colors.onSurfaceVariant,
                }}
              >
                {t('this_month')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Insights */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surface, marginBottom: 16 }}>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 12 }}>
                {t('key_insights')}
              </Text>
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.onSurface, marginBottom: 4 }}>
                  {t('peak_hours')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {peakHours.map((item, index) => (
                    <Chip
                      key={index}
                      style={{ backgroundColor: '#007aff20', marginRight: 8, marginBottom: 4 }}
                      textStyle={{ color: '#007aff', fontSize: 12 }}
                      compact
                    >
                      {item.hour}:00 ({item.total} orders)
                    </Chip>
                  ))}
                </View>
              </View>
              
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.onSurface, marginBottom: 4 }}>
                  {t('busiest_days')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {busiestDays.map((item, index) => (
                    <Chip
                      key={index}
                      style={{ backgroundColor: '#00C85120', marginRight: 8, marginBottom: 4 }}
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
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 }}>
                {t('order_heatmap')}
              </Text>
              
              {/* Hour labels */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <View style={{ width: 40 }} />
                {[6, 9, 12, 15, 18, 21].map(hour => (
                  <View key={hour} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: colors.onSurfaceVariant }}>
                      {hour}:00
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Heatmap grid */}
              {daysOfWeek.map(day => (
                <View key={day} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <View style={{ width: 40, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '600' }}>
                      {day}
                    </Text>
                  </View>
                  {hours.map(hour => {
                    const cellData = getDataForCell(day, hour);
                    return (
                      <View
                        key={hour}
                        style={{
                          flex: 1,
                          aspectRatio: 1,
                          backgroundColor: getIntensityColor(cellData?.intensity || 0),
                          marginHorizontal: 1,
                          borderRadius: 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {cellData && cellData.orders > 0 && (
                          <Text
                            style={{
                              fontSize: 8,
                              color: cellData.intensity > 0.5 ? 'white' : colors.onSurface,
                              fontWeight: 'bold',
                            }}
                          >
                            {cellData.orders}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
              
              {/* Legend */}
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 8 }}>
                  {t('order_volume')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: colors.onSurfaceVariant, marginRight: 8 }}>
                    {t('low')}
                  </Text>
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
                  <Text style={{ fontSize: 10, color: colors.onSurfaceVariant, marginLeft: 8 }}>
                    {t('high')}
                  </Text>
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