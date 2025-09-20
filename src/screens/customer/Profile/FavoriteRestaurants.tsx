import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import {
  useFavoriteRestaurants,
  useToggleFavorite,
} from '@/src/hooks/customer/useFavoriteRestaurants';
import { RestaurantCard as RestaurantCardType } from '@/src/types';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import {
  getResponsiveSpacing,
  isSmallDevice,
} from '@/src/utils/responsive';
import { useResponsive } from '@/src/hooks/useResponsive';

// Loading skeleton component
const RestaurantSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View
      className="mx-4 mb-4 p-4 rounded-xl"
      style={{ backgroundColor: colors.surfaceVariant }}
    >
      <View className="flex-row">
        <View
          className="w-24 h-24 rounded-lg mr-4"
          style={{ backgroundColor: colors.surface }}
        />
        <View className="flex-1 justify-center">
          <View
            className="h-6 rounded mb-2"
            style={{ backgroundColor: colors.surface }}
          />
          <View
            className="h-5 rounded mb-2 w-4/5"
            style={{ backgroundColor: colors.surface }}
          />
          <View
            className="h-5 rounded w-3/5"
            style={{ backgroundColor: colors.surface }}
          />
        </View>
      </View>
    </View>
  );
};

// Empty state component
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: colors.surfaceVariant }}
      >
        <Ionicons
          name="heart-outline"
          size={40}
          color={colors.onSurfaceVariant}
        />
      </View>

      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {t('no_favorite_restaurants', 'No Favorite Restaurants')}
      </Text>

      <Text
        className="text-base text-center mb-8 leading-6"
        style={{ color: colors.onSurfaceVariant }}
      >
        {t(
          'no_favorites_description',
          "You haven't added any restaurants to your favorites yet. Start exploring and save your favorite spots!",
        )}
      </Text>

      <TouchableOpacity
        className="px-6 py-3 rounded-full"
        style={{ backgroundColor: colors.primary }}
        onPress={onRefresh}
        activeOpacity={0.8}
      >
        <Text
          className="text-base font-medium"
          style={{ color: colors.onPrimary }}
        >
          {t('explore_restaurants', 'Explore Restaurants')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Restaurant item component
const FavoriteRestaurantItem = ({
  item,
  onToggleFavorite,
  onPress,
}: {
  item: RestaurantCardType;
  onToggleFavorite: (restaurantId: string) => void;
  onPress: (restaurant: RestaurantCardType) => void;
}) => {
  const { colors } = useTheme();
  const { scale } = useResponsive();

  const handleToggleFavorite = useCallback(
    (e: any) => {
      e.stopPropagation();
      Alert.alert(
        'Remove from Favorites',
        `Remove ${item.name} from your favorites?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => onToggleFavorite(item.id),
          },
        ],
      );
    },
    [item, onToggleFavorite],
  );

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <Card
        style={{
          margin: getResponsiveSpacing(8),
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          marginVertical: getResponsiveSpacing(12),
          borderColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.2)',
          minWidth: isSmallDevice ? scale(280) : scale(320),
          maxWidth: isSmallDevice ? scale(360) : scale(520),
          minHeight: scale(140),
          maxHeight: scale(200),
          padding: 12,
        }}
        className="rounded-xl relative"
      >
        {/* Favorite button */}
        <TouchableOpacity
          className="absolute top-4 right-4 z-10 p-2 rounded-full"
          style={{ backgroundColor: colors.surface }}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={20} color={colors.error} />
        </TouchableOpacity>

        <View className="flex-row">
          {/* Restaurant Image */}
          <View
            className="w-24 h-24 rounded-lg mr-4 items-center justify-center overflow-hidden"
            style={{ backgroundColor: colors.surfaceVariant }}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="restaurant-outline"
                size={40}
                color={colors.onSurfaceVariant}
              />
            )}
          </View>

          {/* Restaurant Info */}
          <View className="flex-1 justify-center">
            <View className="flex-row items-center mb-2">
              <Text
                className="text-xl font-bold flex-1 mr-2"
                style={{ color: colors.onSurface }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {!item.isOpen && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.errorContainer }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.onErrorContainer }}
                  >
                    Closed
                  </Text>
                </View>
              )}
            </View>

            <Text
              className="text-base mb-3"
              style={{ color: colors.onSurfaceVariant }}
              numberOfLines={2}
            >
              {item.address}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text
                  className="text-base ml-1 mr-4"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.rating?.toFixed(1) || 'N/A'}
                </Text>

                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.onSurfaceVariant}
                />
                <Text
                  className="text-base ml-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.estimatedDeliveryTime || 'N/A'}
                </Text>
              </View>

              {item.deliveryFee && (
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary }}
                >
                  {item.deliveryFee} FCFA
                </Text>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const FavoriteRestaurants = ({
  navigation,
}: RootStackScreenProps<'FavoriteRestaurantScreen'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const {
    data: favoriteRestaurants,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFavoriteRestaurants();

  const { toggleFavorite } = useToggleFavorite();

  const [refreshing, setRefreshing] = useState(false);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Handle restaurant press
  const handleRestaurantPress = useCallback(
    (restaurant: RestaurantCardType) => {
      navigation.navigate('RestaurantDetails', { restaurantId: restaurant.id });
    },
    [navigation],
  );

  // Handle toggle favorite
  const handleToggleFavorite = useCallback(
    async (restaurantId: string) => {
      try {
        await toggleFavorite(restaurantId);
        // Refetch to update the list
        refetch();
      } catch (error) {
        Alert.alert(
          t('error', 'Error'),
          t('failed_to_remove_favorite', 'Failed to remove from favorites'),
        );
      }
    },
    [toggleFavorite, refetch, t],
  );

  // Handle explore restaurants
  const handleExploreRestaurants = useCallback(() => {
    navigation.navigate('CustomerApp', {
      screen: 'Home',
      params: { screen: 'HomeScreen' },
    });
  }, [navigation]);

  // Loading state
  if (isLoading && !favoriteRestaurants) {
    return (
      <CommonView>
        <View className="flex-1 pt-4">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 mb-4">
            <Text
              className="text-xl font-bold"
              style={{ color: colors.onSurface }}
            >
              {t('favorite_restaurants', 'Favorite Restaurants')}
            </Text>
          </View>

          {/* Loading skeletons */}
          <View>
            {[1, 2, 3].map((index) => (
              <RestaurantSkeleton key={index} />
            ))}
          </View>
        </View>
      </CommonView>
    );
  }

  // Error state
  if (error && !favoriteRestaurants) {
    return (
      <CommonView>
        <View className="flex-1">
          <ErrorDisplay
            title={t('failed_to_load_favorites', 'Failed to load favorites')}
            message={error.message}
            onRetry={refetch}
          />
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View className="flex-1 pt-4">
        {/* Content */}
        {favoriteRestaurants && favoriteRestaurants.length > 0 ? (
          <FlatList
            data={favoriteRestaurants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FavoriteRestaurantItem
                item={item}
                onToggleFavorite={handleToggleFavorite}
                onPress={handleRestaurantPress}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing || isRefetching}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState onRefresh={handleExploreRestaurants} />
        )}
      </View>
    </CommonView>
  );
};

export default FavoriteRestaurants;
