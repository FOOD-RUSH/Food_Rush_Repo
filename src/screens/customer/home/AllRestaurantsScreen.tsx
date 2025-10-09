import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTheme, Searchbar } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import { useAllRestaurantsWithoutLocation } from '@/src/hooks/customer/useCustomerApi';
import { RootStackScreenProps } from '@/src/navigation/types';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import { useTranslation } from 'react-i18next';
import { RestaurantCard as RestaurantProps } from '@/src/types';

const AllRestaurantsScreen = ({
  navigation,
}: RootStackScreenProps<'AllRestaurants'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all restaurants without location requirements
  const {
    data: allRestaurants,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAllRestaurantsWithoutLocation({
    isOpen: true,
    verificationStatus: 'APPROVED',
    limit: 50, // Show more restaurants
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Filter restaurants based on search query
  const filteredRestaurants = React.useMemo(() => {
    if (!allRestaurants) return [];
    if (!searchQuery.trim()) return allRestaurants;
    
    return allRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allRestaurants, searchQuery]);

  const renderRestaurant = useCallback(({ item }: { item: RestaurantProps }) => (
    <RestaurantCard
      key={item.id}
      id={item.id}
      name={item.name}
      address={item.address}
      latitude={item.latitude || '0'}
      longitude={item.longitude || '0'}
      isOpen={item.isOpen}
      verificationStatus={item.verificationStatus || 'APPROVED'}
      menuMode={item.menuMode || 'FIXED'}
      createdAt={item.createdAt || new Date().toISOString()}
      distanceKm={item.distanceKm || item.distance || 0}
      deliveryPrice={item.deliveryPrice || 500}
      estimatedDeliveryTime={item.estimatedDeliveryTime || '30-40 mins'}
      rating={item.rating}
      ratingCount={item.ratingCount}
      image={item.pictureUrl}
      phone={item.phone}
      menu={item.menu || []}
    />
  ), []);

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <IoniconsIcon
        name="restaurant-outline"
        size={64}
        color={colors.onSurfaceVariant}
        style={{ marginBottom: 16 }}
      />
      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {searchQuery ? t('no_results_for', { query: searchQuery }) : t('no_restaurants_found')}
      </Text>
      <Text
        className="text-base text-center leading-6"
        style={{ color: colors.onSurfaceVariant }}
      >
        {searchQuery 
          ? t('try_different_search_or_filter')
          : t('no_restaurants_description')
        }
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <IoniconsIcon
        name="alert-circle-outline"
        size={64}
        color={colors.error}
        style={{ marginBottom: 16 }}
      />
      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {t('something_went_wrong')}
      </Text>
      <Text
        className="text-base text-center leading-6 mb-6"
        style={{ color: colors.onSurfaceVariant }}
      >
        {t('could_not_load_nearby_restaurants')}
      </Text>
    </View>
  );

  if (isLoading && !allRestaurants) {
    return <LoadingScreen />;
  }

  return (
    <CommonView>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        {/* Search Bar */}
        <View className="px-4 py-3">
          <Searchbar
            placeholder={t('search_for_restaurant')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{
              backgroundColor: colors.surfaceVariant,
              borderRadius: 20,
            }}
            inputStyle={{
              color: colors.onSurface,
            }}
            placeholderTextColor={colors.onSurfaceVariant}
          />
        </View>

        {/* Content */}
        {error ? (
          renderErrorState()
        ) : filteredRestaurants && filteredRestaurants.length > 0 ? (
          <FlatList
            data={filteredRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </CommonView>
  );
};

export default AllRestaurantsScreen;