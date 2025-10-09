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

// Interface for image upload to get URL
export interface ImageUploadRequest {
  picture: LocalImageData;
}

// Interface for image upload response
export interface ImageUploadResponse {
  status_code: number;
  message: string;
  data: {
    imageUrl: string;
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
      console.log('📤 Updating profile via PATCH /api/v1/auth/profile');
      
      const response = await apiClient.patch<ProfileUpdateResponse>('/auth/profile', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Profile updated successfully');
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
   * Upload profile picture to get URL
   * This should be called first to upload the image and get a URL
   * Then use updateProfile with the returned URL
   * 
   * Note: This endpoint needs to be confirmed with backend team
   * as it might be a separate upload endpoint like POST /api/v1/upload/profile-picture
   */
  uploadProfilePicture: async (data: ImageUploadRequest): Promise<string> => {
    const formData = new FormData();
    formData.append('picture', data.picture as any);
    
    try {
      // This might need to be a different endpoint for image upload
      // Check with backend team for the correct upload endpoint
      const response = await apiClient.post<ImageUploadResponse>('/upload/profile-picture', formData);
      return response.data.data.imageUrl;
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      throw new Error('Failed to upload profile picture. Please try again.');
    }
  },

  /**
   * Complete profile update workflow with image
   * 1. Upload image to get URL
   * 2. Update profile with JSON data including the image URL
   */
  updateProfileWithImage: async (data: {
    fullName?: string;
    phoneNumber?: string;
    picture: LocalImageData;
  }) => {
    try {
      // Step 1: Upload image to get URL
      const imageUrl = await profileApi.uploadProfilePicture({ picture: data.picture });
      
      // Step 2: Update profile with JSON data including image URL
      const profileData: UpdateProfileRequest = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        profilePicture: imageUrl,
      };
      
      return await profileApi.updateProfile(profileData);
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
  } catch (_) {
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

// Export types for use in other files
export type { 
  UpdateProfileRequest, 
  LocalImageData,
  ImageUploadRequest,
  ImageUploadResponse,
  ProfileUpdateResponse 
};

// Export validation helpers
export { isValidUrl, isLocalFileUri };
