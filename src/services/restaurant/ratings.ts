import { apiClient } from '@/src/services/shared/apiClient';

interface ReviewApiResponse {
  status_code: number;
  message: string;
  data: {
    id: string;
    score: number;
    review: string;
    createdAt: string;
    user: {
      id: string;
      fullName: string;
      profilePicture: string;
    };
  }[];
}

export const restaurantRatingsApi = (restaurantId: string) => {
  return apiClient.get<ReviewApiResponse>(
    `/restaurants/${restaurantId}/reviews`,
  );
};
