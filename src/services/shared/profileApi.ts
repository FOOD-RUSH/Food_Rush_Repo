import { apiClient } from './apiClient';
import { User } from '@/src/types';

// Profile update request interface - PATCH /api/v1/auth/profile
// Content-Type: application/json
// Matches the exact API specification provided
export interface UpdateProfileRequest {
  fullName?: string;        // e.g., "Tochukwu Paul"
  phoneNumber?: string;     // e.g., "+237612345678"
  profilePicture?: string;  // e.g., "https://example.com/profile.jpg"
}

// Interface for local image data before upload
export interface LocalImageData {
  uri: string;
  type: string;
  name: string;
}

// Interface for FormData profile update with image
export interface ProfileUpdateWithImageRequest {
  fullName?: string;
  phoneNumber?: string;
  picture: LocalImageData;
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
   * Update current user profile
   * 
   * API: PATCH /api/v1/auth/profile
   * Content-Type: application/json
   * 
   * Request body example:
   * {
   *   "fullName": "Tochukwu Paul",
   *   "phoneNumber": "+237612345678",
   *   "profilePicture": "https://example.com/profile.jpg"
   * }
   * 
   * @param data - Profile update data
   * @returns Promise<ProfileUpdateResponse>
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileUpdateResponse> => {
    // Validate input data
    if (data.profilePicture && !isValidUrl(data.profilePicture)) {
      throw new Error('profilePicture must be a valid URL, not a local file path');
    }
    
    // Validate phone number format if provided
    if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
      throw new Error('phoneNumber must be in valid format (e.g., +237612345678)');
    }
    
    // Validate fullName if provided
    if (data.fullName && data.fullName.trim().length < 2) {
      throw new Error('fullName must be at least 2 characters long');
    }
    
    try {
      const response = await apiClient.patch<ProfileUpdateResponse>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Profile update failed:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      );
    }
  },

  /**
   * Update profile with image using FormData
   * Uses PATCH /api/v1/auth/profile with multipart/form-data
   * Similar to how menu items and restaurant registration handle images
   */
  updateProfileWithFormData: async (data: {
    fullName?: string;
    phoneNumber?: string;
    picture: LocalImageData;
  }): Promise<ProfileUpdateResponse> => {
    const formData = new FormData();
    
    // Add text fields if provided
    if (data.fullName && data.fullName.trim()) {
      formData.append('fullName', data.fullName.trim());
    }
    if (data.phoneNumber && data.phoneNumber.trim()) {
      formData.append('phoneNumber', data.phoneNumber.trim());
    }
    
    // Add the image file
    const imageFile = {
      uri: data.picture.uri,
      name: data.picture.name,
      type: data.picture.type,
    };
    formData.append('profilePicture', imageFile as any);
    
    try {
      const response = await apiClient.patch<ProfileUpdateResponse>('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Profile update with image failed:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile with image'
      );
    }
  },

  /**
   * Complete profile update workflow with image
   * Uses FormData approach directly with PATCH /api/v1/auth/profile
   * This is the recommended approach for profile updates with images
   */
  updateProfileWithImage: async (data: {
    fullName?: string;
    phoneNumber?: string;
    picture: LocalImageData;
  }) => {
    try {
      // Use FormData approach directly
      return await profileApi.updateProfileWithFormData(data);
    } catch (error) {
      console.error('Failed to update profile with image:', error);
      throw error;
    }
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
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper function to validate phone number format
function isValidPhoneNumber(phoneNumber: string): boolean {
  // Validate Cameroon phone number format: +237XXXXXXXXX or 237XXXXXXXXX or 6XXXXXXXX
  const cleanNumber = phoneNumber.replace(/\s+/g, '');
  
  // Pattern for Cameroon numbers
  const patterns = [
    /^\+237[67]\d{8}$/,  // +237XXXXXXXXX
    /^237[67]\d{8}$/,   // 237XXXXXXXXX
    /^[67]\d{8}$/,      // XXXXXXXXX (9 digits starting with 6 or 7)
  ];
  
  return patterns.some(pattern => pattern.test(cleanNumber));
}

// Helper function to check if a string is a local file URI
export function isLocalFileUri(uri: string): boolean {
  return uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('ph://');
}

// Export validation helpers
export { isValidUrl };
