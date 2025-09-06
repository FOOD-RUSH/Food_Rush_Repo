import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';

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

const OrderHistoryScreen = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const [historyOrders, setHistoryOrders] = useState<HistoryOrder[]>([]);

  // Filter orders based on selected filter and search query
  const filteredOrders = historyOrders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.includes(searchQuery) ||
                         order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: HistoryOrder['status']) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={`star-${star}`}
            style={{
              color: star <= rating ? '#FFD700' : '#E5E5EA',
              fontSize: 16,
              marginRight: 2,
            }}
          >
            ★
          </Text>
        ))}
        <Text style={{ color: '#666', fontSize: 12, marginLeft: 4 }}>
          ({rating}/5)
        </Text>
      </View>
    );
  };

  const HistoryCard = ({ item, index }: { item: HistoryOrder; index: number }) => {
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
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => {/* Navigate to order details */}}
        >
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 8 
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
              Order #{item.id}
            </Text>
            <View style={{ 
              backgroundColor: getStatusColor(item.status), 
              paddingHorizontal: 12, 
              paddingVertical: 4, 
              borderRadius: 16 
            }}>
              <Text style={{ 
                color: 'white', 
                fontSize: 12, 
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {item.status}
              </Text>
            </View>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 8 
          }}>
            <Text style={{ color: '#666', fontSize: 16 }}>{item.customerName}</Text>
            <Text style={{ color: '#666', fontSize: 14 }}>{item.completedTime}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#007AFF', fontSize: 14, marginBottom: 4 }}>
              📍 {item.restaurant}
            </Text>
            <Text style={{ color: '#999', fontSize: 12 }}>
              📅 {new Date(item.orderDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          {item.rating && (
            <View style={{ marginBottom: 8 }}>
              {renderStars(item.rating)}
            </View>
          )}

          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: '#f0f0f0', 
            paddingTop: 8 
          }}>
            <Text style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
              {item.items.join(', ')}
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#007AFF',
              }}>
                ${item.total.toFixed(2)}
              </Text>
              {item.status === 'completed' && (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                  onPress={() => {/* Reorder functionality */}}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    {t('reorder')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHistoryCard = ({ item, index }: { item: HistoryOrder; index: number }) => (
    <HistoryCard item={item} index={index} />
  );

  const getTotalOrders = () => filteredOrders.length;
  const getCompletedOrders = () => filteredOrders.filter(order => order.status === 'completed').length;
  const getTotalRevenue = () => filteredOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>{t('order_history')}</Text>
          <Text style={{ color: '#666', marginTop: 8 }}>{t('view_past_orders')}</Text>
        </View>

        {/* Stats Summary */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007AFF' }}>
              {getTotalOrders()}
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{t('total_orders')}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#34C759' }}>
              {getCompletedOrders()}
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{t('completed')}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF9500' }}>
              ${getTotalRevenue().toFixed(2)}
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>{t('revenue')}</Text>
          </View>
        </View>

        <Searchbar
          placeholder={t('search_order_history')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 16, borderRadius: 12 }}
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
              style={{ marginRight: 8 }}
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
              <Text style={{ color: '#666', fontSize: 16 }}>{t('no_order_history_found')}</Text>
              <Text style={{ color: '#999', fontSize: 14, marginTop: 4 }}>
                {t('past_orders_description')}
              </Text>
            </View>
          )}
        />
      </View>
    </CommonView>
  );
};

export default OrderHistoryScreen;
