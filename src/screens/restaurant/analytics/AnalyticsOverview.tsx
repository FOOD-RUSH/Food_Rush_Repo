import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme, Card } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import {
  RestaurantAnalyticsStackScreenProps,
  RootStackParamList,
} from '@/src/navigation/types';
import { useRestaurantReviewStats } from '@/src/hooks/restaurant/useRestaurantReviews';
import { useRestaurantProfile } from '@/src/hooks/restaurant/useRestaurantApi';
import { useRestaurantProfileData } from '@/src/stores/restaurantStores';
import {
  useAnalyticsSummary,
  useRevenueBuckets,
  useRestaurantBalance,
  useAnalyticsData,
  useDoualaDateRange,
} from '@/src/hooks/restaurant/useAnalytics';
import {
  Typography,
  Heading1,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';

// Analytics components
import MetricCard from '@/src/components/restaurant/analytics/MetricCard';
import SimpleBarChart from '@/src/components/restaurant/analytics/SimpleBarChart';
import BreakdownCard from '@/src/components/restaurant/analytics/BreakdownCard';
import PeriodSelector, {
  AnalyticsPeriodOption,
} from '@/src/components/restaurant/analytics/PeriodSelector';

// Analytics utilities
import {
  convertToMetricCards,
  convertToChartData,
  getOrderStatusBreakdown,
  getPaymentMethodBreakdown,
  getOperatorBreakdown,
  generateDateRange,
} from '@/src/utils/analyticsUtils';

// Types for breakdown data
interface BreakdownItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const AnalyticsOverview: React.FC<
  RestaurantAnalyticsStackScreenProps<'AnalyticsOverview'>
> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [selectedPeriod, setSelectedPeriod] =
    useState<AnalyticsPeriodOption>('7days');
  const [refreshing, setRefreshing] = useState(false);

  // Get restaurant profile from store (primary) and API (fallback)
  const restaurantProfileFromStore = useRestaurantProfileData();
  const { data: restaurantProfileFromAPI } = useRestaurantProfile();
  
  // Prioritize store data, fallback to API data
  const restaurantProfile = restaurantProfileFromStore || restaurantProfileFromAPI?.data;
  const restaurantId = restaurantProfile?.id;
  
  const { data: reviewStats } = useRestaurantReviewStats(restaurantId || '');

  // Calculate days for selected period
  const days = useMemo(() => {
    return selectedPeriod === 'today'
      ? 1
      : selectedPeriod === 'yesterday'
        ? 1
        : selectedPeriod === '7days'
          ? 7
          : 30;
  }, [selectedPeriod]);

  // Generate date range for selected period using Africa/Douala timezone
  const dateRange = useDoualaDateRange(days);

  // Fetch analytics data using new API endpoints
  const {
    summary: analyticsData,
    balance: balanceData,
    revenue: revenueData,
    isLoading,
    isError: hasError,
    error: combinedError,
    refetch: refetchAll,
  } = useAnalyticsData('daily', dateRange);

  // Process analytics data with proper error handling
  const metricCards = useMemo(() => {
    try {
      if (!analyticsData?.data) return [];
      return convertToMetricCards(analyticsData.data);
    } catch (error) {
      console.error('Error processing metric cards:', error);
      return [];
    }
  }, [analyticsData]);

  const chartData = useMemo(() => {
    try {
      if (!revenueData?.data) return [];
      return convertToChartData(revenueData.data);
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  }, [revenueData]);

  const orderStatusBreakdown = useMemo((): BreakdownItem[] => {
    try {
      if (!analyticsData?.data?.counts) return [];
      return getOrderStatusBreakdown(analyticsData.data.counts).map((item) => ({
        label: item.status || 'Unknown',
        count: item.count || 0,
        percentage: item.percentage || 0,
        color: item.color || colors.primary,
      }));
    } catch (error) {
      console.error('Error processing order status breakdown:', error);
      return [];
    }
  }, [analyticsData, colors.primary]);

  const paymentMethodBreakdown = useMemo((): BreakdownItem[] => {
    try {
      if (!analyticsData?.data?.paymentMethod) return [];
      return getPaymentMethodBreakdown(analyticsData.data.paymentMethod).map(
        (item) => ({
          label: item.method || 'Unknown',
          count: item.count || 0,
          percentage: item.percentage || 0,
          color: item.color || colors.primary,
        }),
      );
    } catch (error) {
      console.error('Error processing payment method breakdown:', error);
      return [];
    }
  }, [analyticsData, colors.primary]);

  const operatorBreakdown = useMemo((): BreakdownItem[] => {
    try {
      if (!analyticsData?.data?.operator) return [];
      return getOperatorBreakdown(analyticsData.data.operator).map((item) => ({
        label: item.operator || 'Unknown',
        count: item.count || 0,
        percentage: item.percentage || 0,
        color: item.color || colors.primary,
      }));
    } catch (error) {
      console.error('Error processing operator breakdown:', error);
      return [];
    }
  }, [analyticsData, colors.primary]);

  const periods = useMemo(
    () => [
      { key: 'today' as const, label: t('today') },
      { key: 'yesterday' as const, label: t('yesterday') },
      { key: '7days' as const, label: t('7_days') },
      { key: '30days' as const, label: t('30_days') },
    ],
    [t],
  );

  const handleViewReviews = useCallback(() => {
    try {
      Haptics.selectionAsync();

      //Validate required data before navigation
      if (!restaurantProfile?.id) {
        console.warn('Cannot navigate to reviews: Restaurant ID not available');
        return;
      }

      if (!navigation) {
        console.warn('Cannot navigate to reviews: Navigation not available');
        return;
      }

      // Type-safe navigation with proper error handling
      console.log(
        'Navigating to customer reviews for restaurant:',
        restaurantProfile.id,
      );

      navigation.navigate('RestaurantCustomerReviews', {
        restaurantId: restaurantProfile.id || '12345',
        restaurantName: restaurantProfile.name || 'Restaurant',
      });
    } catch (error) {
      console.error('Navigation error when trying to view reviews:', error);
      // Could show a toast or alert here if needed
    }
  }, [navigation, restaurantProfile]);

  const handleViewTimeHeatmap = useCallback(() => {
    try {
      Haptics.selectionAsync();
      if (navigation) {
        navigation.navigate('RestaurantTimeHeatmap');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchAll();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchAll]);

  // Helper function to render metric cards safely
  const renderMetricCards = (
    cards: any[],
    startIndex: number,
    count: number,
  ) => {
    return cards
      .slice(startIndex, startIndex + count)
      .map((card, index) => (
        <MetricCard key={`${startIndex}-${index}`} {...card} />
      ));
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
            tintColor={'#007aff'}
          />
        }
      >
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Heading1 color={colors.onBackground} weight="bold">
            {t('analytics')}
          </Heading1>
          <Body color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
            {t('track_your_performance')}
          </Body>
        </View>

        {/* Period Selector */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          periods={periods}
        />

        {/* Error State */}
        {hasError && (
          <View style={{ padding: 16 }}>
            <Card
              style={{
                backgroundColor: colors.errorContainer,
                borderRadius: 16,
              }}
            >
              <View style={{ padding: 16, alignItems: 'center' }}>
                <MaterialCommunityIcon                   name="alert-circle"
                  size={48}
                  color={colors.onErrorContainer}
                />
                <Heading5
                  color={colors.onErrorContainer}
                  weight="bold"
                  style={{ marginTop: 8, marginBottom: 4 }}
                >
                  {t('error_loading_analytics')}
                </Heading5>
                <Body color={colors.onErrorContainer} align="center">
                  {t('please_try_again_later')}
                </Body>
                <TouchableOpacity
                  onPress={onRefresh}
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: colors.onErrorContainer,
                    borderRadius: 8,
                  }}
                >
                  <Label color={colors.errorContainer} weight="semibold">
                    {t('retry')}
                  </Label>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Loading State */}
        {isLoading && !hasError && (
          <View style={{ padding: 16 }}>
            <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
              <View style={{ padding: 32, alignItems: 'center' }}>
                <MaterialCommunityIcon                   name="loading"
                  size={48}
                  color={colors.onSurfaceVariant}
                />
                <Body color={colors.onSurfaceVariant} style={{ marginTop: 8 }}>
                  {t('loading_analytics')}
                </Body>
              </View>
            </Card>
          </View>
        )}

        {/* Analytics Content */}
        {!isLoading && !hasError && analyticsData && (
          <>
            {/* Restaurant Balance */}
            {balanceData?.data && (
              <View style={{ padding: 16 }}>
                <Card
                  style={{ backgroundColor: colors.surface, borderRadius: 16 }}
                >
                  <View style={{ padding: 16 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <Heading5 color={colors.onSurface} weight="bold">
                        {t('account_balance')}
                      </Heading5>
                      <MaterialCommunityIcon                         name="wallet"
                        size={24}
                        color={colors.primary}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        marginBottom: 8,
                      }}
                    >
                      <Typography
                        variant="h3"
                        style={{ color: colors.primary, fontWeight: 'bold' }}
                      >
                        {(balanceData.data?.balance || 0).toLocaleString()}
                      </Typography>
                      <Caption
                        color={colors.onSurfaceVariant}
                        style={{ marginLeft: 4 }}
                      >
                        {balanceData.data?.currency || 'XAF'}
                      </Caption>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View>
                        <Caption color={colors.onSurfaceVariant}>
                          {t('credits')}
                        </Caption>
                        <Label color={colors.onSurface} weight="semibold">
                          +{(balanceData.data?.credits || 0).toLocaleString()}{' '}
                          {balanceData.data?.currency || 'XAF'}
                        </Label>
                      </View>
                      <View>
                        <Caption color={colors.onSurfaceVariant}>
                          {t('debits')}
                        </Caption>
                        <Label color={colors.onSurface} weight="semibold">
                          -{(balanceData.data?.debits || 0).toLocaleString()}{' '}
                          {balanceData.data?.currency || 'XAF'}
                        </Label>
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            )}

            {/* Key Metrics */}
            {metricCards.length > 0 && (
              <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  {renderMetricCards(metricCards, 0, 2)}
                </View>
                {metricCards.length > 2 && (
                  <View style={{ flexDirection: 'row' }}>
                    {renderMetricCards(metricCards, 2, 2)}
                  </View>
                )}
              </View>
            )}

            {/* Revenue Chart */}
            {chartData.length > 0 && (
              <View style={{ padding: 16 }}>
                <Card
                  style={{ backgroundColor: colors.surface, borderRadius: 16 }}
                >
                  <View style={{ padding: 16 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <Heading5 color={colors.onSurface} weight="bold">
                        {t('revenue_trend')}
                      </Heading5>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <MaterialCommunityIcon                           name="chart-line"
                          size={16}
                          color={colors.onSurfaceVariant}
                        />
                        <Caption
                          color={colors.onSurfaceVariant}
                          style={{ marginLeft: 4 }}
                        >
                          {selectedPeriod === 'today'
                            ? t('hourly')
                            : t('daily')}
                        </Caption>
                      </View>
                    </View>
                    <SimpleBarChart data={chartData} maxHeight={120} />
                  </View>
                </Card>
              </View>
            )}

            {/* Order Status Breakdown */}
            {orderStatusBreakdown.length > 0 && (
              <View style={{ padding: 16, paddingTop: 0 }}>
                <BreakdownCard
                  title={t('order_status')}
                  data={orderStatusBreakdown}
                />
              </View>
            )}

            {/* Payment Methods */}
            {paymentMethodBreakdown.length > 0 && (
              <View style={{ padding: 16, paddingTop: 0 }}>
                <BreakdownCard
                  title={t('payment_methods')}
                  data={paymentMethodBreakdown}
                />
              </View>
            )}

            {/* Mobile Money Operators */}
            {operatorBreakdown.length > 0 && (
              <View style={{ padding: 16, paddingTop: 0 }}>
                <BreakdownCard
                  title={t('mobile_money_operators')}
                  data={operatorBreakdown}
                />
              </View>
            )}
          </>
        )}

        {/* Quick Actions */}
        <View style={{ padding: 16 }}>
          <Heading5
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: 12 }}
          >
            {t('detailed_reports')}
          </Heading5>

          <Card
            style={{
              marginBottom: 12,
              backgroundColor: colors.surface,
              borderWidth: reviewStats && reviewStats.totalReviews > 0 ? 1 : 0,
              borderColor:
                reviewStats && reviewStats.averageRating >= 4
                  ? '#00D084'
                  : reviewStats && reviewStats.averageRating >= 3
                    ? '#FF9500'
                    : colors.outline,
            }}
          >
            <TouchableOpacity
              onPress={handleViewReviews}
              style={{
                padding: 16,
              
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                      backgroundColor: '#FF9500' + '20',
                      borderRadius: 12,
                      padding: 8,
                      marginRight: 12,
                    }}
                  >
                    <MaterialCommunityIcon                       name="star-circle"
                      size={24}
                      color="#FF9500"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Label
                      color={colors.onSurface}
                      weight="bold"
                      style={{ marginBottom: 4 }}
                    >
                      {t('customer_reviews')}
                    </Label>

                    {reviewStats && reviewStats.totalReviews > 0 ? (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 2,
                          }}
                        >
                          <Caption
                            color={
                              reviewStats.averageRating >= 4
                                ? '#00D084'
                                : reviewStats.averageRating >= 3
                                  ? '#FF9500'
                                  : '#FF3B30'
                            }
                            weight="bold"
                            style={{ marginRight: 4 }}
                          >
                            {reviewStats.averageRating.toFixed(1)} ★
                          </Caption>
                          <Caption color={colors.onSurfaceVariant}>
                            ({reviewStats.totalReviews}{' '}
                            {reviewStats.totalReviews === 1
                              ? t('review')
                              : t('reviews')}
                            )
                          </Caption>
                        </View>
                        <Caption color={colors.onSurfaceVariant}>
                          {t('tap_to_view_and_manage_reviews')}
                        </Caption>
                      </View>
                    ) : (
                      <Caption color={colors.onSurfaceVariant}>
                        {t('no_reviews_yet_tap_to_learn_more')}
                      </Caption>
                    )}
                  </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcon                     name="chevron-right"
                    size={24}
                    color={colors.primary}
                  />
                  {reviewStats && reviewStats.totalReviews > 0 && (
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: 8,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        marginTop: 4,
                      }}
                    >
                      <Caption
                        color={colors.onPrimary}
                        weight="bold"
                        style={{ fontSize: 10 }}
                      >
                        {reviewStats.totalReviews}
                      </Caption>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={{ marginBottom: 12, backgroundColor: colors.surface }}>
            <TouchableOpacity
              onPress={handleViewTimeHeatmap}
              style={{ padding: 16 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcon                     name="chart-timeline-variant"
                    size={24}
                    color="#007aff"
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Label color={colors.onSurface} weight="semibold">
                      {t('time_heatmap')}
                    </Label>
                    <Caption color={colors.onSurfaceVariant}>
                      {t('hourly_order_patterns')}
                    </Caption>
                  </View>
                </View>
                <MaterialCommunityIcon                   name="chevron-right"
                  size={24}
                  color={colors.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AnalyticsOverview;
