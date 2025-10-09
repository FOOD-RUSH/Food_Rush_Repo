import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { useTransactionHistory, useTransactionStats } from '@/src/hooks/customer/useTransactionHistory';
import { Transaction } from '@/src/types/transaction';
import { images } from '@/assets/images';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatDate } from '@/src/utils/dateUtils';
import { formatCameroonTime } from '@/src/utils/timeUtils';

type TransactionHistoryScreenProps = RootStackScreenProps<'TransactionHistory'>;

const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isTablet, getResponsiveText } = useResponsive();
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  
  // Fetch transaction data
  const {
    data: transactionPages,
    isLoading,
    isError,

    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionHistory({
    status: selectedFilter === 'all' ? undefined : selectedFilter,
  });
  
  const { data: stats, isLoading: statsLoading } = useTransactionStats();
  
  // Flatten transactions from all pages
  const transactions = useMemo(() => {
    return transactionPages?.pages.flatMap(page => page.data.transactions) || [];
  }, [transactionPages]);
  
  // Get responsive dimensions
  const getCardDimensions = () => {
    if (isTablet) {
      return {
        padding: 16,
        borderRadius: 12,
        marginVertical: 6,
      };
    } else {
      return {
        padding: 14,
        borderRadius: 10,
        marginVertical: 4,
      };
    }
  };
  
  const cardDimensions = getCardDimensions();
  
  // Format date based on locale using custom utils
  const formatTransactionDate = (dateString: string) => {
    try {
      const date = formatDate(dateString);
      // Use custom formatCameroonTime with appropriate options
      return formatCameroonTime(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };
  
  // Get status color
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return colors.primary;
      case 'pending':
        return '#FF9500';
      case 'failed':
      case 'cancelled':
        return colors.error;
      default:
        return colors.onSurfaceVariant;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };
  
  // Get provider icon
  const getProviderIcon = (provider: 'mtn' | 'orange') => {
    return provider === 'mtn' ? images.Mobile_Money : images.Orange_Money;
  };
  
  // Filter options
  const filterOptions = [
    { key: 'all', label: t('all') },
    { key: 'completed', label: t('completed') },
    { key: 'pending', label: t('pending') },
    { key: 'failed', label: t('failed') },
  ];
  
  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Render transaction item
  const renderTransactionItem = useCallback(({ item }: { item: Transaction }) => {
    return (
      <Card
        mode="outlined"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.outline + '30',
          borderWidth: 1,
          borderRadius: cardDimensions.borderRadius,
          marginVertical: cardDimensions.marginVertical,
          marginHorizontal: 16,
        }}
      >
        <TouchableOpacity
          style={{ padding: cardDimensions.padding }}
          onPress={() => {
            // Navigate to transaction details
            navigation.navigate('TransactionDetails', { transactionId: item.id });
          }}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Provider Icon */}
            {/* <Image
              source={getProviderIcon(item.provider)}
              style={{ width: 32, height: 32, marginRight: 12 }}
              resizeMode="contain"
            /> */}
            
            {/* Transaction Details */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: getResponsiveText(16),
                    fontWeight: '600',
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {item.orderDetails?.restaurantName || t('food_order')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IoniconsIcon
                    name={getStatusIcon(item.status)}
                    size={16}
                    color={getStatusColor(item.status)}
                  />
                  <Text
                    style={{
                      fontSize: getResponsiveText(12),
                      color: getStatusColor(item.status),
                      marginLeft: 4,
                      fontWeight: '500',
                    }}
                  >
                    {t(item.status)}
                  </Text>
                </View>
              </View>
              
              <Text
                style={{
                  fontSize: getResponsiveText(14),
                  color: colors.onSurfaceVariant,
                  marginTop: 2,
                }}
              >
                {item.description}
              </Text>
              
              {/* Show payer name if available */}
              {item.payerName && (
                <Text
                  style={{
                    fontSize: getResponsiveText(12),
                    color: colors.onSurfaceVariant,
                    marginTop: 2,
                  }}
                >
                  {t('payer')}: {item.payerName}
                </Text>
              )}
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Text
                  style={{
                    fontSize: getResponsiveText(18),
                    fontWeight: 'bold',
                    color: colors.primary,
                  }}
                >
                  {item.amount.toLocaleString()} {item.currency}
                </Text>
                <Text
                  style={{
                    fontSize: getResponsiveText(12),
                    color: colors.onSurfaceVariant,
                  }}
                >
                  {formatTransactionDate(item.createdAt)}
                </Text>
              </View>
              
              {item.orderDetails && (
                <Text
                  style={{
                    fontSize: getResponsiveText(12),
                    color: colors.onSurfaceVariant,
                    marginTop: 4,
                  }}
                >
                  {t('items_count', { count: item.orderDetails.itemCount })}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  }, [colors.surface, colors.outline, colors.onSurface, colors.onSurfaceVariant, colors.primary, cardDimensions.borderRadius, cardDimensions.marginVertical, cardDimensions.padding, getResponsiveText, t, getStatusColor, navigation]);
  
  // Render filter button
  const renderFilterButton = useCallback(({ item }: { item: typeof filterOptions[0] }) => {
    const isSelected = selectedFilter === item.key;
    return (
      <TouchableOpacity
        onPress={() => setSelectedFilter(item.key as any)}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
          marginRight: 8,
        }}
      >
        <Text
          style={{
            fontSize: getResponsiveText(14),
            fontWeight: '500',
            color: isSelected ? colors.onPrimary : colors.onSurfaceVariant,
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedFilter, colors, getResponsiveText]);
  
  // Render stats card
  const renderStatsCard = () => {
    if (statsLoading || !stats) return null;
    
    return (
      <Card
        mode="outlined"
        style={{
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary + '30',
          borderWidth: 1,
          borderRadius: cardDimensions.borderRadius,
          margin: 16,
        }}
      >
        <View style={{ padding: cardDimensions.padding }}>
          <Text
            style={{
              fontSize: getResponsiveText(16),
              fontWeight: 'bold',
              color: colors.onPrimaryContainer,
              marginBottom: 12,
            }}
          >
            {t('transaction_summary')}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: getResponsiveText(20),
                  fontWeight: 'bold',
                  color: colors.onPrimaryContainer,
                }}
              >
                {stats.totalTransactions}
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveText(12),
                  color: colors.onPrimaryContainer,
                }}
              >
                {t('total')}
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: getResponsiveText(20),
                  fontWeight: 'bold',
                  color: colors.onPrimaryContainer,
                }}
              >
                {stats.totalAmount.toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveText(12),
                  color: colors.onPrimaryContainer,
                }}
              >
                XAF {t('spent')}
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: getResponsiveText(20),
                  fontWeight: 'bold',
                  color: colors.onPrimaryContainer,
                }}
              >
                {stats.successfulTransactions}
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveText(12),
                  color: colors.onPrimaryContainer,
                }}
              >
                {t('successful')}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <MaterialIcon
        name="receipt-long"
        size={80}
        color={colors.onSurfaceVariant}
      />
      <Text
        style={{
          fontSize: getResponsiveText(18),
          fontWeight: '600',
          color: colors.onSurface,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {t('no_transactions_found')}
      </Text>
      <Text
        style={{
          fontSize: getResponsiveText(14),
          color: colors.onSurfaceVariant,
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {t('transactions_will_appear_here')}
      </Text>
    </View>
  );
  
  // Render error state
  if (isError) {
    return (
      <CommonView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcon name="error-outline" size={80} color={colors.error} />
          <Text
            style={{
              fontSize: getResponsiveText(18),
              fontWeight: '600',
              color: colors.onSurface,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {t('failed_to_load_transactions')}
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: getResponsiveText(16),
                fontWeight: '600',
                color: colors.onPrimary,
              }}
            >
              {t('retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }
  
  return (
    <CommonView>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Stats Card */}
            {renderStatsCard()}
            
            {/* Filter Buttons */}
            <View style={{ marginBottom: 8 }}>
              <FlatList
                data={filterOptions}
                renderItem={renderFilterButton}
                keyExtractor={(item) => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            </View>
          </>
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </CommonView>
  );
};

export default TransactionHistoryScreen;