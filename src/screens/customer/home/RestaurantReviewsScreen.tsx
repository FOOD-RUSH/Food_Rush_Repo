import { MaterialIcon, IoniconsIcon } from '@/src/components/common/icons';
import React, { useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useRestaurantReviews } from '@/src/hooks/customer/useCustomerApi';
import { RestaurantReview } from '@/src/types';
import Avatar from '@/src/components/common/Avatar';
import CommonView from '@/src/components/common/CommonView';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';

const { width: screenWidth } = Dimensions.get('window');

interface ReviewItemProps {
  review: RestaurantReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

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
        <IoniconsIcon           key={i}
          name={i <= score ? 'star' : 'star-outline'}
          size={16}
          color={i <= score ? '#FFD700' : colors.onSurfaceVariant}
        />,
      );
    }
    return stars;
  };

  return (
    <View
      className="p-4 mb-3 rounded-lg"
      style={{ backgroundColor: colors.surface }}
    >
      {/* User Info and Rating */}
      <View className="flex-row items-center mb-3">
        <Avatar
          profilePicture={review.user.profilePicture}
          fullName={review.user.fullName}
          size={40}
        />
        <View className="flex-1 ml-3">
          <Text
            className="font-semibold text-base"
            style={{ color: colors.onSurface }}
          >
            {review.user.fullName}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="flex-row mr-2">{renderStars(review.score)}</View>
            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              {formatDate(review.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Review Text */}
      {review.review && (
        <Text className="text-sm leading-5" style={{ color: colors.onSurface }}>
          {review.review}
        </Text>
      )}
    </View>
  );
};

const RestaurantReviewsScreen: React.FC<
  RootStackScreenProps<'RestaurantReviews'>
> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { restaurantId, restaurantName } = route.params;

  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useRestaurantReviews(restaurantId);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: `${restaurantName} ${t('reviews')}` });
  }, [navigation, restaurantName, t]);

  const reviewStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
      };
    }

    const totalReviews = reviews.length;
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    const averageRating = totalScore / totalReviews;

    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      ratingDistribution[review.score - 1]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  }, [reviews]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderHeader = () => (
    <View className="mb-6">
      {/* Overall Rating */}
      <View
        className="p-6 rounded-lg mb-4"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="items-center">
          <Text
            className="text-4xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            {reviewStats.averageRating.toFixed(1)}
          </Text>
          <View className="flex-row mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <IoniconsIcon                 key={star}
                name={
                  star <= reviewStats.averageRating ? 'star' : 'star-outline'
                }
                size={24}
                color={
                  star <= reviewStats.averageRating
                    ? '#FFD700'
                    : colors.onSurfaceVariant
                }
              />
            ))}
          </View>
          <Text
            className="text-base"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('based_on_reviews', { count: reviewStats.totalReviews })}
          </Text>
        </View>

        {/* Rating Distribution */}
        <View className="mt-6">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewStats.ratingDistribution[rating - 1];
            const percentage =
              reviewStats.totalReviews > 0
                ? (count / reviewStats.totalReviews) * 100
                : 0;

            return (
              <View key={rating} className="flex-row items-center mb-2">
                <Text
                  className="w-2 text-sm"
                  style={{ color: colors.onSurface }}
                >
                  {rating}
                </Text>
                <IoniconsIcon                   name="star"
                  size={16}
                  color="#FFD700"
                  style={{ marginLeft: 4, marginRight: 8 }}
                />
                <View
                  className="flex-1 h-2 rounded-full mr-3"
                  style={{ backgroundColor: colors.surfaceVariant }}
                >
                  <View
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: colors.primary,
                      width: `${percentage}%`,
                    }}
                  />
                </View>
                <Text
                  className="w-8 text-sm text-right"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {count}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Reviews Header */}
      <Text
        className="text-xl font-bold mb-4"
        style={{ color: colors.onSurface }}
      >
        {t('customer_reviews')}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <MaterialIcon         name="rate-review"
        size={64}
        color={colors.onSurfaceVariant}
      />
      <Text
        className="text-lg font-semibold mt-4 mb-2"
        style={{ color: colors.onSurface }}
      >
        {t('no_reviews_yet')}
      </Text>
      <Text
        className="text-center px-8"
        style={{ color: colors.onSurfaceVariant }}
      >
        {t('be_first_to_review')}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4" style={{ color: colors.onSurfaceVariant }}>
            {t('loading_reviews')}
          </Text>
        </View>
      </CommonView>
    );
  }

  if (error) {
    return (
      <CommonView>
        <StatusBar translucent backgroundColor="transparent" />

        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={handleGoBack} className="mr-4">
            <MaterialIcon               name="arrow-back"
              size={24}
              color={colors.onSurface}
            />
          </TouchableOpacity>
          <Text
            className="text-lg font-semibold flex-1"
            style={{ color: colors.onSurface }}
            numberOfLines={1}
          >
            {restaurantName} {t('reviews')}
          </Text>
        </View>

        <View className="flex-1 px-4 py-6">
          <ErrorDisplay error={t('failed_to_load_reviews')} onRetry={refetch} />
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Content */}
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
    </CommonView>
  );
};

export default RestaurantReviewsScreen;
