import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/src/stores/customerStores/cartStore';
import { restaurantApi } from '@/src/services/customer/restaurant.service';
import { useLocationForQueries } from './useLocationService';
import { haversineDistance } from '@/src/utils/location';

export const useRestaurantDistance = () => {
  const restaurantID = useCartStore((state) => state.restaurantID);
  const { nearLat, nearLng } = useLocationForQueries();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant-details', restaurantID, nearLat, nearLng],
    queryFn: () => {
      if (!restaurantID) {
        return null;
      }
      return restaurantApi.getRestaurantDetails(restaurantID, nearLat, nearLng);
    },
    enabled: !!restaurantID,
  });

  if (isLoading || !restaurant) {
    return { distance: null, isLoading };
  }

  const distance = haversineDistance(
    { latitude: nearLat, longitude: nearLng },
    { latitude: restaurant.latitude, longitude: restaurant.longitude }
  );

  return { distance, isLoading };
};
