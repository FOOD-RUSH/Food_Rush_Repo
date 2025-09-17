import { apiClient } from '@/src/services/shared/apiClient';


export const restauarantRatingsApi = (restaurantId: string) => {
    return apiClient.get<{ status_code: number; message: string; data: [{ id: string, reviews: string, score: number, }] }>(`/restaurants/${restaurantId}/reviews`);

}