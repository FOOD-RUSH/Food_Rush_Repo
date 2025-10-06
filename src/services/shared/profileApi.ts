import { apiClient } from './apiClient';
import { User } from '@/src/types';

// Unified profile update request interface based on the provided fields
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  // Additional optional fields that might be supported
  email?: string;
}

// API response interface
export interface ProfileUpdateResponse {
  status_code: number;
  message: string;
  data: User;
}

// Profile API service using the unified PATCH /auth/profile endpoint
export const profileApi = {
  /**
   * Update current user profile for both restaurant and customer
   * Uses PATCH /api/v1/auth/profile endpoint
   *
   * Example request body:
   * {
   *   "fullName": "John Doe",
   *   "phoneNumber": "+237612345678",
   *   "profilePicture": "https://example.com/profile.jpg"
   * }
   */
  updateProfile: (data: UpdateProfileRequest) => {

    return apiClient.patch<ProfileUpdateResponse>('/auth/profile', data);
  },

  /**
   * Get current user profile
   * Uses GET /api/v1/auth/profile endpoint
   */
  getProfile: () => {
    return apiClient.get<ProfileUpdateResponse>('/auth/profile');
  },
};

// Export types for use in other files
export type { UpdateProfileRequest, ProfileUpdateResponse };
