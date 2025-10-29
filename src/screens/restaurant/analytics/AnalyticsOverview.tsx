import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAnalyticsStackScreenProps } from '@/src/navigation/types';
import { useRestaurantReviewStats } from '@/src/hooks/restaurant/useRestaurantReviews';
import { useRestaurantProfile } from '@/src/hooks/restaurant/useRestaurantApi';
import { useRestaurantProfileData } from '@/src/stores/restaurantStores';
import {
  useAnalyticsSummary,
  useRestaurantBalance,
  useRevenueBuckets,
  generateDateRange,
} from '@/src/hooks/restaurant/useAnalytics';
import {
  Heading1,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';

import MetricCard from '@/src/components/restaurant/analytics/MetricCard';
import SimpleBarChart from '@/src/components/restaurant/analytics/SimpleBarChart';
import BreakdownCard from '@/src/components/restaurant/analytics/BreakdownCard';
import PeriodSelector, {
  AnalyticsPeriodOption,
} from '@/src/components/restaurant/analytics/PeriodSelector';

import {
  convertToMetricCards,
  convertToChartData,
  getOrderStatusBreakdown,
  getPaymentMethodBreakdown,
  getOperatorBreakdown,
  formatLargeNumber,
} from '@/src/utils/analyticsUtils';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';

const AnalyticsOverview: React.FC<
  RestaurantAnalyticsStackScreenProps<'AnalyticsOverview'>
> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useFloatingTabBarHeight();

  const [selectedPeriod, setSelectedPeriod] =
    useState<AnalyticsPeriodOption>('7days');
  const [refreshing, setRefreshing] = useState(false);

  // Get restaurant profile
  const restaurantProfileFromStore = useRestaurantProfileData();
  const { data: restaurantProfileFromAPI } = useRestaurantProfile();
  const restaurantProfile =
    restaurantProfileFromStore || restaurantProfileFromAPI?.data;
  const restaurantId = restaurantProfile?.id;

  const { data: reviewStats } = useRestaurantReviewStats(restaurantId || '');

  // Calculate date range
  const dateRange = useMemo(
    () => generateDateRange(selectedPeriod),
    [selectedPeriod],
  );

  // Fetch analytics data with WebSocket support
  const summaryQuery = useAnalyticsSummary(dateRange);
  const balanceQuery = useRestaurantBalance();
  const revenueQuery = useRevenueBuckets('daily', dateRange);

  // Loading states
  const isLoading =
    summaryQuery.isLoading || balanceQuery.isLoading || revenueQuery.isLoading;
  const isFetching =
    summaryQuery.isFetching ||
    balanceQuery.isFetching ||
    revenueQuery.isFetching;
  const hasError =
    summaryQuery.isError && balanceQuery.isError && revenueQuery.isError;

  // Extract data safely
  const summaryData = summaryQuery.data?.data ?? null;
  const balanceInfo = balanceQuery.data?.data ?? null;
  const revenueInfo = revenueQuery.data?.data ?? [];

  // Process metric cards
  const metricCards = useMemo(
    () => convertToMetricCards(summaryData, null, isLoading),
    [summaryData, isLoading],
  );

  // Process chart data
  const chartData = useMemo(
    () => convertToChartData(revenueInfo, colors.primary, isLoading),
    [revenueInfo, colors.primary, isLoading],
  );

  // Process breakdowns
  const orderStatusBreakdown = useMemo(
    () =>
      getOrderStatusBreakdown(summaryData?.counts, isLoading).map((item) => ({
        label: item.status ?? t('unknown'),
        count: item.count ?? 0,
        percentage: item.percentage ?? 0,
        color: item.color ?? colors.primary,
      })),
    [summaryData?.counts, isLoading, colors.primary, t],
  );

  const paymentMethodBreakdown = useMemo(
    () =>
      getPaymentMethodBreakdown(summaryData?.paymentMethod, isLoading).map(
        (item) => ({
          label: item.method ?? t('unknown'),
          count: item.count ?? 0,
          percentage: item.percentage ?? 0,
          color: item.color ?? colors.primary,
        }),
      ),
    [summaryData?.paymentMethod, isLoading, colors.primary, t],
  );

  const operatorBreakdown = useMemo(
    () =>
      getOperatorBreakdown(summaryData?.operator, isLoading).map((item) => ({
        label: item.operator ?? t('unknown'),
        count: item.count ?? 0,
        percentage: item.percentage ?? 0,
        color: item.color ?? colors.primary,
      })),
    [summaryData?.operator, isLoading, colors.primary, t],
  );

  // Period options
  const periods = useMemo(
    () => [
      { key: 'today' as const, label: t('today') },
      { key: 'yesterday' as const, label: t('yesterday') },
      { key: '7days' as const, label: t('7_days') },
      { key: '30days' as const, label: t('30_days') },
    ],
    [t],
  );

  // Event handlers
  const handleViewReviews = useCallback(() => {
    Haptics.selectionAsync();
    if (restaurantProfile?.id) {
      navigation.navigate('RestaurantCustomerReviews', {
        restaurantId: restaurantProfile.id,
        restaurantName: restaurantProfile.name || t('restaurant'),
      });
    }
  }, [navigation, restaurantProfile, t]);

  const handleViewTimeHeatmap = useCallback(() => {
    Haptics.selectionAsync();
    navigation?.navigate('RestaurantTimeHeatmap');
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        summaryQuery.refetch(),
        balanceQuery.refetch(),
        revenueQuery.refetch(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [summaryQuery, balanceQuery, revenueQuery]);

  // Render metric cards
  const renderMetricCards = useCallback(
    (cards: typeof metricCards, startIndex: number, count: number) => {
      return cards.slice(startIndex, startIndex + count).map((card, index) => (
        <View key={`${startIndex}-${index}`} style={{ flex: 1, padding: 6 }}>
          <MetricCard {...card} isLoading={isLoading} />
        </View>
      ));
    },
    [isLoading],
  );

  // Format balance
  const formatBalance = useCallback(
    (value?: number | null) => (value == null ? '0' : formatLargeNumber(value)),
    [],
  );

  const currency = balanceInfo?.currency ?? 'XAF';

  return (
    <CommonView>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Header Section */}
          <View style={{ padding: 16, paddingBottom: 8 }}>
            <Heading1 color={colors.onBackground} weight="bold">
              {t('analytics')}
            </Heading1>
            <Body color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
              {t('track_your_performance')}
            </Body>

            {/* Real-time update indicator */}
            {isFetching && !refreshing && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <ActivityIndicator size="small" color={colors.primary} />
                <Body color={colors.onSurfaceVariant} style={{ marginLeft: 8 }}>
                  {t('updating_data')}...
                </Body>
              </View>
            )}
          </View>

          {/* Period Selector */}
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            periods={periods}
          />

          {/* Error State */}
          {hasError && !isLoading && (
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <Card
                style={{
                  backgroundColor: colors.errorContainer,
                  borderRadius: 12,
                }}
              >
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <MaterialCommunityIcon
                    name="alert-circle"
                    size={48}
                    color={colors.onErrorContainer}
                  />
                  <Heading5
                    color={colors.onErrorContainer}
                    weight="bold"
                    style={{
                      marginTop: 12,
                      marginBottom: 6,
                      textAlign: 'center',
                    }}
                  >
                    {t('error_loading_analytics')}
                  </Heading5>
                  <Body
                    color={colors.onErrorContainer}
                    align="center"
                    style={{ marginBottom: 16 }}
                  >
                    {t('please_try_again_later')}
                  </Body>
                  <TouchableOpacity
                    onPress={onRefresh}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 10,
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

          {/* Restaurant Balance Card */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Card
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                elevation: 2,
              }}
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
                    {t('account_balance')}
                  </Heading5>
                  <View
                    style={{
                      backgroundColor: colors.primaryContainer,
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <MaterialCommunityIcon
                      name="wallet"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    marginBottom: 16,
                  }}
                >
                  <Heading1 color={colors.primary} weight="bold">
                    {formatBalance(balanceInfo?.balance)}
                  </Heading1>
                  <Caption
                    color={colors.onSurfaceVariant}
                    style={{ marginLeft: 6 }}
                  >
                    {currency}
                  </Caption>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.outlineVariant,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginBottom: 4 }}
                    >
                      {t('credits')}
                    </Caption>
                    <Label color={colors.onSurface} weight="semibold">
                      +{formatBalance(balanceInfo?.credits)} {currency}
                    </Label>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginBottom: 4 }}
                    >
                      {t('debits')}
                    </Caption>
                    <Label color={colors.onSurface} weight="semibold">
                      -{formatBalance(balanceInfo?.debits)} {currency}
                    </Label>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Key Metrics Grid */}
          <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', marginBottom: 0 }}>
              {renderMetricCards(metricCards, 0, 2)}
            </View>
            {metricCards.length > 2 && (
              <View style={{ flexDirection: 'row' }}>
                {renderMetricCards(metricCards, 2, 2)}
              </View>
            )}
          </View>

          {/* Revenue Trend Chart */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Card
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                elevation: 2,
              }}
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
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.surfaceVariant,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <MaterialCommunityIcon
                      name="chart-line"
                      size={14}
                      color={colors.onSurfaceVariant}
                    />
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginLeft: 4 }}
                    >
                      {selectedPeriod === 'today' ? t('hourly') : t('daily')}
                    </Caption>
                  </View>
                </View>

                {chartData.length > 0 ? (
                  <SimpleBarChart data={chartData} maxHeight={140} />
                ) : (
                  <View
                    style={{
                      height: 140,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.surfaceVariant + '30',
                      borderRadius: 8,
                    }}
                  >
                    <MaterialCommunityIcon
                      name="chart-line-variant"
                      size={48}
                      color={colors.onSurfaceVariant + '40'}
                    />
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginTop: 8 }}
                    >
                      {t('no_revenue_data_available')}
                    </Caption>
                  </View>
                )}
              </View>
            </Card>
          </View>

          {/* Order Status Breakdown */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <BreakdownCard
              title={t('order_status')}
              data={orderStatusBreakdown}
            />
          </View>

          {/* Payment Methods Breakdown */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <BreakdownCard
              title={t('payment_methods')}
              data={paymentMethodBreakdown}
            />
          </View>

          {/* Mobile Money Operators Breakdown */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <BreakdownCard
              title={t('mobile_money_operators')}
              data={operatorBreakdown}
            />
          </View>

          {/* Detailed Reports Section */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Heading5
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 12 }}
            >
              {t('detailed_reports')}
            </Heading5>

            {/* Customer Reviews Card */}
            <Card
              style={{
                marginBottom: 12,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth:
                  reviewStats?.totalReviews && reviewStats.totalReviews > 0
                    ? 1.5
                    : 0,
                borderColor:
                  reviewStats?.averageRating && reviewStats.averageRating >= 4
                    ? '#00D084'
                    : reviewStats?.averageRating &&
                        reviewStats.averageRating >= 3
                      ? '#FF9500'
                      : colors.outline,
                elevation: 2,
              }}
            >
              <TouchableOpacity onPress={handleViewReviews} activeOpacity={0.7}>
                <View style={{ padding: 16 }}>
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
                          backgroundColor: '#FF9500' + '15',
                          borderRadius: 12,
                          padding: 10,
                          marginRight: 12,
                        }}
                      >
                        <MaterialCommunityIcon
                          name="star-circle"
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

                        {reviewStats?.totalReviews &&
                        reviewStats.totalReviews > 0 ? (
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
                                {reviewStats.averageRating.toFixed(1)} ⭐
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

                    <MaterialCommunityIcon
                      name="chevron-right"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            {/* Time Heatmap Card */}
            <Card
              style={{
                marginBottom: 16,
                backgroundColor: colors.surface,
                borderRadius: 12,
                elevation: 2,
              }}
            >
              <TouchableOpacity
                onPress={handleViewTimeHeatmap}
                activeOpacity={0.7}
              >
                <View style={{ padding: 16 }}>
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
                          backgroundColor: colors.primaryContainer,
                          borderRadius: 12,
                          padding: 10,
                          marginRight: 12,
                        }}
                      >
                        <MaterialCommunityIcon
                          name="chart-timeline-variant"
                          size={24}
                          color={colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Label
                          color={colors.onSurface}
                          weight="semibold"
                          style={{ marginBottom: 4 }}
                        >
                          {t('time_heatmap')}
                        </Label>
                        <Caption color={colors.onSurfaceVariant}>
                          {t('hourly_order_patterns')}
                        </Caption>
                      </View>
                    </View>
                    <MaterialCommunityIcon
                      name="chevron-right"
                      size={24}
                      color={colors.onSurfaceVariant}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        </ScrollView>
      </View>
    </CommonView>
  );
};

export default AnalyticsOverview;
