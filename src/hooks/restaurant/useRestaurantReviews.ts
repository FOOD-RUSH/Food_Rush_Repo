import { useQuery } from '@tanstack/react-query';
import { restaurantRatingsApi } from '@/src/services/restaurant/ratings';
import { RestaurantReview } from '@/src/types';

// Hook for getting restaurant reviews (for restaurant owners)
export const useRestaurantReviews = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-reviews', restaurantId],
    queryFn: async () => {
      const response = await restaurantRatingsApi(restaurantId);

      // Transform the API response to match our RestaurantReview interface
      const transformedReviews: RestaurantReview[] = response.data.data.map(
        (review) => ({
          id: review.id,
          score: review.score,
          review: review.review,
          createdAt: review.createdAt,
          user: {
            id: review.user.id,
            fullName: review.user.fullName,
            profilePicture: review.user.profilePicture,
          },
          // orderId is not provided by the API, so we'll remove it from the interface
        }),
      );

      return transformedReviews;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!restaurantId,
  });
};

// Hook for getting review statistics
export const useRestaurantReviewStats = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-review-stats', restaurantId],
    queryFn: async () => {
      const response = await restaurantRatingsApi(restaurantId);
      const reviews = response.data.data;

      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: [0, 0, 0, 0, 0],
          recentTrend: 'neutral' as const,
        };
      }

      const totalReviews = reviews.length;
      const totalScore = reviews.reduce(
        (sum: number, review) => sum + review.score,
        0,
      );
      const averageRating = totalScore / totalReviews;

      const ratingDistribution = [0, 0, 0, 0, 0];
      reviews.forEach((review) => {
        if (review.score >= 1 && review.score <= 5) {
          ratingDistribution[review.score - 1]++;
        }
      });

      // Calculate recent trend (last 10 reviews vs previous 10)
      // Sort by createdAt to get most recent first
      const sortedReviews = [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const recentReviews = sortedReviews.slice(
        0,
        Math.min(10, sortedReviews.length),
      );
      const previousReviews = sortedReviews.slice(
        10,
        Math.min(20, sortedReviews.length),
      );

      let recentTrend: 'up' | 'down' | 'neutral' = 'neutral';
      if (recentReviews.length > 0 && previousReviews.length > 0) {
        const recentAvg =
          recentReviews.reduce((sum: number, r) => sum + r.score, 0) /
          recentReviews.length;
        const previousAvg =
          previousReviews.reduce((sum: number, r) => sum + r.score, 0) /
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
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!restaurantId,
  });
};
