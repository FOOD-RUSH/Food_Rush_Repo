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
  useIsRestaurantLiked,
} from '@/src/hooks/customer/useFavoriteRestaurants';
import { RestaurantCard as RestaurantCardType } from '@/src/types';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import {
  getResponsiveSpacing,
  isSmallDevice,
} from '@/src/utils/responsive';
import { useResponsive } from '@/src/hooks/useResponsive';
import { Typography } from '@/src/components/common/Typography';

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
  const { scale } = useResponsive();

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className="rounded-full items-center justify-center mb-6"
        style={{ 
          width: scale(120), 
          height: scale(120),
          backgroundColor: colors.primaryContainer || colors.primary + '20'
        }}
      >
        <Ionicons
          name="heart-outline"
          size={scale(48)}
          color={colors.primary}
        />
      </View>

      <Typography variant="h4" style={{ color: colors.onSurface, textAlign: 'center', marginBottom: 8, fontWeight: 'bold' }}>
        {t('no_favorite_restaurants', 'No Favorite Restaurants')}
      </Typography>

      <Typography variant="body1" style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 32, lineHeight: 24 }}>
        {t(
          'no_favorites_description',
          "You haven't added any restaurants to your favorites yet. Start exploring and save your favorite spots!",
        )}
      </Typography>

      <TouchableOpacity
        className="px-8 py-4 rounded-full"
        style={{ backgroundColor: colors.primary }}
        onPress={onRefresh}
        activeOpacity={0.8}
      >
        <Typography variant="button" style={{ color: 'white', fontWeight: '600' }}>
          {t('explore_restaurants', 'Explore Restaurants')}
        </Typography>
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
  const { t } = useTranslation();

  const handleToggleFavorite = useCallback(
    (e: any) => {
      e.stopPropagation();
      Alert.alert(
        t('remove_from_favorites', 'Remove from Favorites'),
        t('remove_restaurant_confirmation', `Remove ${item.name} from your favorites?`),
        [
          { text: t('cancel', 'Cancel'), style: 'cancel' },
          {
            text: t('remove', 'Remove'),
            style: 'destructive',
            onPress: () => onToggleFavorite(item.id || item.restaurantId),
          },
        ],
      );
    },
    [item, onToggleFavorite, t],
  );

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <Card
        style={{
          margin: getResponsiveSpacing(8),
          borderRadius: 16,
          backgroundColor: colors.surface,
          marginVertical: getResponsiveSpacing(8),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ padding: 16, position: 'relative' }}>
          {/* Favorite button */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.surface,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            }}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons name="heart" size={scale(20)} color={colors.error} />
          </TouchableOpacity>

          <View className="flex-row">
            {/* Restaurant Image */}
            <View
              style={{
                width: scale(80),
                height: scale(80),
                borderRadius: 12,
                marginRight: 16,
                backgroundColor: colors.surfaceVariant,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="restaurant-outline"
                  size={scale(32)}
                  color={colors.onSurfaceVariant}
                />
              )}
            </View>

            {/* Restaurant Info */}
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <View className="flex-row items-center mb-2">
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: colors.onSurface, 
                      flex: 1, 
                      marginRight: 8,
                      fontWeight: 'bold'
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Typography>
                  {!item.isOpen && (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: colors.errorContainer || colors.error + '20',
                      }}
                    >
                      <Typography
                        variant="caption"
                        style={{
                          color: colors.onErrorContainer || colors.error,
                          fontWeight: '600',
                          fontSize: scale(10)
                        }}
                      >
                        {t('closed', 'Closed')}
                      </Typography>
                    </View>
                  )}
                </View>

                <Typography
                  variant="body2"
                  style={{ 
                    color: colors.onSurfaceVariant, 
                    marginBottom: 12,
                    lineHeight: 18
                  }}
                  numberOfLines={2}
                >
                  {item.address}
                </Typography>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={scale(14)} color="#fbbf24" />
                  <Typography
                    variant="caption"
                    style={{ 
                      color: colors.onSurfaceVariant, 
                      marginLeft: 4, 
                      marginRight: 12
                    }}
                  >
                    {item.rating?.toFixed(1) || 'N/A'}
                  </Typography>

                  <Ionicons
                    name="time-outline"
                    size={scale(14)}
                    color={colors.onSurfaceVariant}
                  />
                  <Typography
                    variant="caption"
                    style={{ 
                      color: colors.onSurfaceVariant, 
                      marginLeft: 4
                    }}
                  >
                    {item.estimatedDeliveryTime || 'N/A'}
                  </Typography>
                </View>

                {(item.deliveryFee || item.deliveryPrice) && (
                  <Typography
                    variant="body2"
                    style={{ 
                      color: colors.primary, 
                      fontWeight: '600'
                    }}
                  >
                    {item.deliveryFee || `${item.deliveryPrice} XAF`}
                  </Typography>
                )}
              </View>
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
  const { scale } = useResponsive();

  const {
    data: favoriteRestaurants,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFavoriteRestaurants();

  const { toggleFavorite, isLoading: isToggling } = useToggleFavorite();

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
      if (isToggling) return; // Prevent multiple calls
      
      try {
        await toggleFavorite(restaurantId);
        // The hook automatically refetches, so no need to manually refetch
      } catch (error) {
        console.error('Error toggling favorite:', error);
        // Error is already handled by the hook with Toast
      }
    },
    [toggleFavorite, isToggling],
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
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-6 border-b" style={{ borderBottomColor: colors.outline + '30' }}>
          <Typography variant="h4" style={{ color: colors.onSurface, fontWeight: 'bold', marginBottom: 8 }}>
            {t('favorite_restaurants', 'Favorite Restaurants')}
          </Typography>
          <Typography variant="body2" style={{ color: colors.onSurfaceVariant }}>
            {favoriteRestaurants?.length 
              ? t('favorite_count', `${favoriteRestaurants.length} restaurant${favoriteRestaurants.length !== 1 ? 's' : ''} saved`)
              : t('no_favorites_yet', 'No favorites saved yet')
            }
          </Typography>
        </View>

        {/* Content */}
        {favoriteRestaurants && favoriteRestaurants.length > 0 ? (
          <FlatList
            data={favoriteRestaurants}
            keyExtractor={(item) => item.id || item.restaurantId}
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
            contentContainerStyle={{ paddingBottom: scale(20) }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          />
        ) : (
          <EmptyState onRefresh={handleExploreRestaurants} />
        )}
      </View>
    </CommonView>
  );
};

export default FavoriteRestaurants;
