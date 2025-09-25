import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Searchbar, Chip, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import {
  Typography,
  Heading1,
  Heading4,
  Heading5,
  Body,
  Label,
  LabelLarge,
  Caption,
} from '@/src/components/common/Typography';

interface HistoryOrder {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'completed' | 'cancelled';
  orderDate: string;
  completedTime: string;
  restaurant: string;
  rating?: number;
}

const OrderHistoryScreen: React.FC<
  RootStackScreenProps<'RestaurantOrderHistory'>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const [historyOrders, setHistoryOrders] = useState<HistoryOrder[]>([]);

  // Filter orders based on selected filter and search query
  const filteredOrders = historyOrders.filter((order) => {
    const matchesFilter =
      selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: HistoryOrder['status']) => {
    switch (status) {
      case 'completed':
        return colors.success || '#34C759';
      case 'cancelled':
        return colors.error;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Typography
            key={`star-${star}`}
            variant="label"
            style={{
              color: star <= rating ? '#FFD700' : colors.outline,
              marginRight: 2,
            }}
          >
            ★
          </Typography>
        ))}
        <Caption color={colors.onSurfaceVariant} style={{ marginLeft: 4 }}>
          ({rating}/5)
        </Caption>
      </View>
    );
  };

  const HistoryCard = ({
    item,
    index,
  }: {
    item: HistoryOrder;
    index: number;
  }) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [index, scaleAnim]);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: colors.shadow || '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => {
            /* Navigate to order details */
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <LabelLarge color={colors.onBackground} weight="semibold">
              {t('order_prefix')}
              {item.id}
            </LabelLarge>
            <View
              style={{
                backgroundColor: getStatusColor(item.status),
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 16,
              }}
            >
              <Caption
                color={colors.onBackground}
                weight="semibold"
                style={{ textTransform: 'uppercase' }}
              >
                {item.status}
              </Caption>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Label color={colors.onBackground}>{item.customerName}</Label>
            <Body color={colors.onBackground}>{item.completedTime}</Body>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Body color={colors.primary} style={{ marginBottom: 4 }}>
              📍 {item.restaurant}
            </Body>
            <Caption color={colors.onSurfaceVariant}>
              📅{' '}
              {new Date(item.orderDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Caption>
          </View>

          {item.rating && (
            <View style={{ marginBottom: 8 }}>{renderStars(item.rating)}</View>
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.outline,
              paddingTop: 8,
            }}
          >
            <Body color={colors.onSurfaceVariant} style={{ marginBottom: 8 }}>
              {item.items.join(', ')}
            </Body>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <LabelLarge color={colors.primary} weight="bold">
                {item.total.toLocaleString()} {t('currency_xaf')}
              </LabelLarge>
              {item.status === 'completed' && (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    /* Reorder functionality */
                  }}
                >
                  <Caption color={colors.onBackground} weight="semibold">
                    {t('reorder')}
                  </Caption>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHistoryCard = ({
    item,
    index,
  }: {
    item: HistoryOrder;
    index: number;
  }) => <HistoryCard item={item} index={index} />;

  const getTotalOrders = () => filteredOrders.length;
  const getCompletedOrders = () =>
    filteredOrders.filter((order) => order.status === 'completed').length;
  const getTotalRevenue = () =>
    filteredOrders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 24, marginTop: 8 }}>
          <Heading1 color={colors.onBackground} weight="bold">
            {t('order_history')}
          </Heading1>
          <Body color={colors.onBackground} style={{ marginTop: 8 }}>
            {t('view_past_orders')}
          </Body>
        </View>

        {/* Stats Summary */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: colors.surfaceVariant,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Heading4 color={colors.primary} weight="bold">
              {getTotalOrders()}
            </Heading4>
            <Caption color={colors.onBackground}>{t('total_orders')}</Caption>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Heading4 color={colors.success || '#34C759'} weight="bold">
              {getCompletedOrders()}
            </Heading4>
            <Caption color={colors.onBackground}>{t('completed')}</Caption>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Heading4 color={colors.warning || '#FF9500'} weight="bold">
              {getTotalRevenue().toLocaleString()} {t('currency_xaf')}
            </Heading4>
            <Caption color={colors.onBackground}>{t('revenue')}</Caption>
          </View>
        </View>

        <Searchbar
          placeholder={t('search_order_history')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            marginBottom: 16,
            borderRadius: 12,
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
          }}
          iconColor={colors.onBackground}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {['all', 'completed', 'cancelled'].map((filter) => (
            <Chip
              key={`filter-${filter}`}
              selected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
              style={{
                marginRight: 8,
                height: 35,
                backgroundColor:
                  selectedFilter === filter ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.outline,
              }}
              textStyle={{
                color: selectedFilter === filter ? 'white' : colors.onSurface,
              }}
              selectedColor="white"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Chip>
          ))}
        </ScrollView>

        <FlatList
          data={filteredOrders}
          renderItem={renderHistoryCard}
          keyExtractor={(item) => `history-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Label color={colors.onBackground}>
                {t('no_order_history_found')}
              </Label>
              <Body color="#999" style={{ marginTop: 4 }}>
                {t('past_orders_description')}
              </Body>
            </View>
          )}
        />
      </View>
    </CommonView>
  );
};

export default OrderHistoryScreen;
