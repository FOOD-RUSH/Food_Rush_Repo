import { apiClient } from '@/src/services/shared/apiClient';
import {
  LoginRequest,
  RestaurantRegisterRequest,
  RestaurantRegisterResponse,
  RestaurantLoginResponse,
  OTPCredentials,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
} from '@/src/services/shared/authTypes';

// Re-export shared types for backward compatibility
export type {
  RestaurantRegisterRequest,
  RestaurantRegisterResponse,
  RestaurantLoginResponse,
  LoginRequest,
  OTPCredentials,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
};

// Removed duplicate type definitions - now using shared types

export const restaurantAuthApi = {
  register: (data: RestaurantRegisterRequest) => {
    // Check if we have a picture to upload
    if (
      data.picture &&
      data.picture.uri &&
      data.picture.name &&
      data.picture.type
    ) {
      // Use FormData for requests with image uploads
      const formData = new FormData();

      // Append text fields
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('password', data.password);
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('phone', data.phone);
      formData.append('nearLat', data.nearLat.toString());
      formData.append('nearLng', data.nearLng.toString());

      if (data.document) {
        formData.append('document', data.document);
      }

      // Add the picture file
      const imageFile = {
        uri: data.picture.uri,
        name: data.picture.name,
        type: data.picture.type,
      };
      formData.append('picture', imageFile as any);

      return apiClient.post<RestaurantRegisterResponse>(
        '/restaurants/auth/register-and-create',
        formData,
        {
          headers: {
            Accept: 'application/json',
          },
          timeout: 30000, // 30 seconds timeout for file upload
        },
      );
    } else {
      // Use JSON for requests without image uploads
      return apiClient.post<RestaurantRegisterResponse>(
        '/restaurants/auth/register-and-create',
        { ...data },
      );
    }
  },

  login: (credentials: { email: string; password: string }) => {
    return apiClient.post<RestaurantLoginResponse>('/restaurants/auth/login', {
      ...credentials,
    });
  },

  verifyOTP: (data: { userId: string; otp: string; type: 'email' }) => {
    return apiClient.post('/restaurants/auth/verify-otp', { ...data });
  },

  // logout: () => {
  //   return apiClient.post('/restaurants/auth/logout');
  // },

  refreshToken: (refreshToken: string) => {
    return apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken },
    );
  },

  updateProfile: (data: any) => {
    return apiClient.put('/restaurants/auth/profile', data);
  },

  getProfile: () => {
    return apiClient.get('/auth/profile');
  },

  requestPasswordReset: (data: { email: string }) => {
    return apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    return apiClient.post('/auth/reset-password', data);
  },

  resendVerification: (email: string) => {
    return apiClient.post('/restaurants/auth/resend-verification', { email });
  },
};
