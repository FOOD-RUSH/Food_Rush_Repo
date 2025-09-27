import { IoniconsIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import { useBrowseRestaurants } from '@/src/hooks/customer/useCustomerApi';
import { RootStackScreenProps } from '@/src/navigation/types';
// Location system removed - using hardcoded coordinates
import LoadingScreen from '@/src/components/common/LoadingScreen';

import { useTranslation } from 'react-i18next';

const NearbyRestaurantsScreen = ({
  navigation,
}: RootStackScreenProps<'NearbyRestaurants'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Get browse restaurants using location service
  const {
    data: browseRestaurants,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useBrowseRestaurants({
    radiusKm: 15,
    limit: 20,
    isOpen: true,
    sortDir: 'ASC',
  });

  const handleRefresh = () => {
    refetch();
  };

  const renderRestaurant = ({ item }: { item: any }) => (
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
      image={item.image}
      phone={item.phone}
      menu={item.menu || []}
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <IoniconsIcon         name="restaurant-outline"
        size={64}
        color={colors.onSurfaceVariant}
        style={{ marginBottom: 16 }}
      />
      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {t('no_restaurants_nearby')}
      </Text>
      <Text
        className="text-base text-center leading-6"
        style={{ color: colors.onSurfaceVariant }}
      >
        {t('no_restaurants_in_your_area')}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <IoniconsIcon         name="alert-circle-outline"
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

  if (isLoading && !browseRestaurants) {
    return <LoadingScreen />;
  }

  return (
    <CommonView>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        {/* Content */}
        {error ? (
          renderErrorState()
        ) : browseRestaurants && browseRestaurants.length > 0 ? (
          <FlatList
            data={browseRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
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

export default NearbyRestaurantsScreen;
