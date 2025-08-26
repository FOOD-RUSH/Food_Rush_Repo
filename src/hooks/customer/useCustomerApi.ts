// useCustomerApi.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { restaurantApi, RestaurantQuery } from "@/src/services/customer/restaurant.service";
import { OrderApi } from "@/src/services/customer/orders.service";
// import { paymentApi } from "@/src/services/customer/payment.service";
import { useAuthStore } from "@/src/stores/customerStores/AuthStore";

export interface RestaurantFilters {
    cuisine?: string[];
    minRating?: number;
    maxDeliveryTime?: number;
    maxDeliveryFee?: number;
    isOpen?: boolean;
    coordinates?: {
        latitude: number;
        longitude: number;
        radius?: number;
    };
}



const CACHE_CONFIG = {
    STALE_TIME: 5 * 60 * 1000, // 5 minutes
    CACHE_TIME: 10 * 60 * 1000, // 10 minutes
    RETRY_DELAY: 1000,
    MAX_RETRIES: 3,
};

// Restaurant hooks
export const useAllRestaurants = (query: RestaurantQuery) => {
    return useQuery({
        queryKey: ['restaurants', query],
        queryFn: () => restaurantApi.getAllRestaurants(query),
        staleTime: CACHE_CONFIG.STALE_TIME,
        gcTime: CACHE_CONFIG.CACHE_TIME,
        retry: CACHE_CONFIG.MAX_RETRIES,

    })
};

export const useRestaurantId = (id: string, category?: string) => {
    return useQuery({
        queryKey: ['restaurant', id, category],
        queryFn: () => restaurantApi.getRestaurantById(id).then(res => res.data),
        staleTime: CACHE_CONFIG.STALE_TIME,
        gcTime: CACHE_CONFIG.CACHE_TIME,
        enabled: !!id,
    })
}
export const useGetAllMenu = () => {
    return useQuery({
        queryKey: ['All_menu'],
        queryFn: () => restaurantApi.getAllMenu(),




    })
}

export const useGetAllMenuBrowse = (query: RestaurantQuery) => {
    return useQuery({
        queryKey: ['All_menu', query],
        queryFn: () => restaurantApi.getMenuBrowseAll({ ...query }),
        staleTime: CACHE_CONFIG.STALE_TIME,
        gcTime: CACHE_CONFIG.CACHE_TIME,
        retry: CACHE_CONFIG.MAX_RETRIES,
        enabled: !!query,



    })
}

export const useGetMenuById = (restaurantId: string, menuId: string) => {
   return useQuery({
        queryKey: ['menuItem', menuId],
        queryFn: () => restaurantApi.getMenuItemById(restaurantId, menuId).then(res => res.data),
         staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
        
    })
}

export const useGetRestaurantsNearBy = (
    longitude: number,
    latitude: number
) => {

    return useQuery({
        queryKey: ['nearby_restaurant'],
        queryFn: async () => {
            if (!longitude || !latitude) {
                throw new Error('No coordinates available');
            }
            return restaurantApi.getNearbyRestaurants(longitude, latitude).then((res) => res.data);
        },
        enabled: !!longitude && !!latitude,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}




// Order hooks
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderData: any) => OrderApi.createOrder(orderData).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    })
}

export const useOrderById = (orderId: string) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: () => OrderApi.getOrderById(orderId).then(res => res.data),
        enabled: !!orderId && isAuthenticated,
    })
}

export const useAllOrders = (customerId: string) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return useQuery({
        queryKey: ['orders', customerId],
        queryFn: () => OrderApi.getAllOrders(customerId).then(res => res.data),
        enabled: !!customerId && isAuthenticated,
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) => OrderApi.cancelOrder(orderId).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    })
}

// Menu Hooks 





// // Payment hooks
// export const useInitiatePayment = () => {
//     return useMutation({
//         mutationFn: (paymentData: any) => paymentApi.initiatePayment(paymentData).then(res => res.data),
//     })
// }

// export const useVerifyPayment = () => {
//     return useMutation({
//         mutationFn: (verificationData: any) => paymentApi.verifyPayment(verificationData).then(res => res.data),
//     })
// }

// export const usePaymentHistory = (customerId: string) => {
//     const isAuthenticated = useAuthStore(state => state.isAuthenticated);

//     return useQuery({
//         queryKey: ['payments', customerId],
//         queryFn: () => paymentApi.getPaymentHistory({ customerId }).then(res => res.data),
//         enabled: !!customerId && isAuthenticated,
//     })
// }

// // Notification hooks
// export const useNotifications = (userId: string) => {
//     const isAuthenticated = useAuthStore(state => state.isAuthenticated);

//     return useQuery({
//         queryKey: ['notifications', userId],
//         queryFn: () => notificationApi.getNotifications(userId).then(res => res.data),
//         enabled: !!userId && isAuthenticated,
//     })
// }

// export const useNotificationSettings = (userId: string) => {
//     const isAuthenticated = useAuthStore(state => state.isAuthenticated);

//     return useQuery({
//         queryKey: ['notification-settings', userId],
//         queryFn: () => notificationApi.getSettings(userId).then(res => res.data),
//         enabled: !!userId && isAuthenticated,
//     })
// }

// export const useUnreadCount = (userId: string) => {
//     const isAuthenticated = useAuthStore(state => state.isAuthenticated);

//     return useQuery({
//         queryKey: ['unread-count', userId],
//         queryFn: () => notificationApi.getUnreadCount(userId).then(res => res.data),
//         enabled: !!userId && isAuthenticated,
//         refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
//     })
// }

// export const useMarkAsRead = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId).then(res => res.data),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({ queryKey: ['notifications'] });
//             queryClient.invalidateQueries({ queryKey: ['unread-count'] });
//         }
//     })
// }

// export const useMarkAllAsRead = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (userId: string) => notificationApi.markAllAsRead(userId).then(res => res.data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['notifications'] });
//             queryClient.invalidateQueries({ queryKey: ['unread-count'] });
//         }
//     })
// }
