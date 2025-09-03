import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useFavoriteRestaurants, useToggleFavorite } from '@/src/hooks/customer/useFavoriteRestaurants';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { RestaurantCard as RestaurantCardType } from '@/src/types';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';

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
          className="w-20 h-20 rounded-lg mr-4"
          style={{ backgroundColor: colors.surface }}
        />
        <View className="flex-1">
          <View
            className="h-5 rounded mb-2"
            style={{ backgroundColor: colors.surface }}
          />
          <View
            className="h-4 rounded mb-1 w-3/4"
            style={{ backgroundColor: colors.surface }}
          />
          <View
            className="h-4 rounded w-1/2"
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
        {t('no_favorites_description', 'You haven\'t added any restaurants to your favorites yet. Start exploring and save your favorite spots!')}
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

  const handleToggleFavorite = useCallback((e: any) => {
    e.stopPropagation();
    Alert.alert(
      'Remove from Favorites',
      `Remove ${item.name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onToggleFavorite(item.restaurantId),
        },
      ]
    );
  }, [item, onToggleFavorite]);

  return (
    <TouchableOpacity
      className="mx-4 mb-4"
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View
        className="p-4 rounded-xl relative"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Favorite button */}
        <TouchableOpacity
          className="absolute top-4 right-4 z-10 p-2 rounded-full"
          style={{ backgroundColor: colors.surface }}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons
            name="heart"
            size={20}
            color={colors.error}
          />
        </TouchableOpacity>

        <View className="flex-row">
          {/* Restaurant Image */}
          <View
            className="w-20 h-20 rounded-lg mr-4 items-center justify-center"
            style={{ backgroundColor: colors.surfaceVariant }}
          >
            {item.imageUrl ? (
              <View className="w-full h-full rounded-lg bg-gray-200" />
            ) : (
              <Ionicons
                name="restaurant-outline"
                size={30}
                color={colors.onSurfaceVariant}
              />
            )}
          </View>

          {/* Restaurant Info */}
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text
                className="text-lg font-semibold flex-1 mr-2"
                style={{ color: colors.onSurface }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {!item.isOpen && (
                <View
                  className="px-2 py-1 rounded-full"
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
              className="text-sm mb-2"
              style={{ color: colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {item.address}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="star"
                  size={14}
                  color="#fbbf24"
                />
                <Text
                  className="text-sm ml-1 mr-3"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.rating?.toFixed(1) || 'N/A'}
                </Text>

                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.onSurfaceVariant}
                />
                <Text
                  className="text-sm ml-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.estimatedDeliveryTime || 'N/A'}
                </Text>
              </View>

              {item.deliveryFee && (
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  {item.deliveryFee} FCFA
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FavoriteRestaurants = ({
  navigation,
}: RootStackScreenProps<'FavoriteRestaurantScreen'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const user = useAuthUser();

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
  const handleRestaurantPress = useCallback((restaurant: RestaurantCardType) => {
    navigation.navigate('RestaurantDetail', {
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.name,
    });
  }, [navigation]);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback(async (restaurantId: string) => {
    try {
      await toggleFavorite(restaurantId);
      // Refetch to update the list
      refetch();
    } catch (error) {
      Alert.alert(
        t('error', 'Error'),
        t('failed_to_remove_favorite', 'Failed to remove from favorites')
      );
    }
  }, [toggleFavorite, refetch, t]);

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
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 mb-4">
          <View className="flex-row items-center">
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={colors.onSurface}
              onPress={() => navigation.goBack()}
            />
            <Text
              className="text-xl font-bold ml-2"
              style={{ color: colors.onSurface }}
            >
              {t('favorite_restaurants', 'Favorite Restaurants')}
            </Text>
          </View>

          {favoriteRestaurants && favoriteRestaurants.length > 0 && (
            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              {favoriteRestaurants.length} {t('restaurants', 'restaurants')}
            </Text>
          )}
        </View>

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
