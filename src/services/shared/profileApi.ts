import { apiClient } from './apiClient';
import { User } from '@/src/types';

// Unified profile update request interface based on the API documentation
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string; // Should be a URL string, not a file
}

// Interface for profile update with file upload
export interface UpdateProfileWithImageRequest {
  fullName?: string;
  phoneNumber?: string;
  picture?: {
    uri: string;
    type: string;
    name: string;
  };
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
   * Update current user profile with JSON data (no image upload)
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
    // Validate that profilePicture is a URL if provided
    if (data.profilePicture && !isValidUrl(data.profilePicture)) {
      throw new Error('profilePicture must be a valid URL, not a local file path');
    }
    
    return apiClient.patch<ProfileUpdateResponse>('/auth/profile', data);
  },

  /**
   * Update current user profile with image upload using FormData
   * Uses PATCH /api/v1/auth/profile endpoint with multipart/form-data
   */
  updateProfileWithImage: (data: UpdateProfileWithImageRequest) => {
    const formData = new FormData();
    
    // Add text fields
    if (data.fullName) {
      formData.append('fullName', data.fullName);
    }
    if (data.phoneNumber) {
      formData.append('phoneNumber', data.phoneNumber);
    }
    
    // Add image file if provided
    if (data.picture) {
      formData.append('picture', data.picture as any);
    }
    
    return apiClient.patch<ProfileUpdateResponse>('/auth/profile', formData);
  },

  /**
   * Get current user profile
   * Uses GET /api/v1/auth/profile endpoint
   */
  getProfile: () => {
    return apiClient.get<ProfileUpdateResponse>('/auth/profile');
  },
};

// Helper function to validate URL
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Helper function to check if a string is a local file URI
export function isLocalFileUri(uri: string): boolean {
  return uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('ph://');
}

// Export types for use in other files
export type { UpdateProfileRequest, UpdateProfileWithImageRequest, ProfileUpdateResponse };
