import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAnalyticsStackScreenProps } from '@/src/navigation/types';

interface BestSellerItem {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  revenue: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

const BestSellers: React.FC<RestaurantAnalyticsStackScreenProps<'BestSellers'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Mock data - replace with actual API call
  const bestSellers: BestSellerItem[] = [
    { id: '1', name: 'Jollof Rice with Chicken', category: 'Main Course', totalSold: 156, revenue: 780000, percentage: 25, trend: 'up' },
    { id: '2', name: 'Grilled Fish', category: 'Main Course', totalSold: 134, revenue: 670000, percentage: 21, trend: 'up' },
    { id: '3', name: 'Plantain & Beans', category: 'Main Course', totalSold: 98, revenue: 490000, percentage: 16, trend: 'stable' },
    { id: '4', name: 'Pepper Soup', category: 'Soup', totalSold: 87, revenue: 435000, percentage: 14, trend: 'down' },
    { id: '5', name: 'Fried Rice', category: 'Main Course', totalSold: 76, revenue: 380000, percentage: 12, trend: 'up' },
    { id: '6', name: 'Suya', category: 'Appetizer', totalSold: 65, revenue: 325000, percentage: 10, trend: 'stable' },
    { id: '7', name: 'Chin Chin', category: 'Dessert', totalSold: 45, revenue: 225000, percentage: 7, trend: 'up' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'trending-neutral';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#00C851';
      case 'down': return '#FF4444';
      default: return colors.onSurfaceVariant;
    }
  };

  const renderBestSellerItem = ({ item, index }: { item: BestSellerItem; index: number }) => (
    <Card style={{ marginBottom: 12, backgroundColor: colors.surface }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: index < 3 ? '#007aff' : colors.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: index < 3 ? 'white' : colors.onSurfaceVariant,
                  }}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.onSurface,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <MaterialCommunityIcons
                name={getTrendIcon(item.trend) as any}
                size={20}
                color={getTrendColor(item.trend)}
              />
            </View>
            
            <Text
              style={{
                fontSize: 12,
                color: colors.onSurfaceVariant,
                marginBottom: 8,
                marginLeft: 36,
              }}
            >
              {item.category}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 36 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.onSurface }}>
                  {item.totalSold} {t('sold')}
                </Text>
                <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                  {item.percentage}% {t('of_total')}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#007aff' }}>
                  {item.revenue.toLocaleString()} XAF
                </Text>
                <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                  {t('revenue')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.onBackground }}>
            {t('best_sellers')}
          </Text>
          <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 }}>
            {t('top_performing_menu_items')}
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={{ padding: 16 }}>
          <Card style={{ backgroundColor: colors.surface }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007aff' }}>
                    {bestSellers.reduce((sum, item) => sum + item.totalSold, 0)}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    {t('total_items_sold')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#00C851' }}>
                    {bestSellers.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    {t('total_revenue')} (XAF)
                  </Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF8800' }}>
                    {Math.round(bestSellers.reduce((sum, item) => sum + item.revenue, 0) / bestSellers.reduce((sum, item) => sum + item.totalSold, 0)).toLocaleString()}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    {t('avg_price')} (XAF)
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Best Sellers List */}
        <FlatList
          data={bestSellers}
          renderItem={renderBestSellerItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </CommonView>
  );
};

export default BestSellers;