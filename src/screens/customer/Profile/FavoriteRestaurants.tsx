import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import {
  useFavoriteRestaurants,
  useToggleFavorite,
} from '@/src/hooks/customer/useFavoriteRestaurants';
import { RestaurantCard as RestaurantCardType } from '@/src/types';
import ErrorDisplay from '@/src/components/common/ErrorDisplay';
import EmptyState from '@/src/components/common/EmptyState';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import RestaurantCardSkeleton from '@/src/components/customer/RestaurantCardSkeleton';

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

  // Render restaurant item using proper RestaurantCard component
  const renderRestaurantItem = useCallback(
    ({ item }: { item: RestaurantCardType }) => (
      <RestaurantCard
        key={item.id}
        id={item.id}
        name={item.name}
        address={item.address}
        latitude={item.latitude || '0'}
        longitude={item.longitude || '0'}
        isOpen={item.isOpen || true}
        verificationStatus={item.verificationStatus || 'APPROVED'}
        menuMode={item.menuMode || 'FIXED'}
        createdAt={item.createdAt || new Date().toISOString()}
        distanceKm={item.distanceKm || item.distance || 0}
        deliveryPrice={item.deliveryPrice || 500}
        estimatedDeliveryTime={item.estimatedDeliveryTime || '30-40 mins'}
        rating={item.rating}
        ratingCount={item.ratingCount}
        image={item.image}
        phone={item.phone}
        menu={item.menu || []}
      />
    ),
    [],
  );

  // Loading state with skeletons
  if (isLoading && !favoriteRestaurants) {
    return (
      <CommonView>
        <View style={{ flex: 1, paddingTop: 16 }}>
          {[1, 2, 3, 4].map((index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </View>
      </CommonView>
    );
  }

  // Error state
  if (error && !favoriteRestaurants) {
    return (
      <CommonView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <ErrorDisplay
            icon="heart-dislike-outline"
            title={t('failed_to_load_favorites', 'Failed to Load Favorites')}
            description={t(
              'favorites_error_description',
              "We couldn't load your favorite restaurants. Please check your connection and try again.",
            )}
            onRetry={refetch}
            retryText={t('retry', 'Try Again')}
          />
        </View>
      </CommonView>
    );
  }

  // Empty state
  if (!favoriteRestaurants || favoriteRestaurants.length === 0) {
    return (
      <CommonView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <EmptyState
            icon="heart-outline"
            title={t('no_favorite_restaurants', 'No Favorite Restaurants')}
            description={t(
              'no_favorites_description',
              "You haven't added any restaurants to your favorites yet. Start exploring and save your favorite spots!",
            )}
            actionText={t('explore_restaurants', 'Explore Restaurants')}
            onActionPress={handleExploreRestaurants}
            size="large"
          />
        </View>
      </CommonView>
    );
  }

  // Main content with restaurant cards
  return (
    <CommonView>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={favoriteRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurantItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefetching}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{
            paddingVertical: 8,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          ListHeaderComponent={() => (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.outline + '20',
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Ionicons
                  name="heart"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'baseline' }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12,
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      >
                        {favoriteRestaurants.length}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.onSurfaceVariant,
                      }}
                    >
                      {t(
                        'favorite_count',
                        `restaurant${favoriteRestaurants.length !== 1 ? 's' : ''} saved`,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </CommonView>
  );
};

export default FavoriteRestaurants;
