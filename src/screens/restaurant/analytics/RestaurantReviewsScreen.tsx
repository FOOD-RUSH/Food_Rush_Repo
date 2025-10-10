import {
  MaterialCommunityIcon,
  IoniconsIcon,
} from '@/src/components/common/icons';
import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useTheme, Card, Chip, Searchbar } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import {
  Heading1,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import Avatar from '@/src/components/common/Avatar';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import { useRestaurantReviews } from '@/src/hooks/restaurant/useRestaurantReviews';
import { RestaurantReview } from '@/src/types';


interface ReviewItemProps {
  review: RestaurantReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IoniconsIcon
          key={i}
          name={i <= score ? 'star' : 'star-outline'}
          size={16}
          color={i <= score ? '#FFD700' : colors.onSurfaceVariant}
        />,
      );
    }
    return stars;
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return '#00D084'; // Green for excellent
    if (score >= 3) return '#FF9500'; // Orange for good
    return '#FF3B30'; // Red for poor
  };

  return (
    <Card style={{ marginBottom: 12, backgroundColor: colors.surface }}>
      <View style={{ padding: 16 }}>
        {/* User Info and Rating */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <Avatar
            profilePicture={review.user.profilePicture}
            fullName={review.user.fullName}
            size={48}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <View style={{ flex: 1 }}>
                <Label color={colors.onSurface} weight="bold">
                  {review.user.fullName}
                </Label>
                <Caption
                  color={colors.onSurfaceVariant}
                  style={{ marginTop: 2 }}
                >
                  {formatDate(review.createdAt)}
                </Caption>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: getScoreColor(review.score) + '20',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Caption color={getScoreColor(review.score)} weight="bold">
                      {review.score}.0
                    </Caption>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {renderStars(review.score)}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Review Text */}
        {review.review && (
          <View style={{ marginTop: 8 }}>
            <Body color={colors.onSurface} style={{ lineHeight: 20 }}>
              {review.review}
            </Body>
          </View>
        )}

        {/* Additional review info could go here if needed */}
      </View>
    </Card>
  );
};

const RestaurantReviewsScreen: React.FC<
  RootStackScreenProps<'RestaurantCustomerReviews'>
> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { restaurantId } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useRestaurantReviews(restaurantId);

  // Filter reviews based on search and rating
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];

    let filtered = reviews;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (review) =>
          review.user.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          review.review?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by rating
    if (selectedRating !== null) {
      filtered = filtered.filter((review) => review.score === selectedRating);
    }

    return filtered;
  }, [reviews, searchQuery, selectedRating]);

  const reviewStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
        recentTrend: 'neutral' as const,
      };
    }

    const totalReviews = reviews.length;
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    const averageRating = totalScore / totalReviews;

    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      ratingDistribution[review.score - 1]++;
    });

    // Calculate recent trend (last 10 reviews vs previous 10)
    const recentReviews = reviews.slice(0, Math.min(10, reviews.length));
    const previousReviews = reviews.slice(10, Math.min(20, reviews.length));

    let recentTrend: 'up' | 'down' | 'neutral' = 'neutral';
    if (recentReviews.length > 0 && previousReviews.length > 0) {
      const recentAvg =
        recentReviews.reduce((sum, r) => sum + r.score, 0) /
        recentReviews.length;
      const previousAvg =
        previousReviews.reduce((sum, r) => sum + r.score, 0) /
        previousReviews.length;

      if (recentAvg > previousAvg + 0.2) recentTrend = 'up';
      else if (recentAvg < previousAvg - 0.2) recentTrend = 'down';
    }

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
      recentTrend,
    };
  }, [reviews]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleRatingFilter = (rating: number) => {
    Haptics.selectionAsync();
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const renderHeader = () => (
    <View style={{ marginBottom: 16 }}>
      {/* Overall Rating Summary */}
      <Card style={{ backgroundColor: colors.surface, marginBottom: 16 }}>
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <View>
             
              <View
                style={{ flexDirection: 'row', marginTop: 4, marginBottom: 8 }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <IoniconsIcon
                    key={star}
                    name={
                      star <= reviewStats.averageRating
                        ? 'star'
                        : 'star-outline'
                    }
                    size={20}
                    color={
                      star <= reviewStats.averageRating
                        ? '#FFD700'
                        : colors.onSurfaceVariant
                    }
                  />
                ))}
              </View>
              <Caption color={colors.onSurfaceVariant}>
                {t('based_on_reviews', { count: reviewStats.totalReviews })}
              </Caption>
            </View>

            {/* Trend Indicator */}
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcon
                name={
                  reviewStats.recentTrend === 'up'
                    ? 'trending-up'
                    : reviewStats.recentTrend === 'down'
                      ? 'trending-down'
                      : 'trending-neutral'
                }
                size={32}
                color={
                  reviewStats.recentTrend === 'up'
                    ? '#00D084'
                    : reviewStats.recentTrend === 'down'
                      ? '#FF3B30'
                      : colors.onSurfaceVariant
                }
              />
              <Caption
                color={
                  reviewStats.recentTrend === 'up'
                    ? '#00D084'
                    : reviewStats.recentTrend === 'down'
                      ? '#FF3B30'
                      : colors.onSurfaceVariant
                }
                weight="semibold"
                style={{ marginTop: 4 }}
              >
                {t(`trend_${reviewStats.recentTrend}`)}
              </Caption>
            </View>
          </View>

          {/* Rating Distribution */}
          <View>
            <Label
              color={colors.onSurface}
              weight="semibold"
              style={{ marginBottom: 12 }}
            >
              {t('rating_breakdown')}
            </Label>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingDistribution[rating - 1];
              const percentage =
                reviewStats.totalReviews > 0
                  ? (count / reviewStats.totalReviews) * 100
                  : 0;

              return (
                <TouchableOpacity
                  key={rating}
                  onPress={() => handleRatingFilter(rating)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor:
                      selectedRating === rating
                        ? colors.primaryContainer
                        : 'transparent',
                  }}
                >
                  <Caption color={colors.onSurface} style={{ width: 12 }}>
                    {rating}
                  </Caption>
                  <IoniconsIcon
                    name="star"
                    size={14}
                    color="#FFD700"
                    style={{ marginLeft: 4, marginRight: 8 }}
                  />
                  <View
                    style={{
                      flex: 1,
                      height: 6,
                      backgroundColor: colors.surfaceVariant,
                      borderRadius: 3,
                      marginRight: 12,
                    }}
                  >
                    <View
                      style={{
                        height: 6,
                        backgroundColor: colors.primary,
                        borderRadius: 3,
                        width: `${percentage}%`,
                      }}
                    />
                  </View>
                  <Caption
                    color={colors.onSurfaceVariant}
                    style={{ width: 24, textAlign: 'right' }}
                  >
                    {count}
                  </Caption>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Card>

      {/* Search and Filters */}
      <View style={{ marginBottom: 16 }}>
        <Searchbar
          placeholder={t('search_reviews')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ backgroundColor: colors.surface, marginBottom: 12 }}
        />

        {/* Rating Filter Chips */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Chip
              key={rating}
              selected={selectedRating === rating}
              onPress={() => handleRatingFilter(rating)}
              style={{ marginRight: 8, marginBottom: 8 }}
              icon={() => (
                <IoniconsIcon
                  name="star"
                  size={14}
                  color={
                    selectedRating === rating
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant
                  }
                />
              )}
            >
              {rating} {t('stars')}
            </Chip>
          ))}
          {selectedRating && (
            <Chip
              onPress={() => setSelectedRating(null)}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              {t('clear_filter')}
            </Chip>
          )}
        </View>
      </View>

      {/* Results Count */}
      <View style={{ marginBottom: 16 }}>
        <Label color={colors.onSurface} weight="semibold">
          {filteredReviews.length === reviews?.length
            ? t('all_reviews_count', { count: filteredReviews.length })
            : t('filtered_reviews_count', {
                filtered: filteredReviews.length,
                total: reviews?.length || 0,
              })}
        </Label>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
      }}
    >
      <MaterialCommunityIcon
        name="star-outline"
        size={64}
        color={colors.onSurfaceVariant}
      />
      <Heading5
        color={colors.onSurface}
        weight="bold"
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        {searchQuery || selectedRating
          ? t('no_matching_reviews')
          : t('no_reviews_yet')}
      </Heading5>
      <Body
        color={colors.onSurfaceVariant}
        align="center"
        style={{ paddingHorizontal: 32 }}
      >
        {searchQuery || selectedRating
          ? t('try_different_search_or_filter')
          : t('reviews_will_appear_here')}
      </Body>
    </View>
  );

  if (error) {
    return (
      <CommonView>
        <View style={{ flex: 1, padding: 16 }}>
          <ErrorDisplay title={t('failed_to_load_reviews')} onRetry={refetch} />
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Heading1 color={colors.onBackground} weight="bold">
            {t('customer_reviews')}
          </Heading1>
          <Body color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
            {t('manage_and_respond_to_reviews')}
          </Body>
        </View>

        {/* Content */}
        <FlatList
          data={filteredReviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007aff']}
            />
          }
        />
      </View>
    </CommonView>
  );
};

export default RestaurantReviewsScreen;
