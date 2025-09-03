import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import { useGetRestaurantsNearBy } from '@/src/hooks/customer/useCustomerApi';
import { RootStackScreenProps } from '@/src/navigation/types';
// Location system removed - using hardcoded coordinates
import LoadingScreen from '@/src/components/common/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const NearbyRestaurantsScreen = ({
  navigation,
}: RootStackScreenProps<'NearbyRestaurants'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Get nearby restaurants using hardcoded coordinates
  const {
    data: nearbyRestaurantsResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetRestaurantsNearBy();

  // Extract data from response
  const nearbyRestaurants = nearbyRestaurantsResponse?.data || [];

  const handleRefresh = () => {
    refetch();
  };

  const renderRestaurant = ({ item }: { item: any }) => (
    <RestaurantCard
      key={item.id}
      restaurantID={item.id}
      restaurantName={item.name}
      image={item.image}
      rating={item.rating}
      deliveryFee={item.deliveryFee}
      distanceFromUser={item.distance}
      estimatedTime={item.estimatedDeliveryTime}
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <Ionicons
        name="restaurant-outline"
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
      <Ionicons
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

  if (isLoading && !nearbyRestaurants) {
    return <LoadingScreen />;
  }

  return (
    <CommonView>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        {/* Content */}
        {error ? (
          renderErrorState()
        ) : nearbyRestaurants && nearbyRestaurants.length > 0 ? (
          <FlatList
            data={nearbyRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </CommonView>
  );
};

export default NearbyRestaurantsScreen;
