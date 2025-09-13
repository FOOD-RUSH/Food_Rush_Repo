import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAnalyticsStackScreenProps } from '@/src/navigation/types';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
  subtitle?: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color, subtitle }) => {
  const { colors } = useTheme();
  
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return '#00D084'; // Enhanced success green
      case 'negative': return '#FF3B30'; // Enhanced error red
      default: return colors.onSurfaceVariant;
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return 'trending-up';
      case 'negative': return 'trending-down';
      default: return 'trending-neutral';
    }
  };

  return (
    <Card style={{ 
      flex: 1, 
      margin: 6, 
      backgroundColor: colors.surface,
      borderRadius: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MaterialCommunityIcons name={icon as any} size={20} color={color} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons 
              name={getChangeIcon() as any} 
              size={16} 
              color={getChangeColor()} 
            />
            <Text style={{ fontSize: 11, color: getChangeColor(), fontWeight: '600', marginLeft: 4 }}>
              {change}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.onSurface, marginBottom: 4 }}>
          {value}
        </Text>
        <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, fontWeight: '500' }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
    </Card>
  );
};

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{ data: ChartData[]; maxHeight?: number }> = ({ data, maxHeight = 100 }) => {
  const { colors } = useTheme();
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: maxHeight + 20 }}>
      {data.map((item, index) => {
        const height = (item.value / maxValue) * maxHeight;
        return (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 20,
              height: height,
              backgroundColor: item.color,
              borderRadius: 4,
              marginBottom: 4,
            }} />
            <Text style={{ fontSize: 10, color: colors.onSurfaceVariant, textAlign: 'center' }}>
              {item.label}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.onSurface }}>
              {item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// Progress Ring Component
const ProgressRing: React.FC<{ percentage: number; size?: number; color?: string }> = ({ 
  percentage, 
  size = 60, 
  color = '#007aff' 
}) => {
  const { colors } = useTheme();
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: colors.surfaceVariant,
      }} />
      <View style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: color,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: percentage > 50 ? color : 'transparent',
        borderLeftColor: percentage > 25 ? color : 'transparent',
        transform: [{ rotate: `${(percentage / 100) * 360}deg` }],
      }} />
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.onSurface }}>
        {percentage}%
      </Text>
    </View>
  );
};

const AnalyticsOverview: React.FC<RestaurantAnalyticsStackScreenProps<'AnalyticsOverview'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'yesterday' | '7days' | '30days'>('today');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for different periods
  const getMetricsData = () => {
    const data = {
      today: {
        revenue: { value: '45,000', change: '+12%', changeType: 'positive' as const },
        orders: { value: '23', change: '+5', changeType: 'positive' as const },
        avgPrepTime: { value: '18m', change: '-2m', changeType: 'positive' as const },
        cancelRate: { value: '8%', change: '+2%', changeType: 'negative' as const },
      },
      yesterday: {
        revenue: { value: '38,500', change: '-8%', changeType: 'negative' as const },
        orders: { value: '19', change: '-3', changeType: 'negative' as const },
        avgPrepTime: { value: '22m', change: '+4m', changeType: 'negative' as const },
        cancelRate: { value: '12%', change: '+5%', changeType: 'negative' as const },
      },
      '7days': {
        revenue: { value: '285,000', change: '+18%', changeType: 'positive' as const },
        orders: { value: '156', change: '+24', changeType: 'positive' as const },
        avgPrepTime: { value: '20m', change: '-1m', changeType: 'positive' as const },
        cancelRate: { value: '10%', change: '-2%', changeType: 'positive' as const },
      },
      '30days': {
        revenue: { value: '1,240,000', change: '+25%', changeType: 'positive' as const },
        orders: { value: '687', change: '+89', changeType: 'positive' as const },
        avgPrepTime: { value: '19m', change: '-3m', changeType: 'positive' as const },
        cancelRate: { value: '9%', change: '-3%', changeType: 'positive' as const },
      },
    };
    return data[selectedPeriod];
  };

  const metricsData = getMetricsData();

  const periods = [
    { key: 'today', label: t('today') },
    { key: 'yesterday', label: t('yesterday') },
    { key: '7days', label: t('7_days') },
    { key: '30days', label: t('30_days') },
  ];

  // Chart data for weekly orders - changes based on selected period
  const getWeeklyOrdersData = (): ChartData[] => {
    const baseData = [
      { label: 'Mon', value: 12, color: '#007aff' },
      { label: 'Tue', value: 19, color: '#007aff' },
      { label: 'Wed', value: 15, color: '#007aff' },
      { label: 'Thu', value: 23, color: '#007aff' },
      { label: 'Fri', value: 28, color: '#007aff' },
      { label: 'Sat', value: 35, color: '#00D084' },
      { label: 'Sun', value: 31, color: '#00D084' },
    ];

    // Modify data based on selected period
    if (selectedPeriod === '30days') {
      return baseData.map(item => ({ ...item, value: item.value * 2.5 }));
    } else if (selectedPeriod === '7days') {
      return baseData.map(item => ({ ...item, value: item.value * 1.5 }));
    } else if (selectedPeriod === 'yesterday') {
      return baseData.map(item => ({ ...item, value: Math.max(1, item.value * 0.8) }));
    }
    
    return baseData;
  };

  const weeklyOrdersData = getWeeklyOrdersData();

  // Top categories data
  const topCategories = [
    { name: 'Main Course', orders: 156, percentage: 65, color: '#007aff' },
    { name: 'Appetizers', orders: 89, percentage: 37, color: '#00D084' },
    { name: 'Desserts', orders: 45, percentage: 19, color: '#FF9500' },
    { name: 'Beverages', orders: 67, percentage: 28, color: '#FF6B35' },
  ];

  // Performance metrics
  const performanceMetrics = {
    customerSatisfaction: 92,
    orderAccuracy: 96,
    deliveryTime: 78,
    repeatCustomers: 84,
  };

  const handleViewBestSellers = () => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantBestSellers');
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const handleViewTimeHeatmap = () => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantTimeHeatmap');
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <CommonView>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007aff']}
          />
        }
      >
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.onBackground }}>
            {t('analytics')}
          </Text>
          <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 }}>
            {t('track_your_performance')}
          </Text>
        </View>

        {/* Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPeriod(period.key as any);
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: selectedPeriod === period.key ? '#007aff' : colors.surfaceVariant,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  color: selectedPeriod === period.key ? 'white' : colors.onSurfaceVariant,
                }}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Key Metrics */}
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <MetricCard
              title={t('revenue')}
              value={`${metricsData.revenue.value}`}
              change={metricsData.revenue.change}
              changeType={metricsData.revenue.changeType}
              icon="cash"
              color="#007aff"
              subtitle="XAF"
            />
            <MetricCard
              title={t('orders')}
              value={metricsData.orders.value}
              change={metricsData.orders.change}
              changeType={metricsData.orders.changeType}
              icon="receipt"
              color="#00D084"
              subtitle={t('total_orders')}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <MetricCard
              title={t('avg_prep_time')}
              value={metricsData.avgPrepTime.value}
              change={metricsData.avgPrepTime.change}
              changeType={metricsData.avgPrepTime.changeType}
              icon="clock"
              color="#FF9500"
              subtitle={t('minutes')}
            />
            <MetricCard
              title={t('cancel_rate')}
              value={metricsData.cancelRate.value}
              change={metricsData.cancelRate.change}
              changeType={metricsData.cancelRate.changeType}
              icon="cancel"
              color="#FF3B30"
              subtitle={t('of_orders')}
            />
          </View>
        </View>

        {/* Weekly Orders Chart */}
        <View style={{ padding: 16 }}>
          <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface }}>
                  {t('weekly_orders')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="trending-up" size={16} color="#00D084" />
                  <Text style={{ fontSize: 12, color: '#00D084', fontWeight: '600', marginLeft: 4 }}>
                    +18%
                  </Text>
                </View>
              </View>
              <SimpleBarChart data={weeklyOrdersData} maxHeight={80} />
            </View>
          </Card>
        </View>

        {/* Performance Metrics */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 }}>
                {t('performance_metrics')}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <ProgressRing percentage={performanceMetrics.customerSatisfaction} color="#00D084" />
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                    {t('customer_satisfaction')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <ProgressRing percentage={performanceMetrics.orderAccuracy} color="#007aff" />
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                    {t('order_accuracy')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <ProgressRing percentage={performanceMetrics.deliveryTime} color="#FF9500" />
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                    {t('delivery_time')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <ProgressRing percentage={performanceMetrics.repeatCustomers} color="#8B5CF6" />
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                    {t('repeat_customers')}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Top Categories */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 }}>
                {t('top_categories')}
              </Text>
              {topCategories.map((category, index) => (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: index < topCategories.length - 1 ? 12 : 0 
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: category.color,
                      marginRight: 12,
                    }} />
                    <Text style={{ fontSize: 14, color: colors.onSurface, flex: 1 }}>
                      {category.name}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.onSurface }}>
                      {category.orders} {t('orders')}
                    </Text>
                    <View style={{
                      width: 60,
                      height: 4,
                      backgroundColor: colors.surfaceVariant,
                      borderRadius: 2,
                      marginTop: 4,
                    }}>
                      <View style={{
                        width: `${category.percentage}%`,
                        height: 4,
                        backgroundColor: category.color,
                        borderRadius: 2,
                      }} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 12 }}>
            {t('detailed_reports')}
          </Text>
          
          <Card style={{ marginBottom: 12, backgroundColor: colors.surface }}>
            <TouchableOpacity onPress={handleViewBestSellers} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="star" size={24} color="#FF9500" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.onSurface }}>
                      {t('best_sellers')}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                      {t('top_performing_items')}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={{ marginBottom: 12, backgroundColor: colors.surface }}>
            <TouchableOpacity onPress={handleViewTimeHeatmap} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#007aff" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.onSurface }}>
                      {t('time_heatmap')}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                      {t('hourly_order_patterns')}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Payment Methods Breakdown */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 12 }}>
            {t('payment_methods')}
          </Text>
          
          <Card style={{ backgroundColor: colors.surface }}>
            <View style={{ padding: 16 }}>
              {[
                { method: 'MTN Mobile Money', percentage: 45, color: '#FF9500' },
                { method: 'Orange Money', percentage: 35, color: '#FF6B35' },
                { method: 'Cash', percentage: 20, color: '#00D084' },
              ].map((payment, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: colors.outline,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: payment.color,
                        marginRight: 12,
                      }}
                    />
                    <Text style={{ fontSize: 14, color: colors.onSurface }}>
                      {payment.method}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.onSurface }}>
                    {payment.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AnalyticsOverview;