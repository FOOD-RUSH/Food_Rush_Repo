import { apiClient } from '@/src/services/shared/apiClient';
import {
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  OTPCredentials,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  SocialAuthRequest,
  SocialAuthResponse,
  ResendOTPRequest,
} from '@/src/services/shared/authTypes';
import { User } from '@/src/types';

// Re-export shared types for backward compatibility
export type {
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  OTPCredentials,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  SocialAuthRequest,
  SocialAuthResponse,
  ResendOTPRequest,
};

export const authApi = {
  login: (credentials: LoginRequest) => {
    return apiClient.post<LoginResponseData>('/auth/login', { ...credentials });
  },

  register: async (data: RegisterRequest): Promise<RegisterResponseData> => {
    try {
      // Validate required fields before sending
      if (
        !data.email ||
        !data.phoneNumber ||
        !data.fullName ||
        !data.password ||
        !data.role
      ) {
        throw new Error('All fields are required for registration');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone number format (Cameroon: +237XXXXXXXXX)
      // Accept any 9-digit number after +237
      const phoneRegex = /^\+237\d{9}$/;
      if (!phoneRegex.test(data.phoneNumber)) {
        throw new Error(
          `Invalid phone number format. Expected +237 followed by 9 digits, got: ${data.phoneNumber}`,
        );
      }

      // Validate password length
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate full name
      if (data.fullName.trim().length < 2) {
        throw new Error('Full name must be at least 2 characters long');
      }

      // Ensure proper Content-Type header for JSON
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      const response = await apiClient.post<RegisterResponseData>(
        '/auth/register',
        data,
        config,
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);

      // Log more detailed error information
      if (error.response) {
        console.error('❌ Response error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            data: error.config?.data,
          },
        });
      } else if (error.request) {
        console.error('❌ Request error (no response):', {
          request: error.request,
          message: error.message,
          code: error.code,
        });
      } else {
        console.error('❌ General error:', {
          message: error.message,
          stack: error.stack,
        });
      }

      // Enhanced error handling
      if (error.response?.status === 400) {
        const message =
          error.response.data?.message || 'Invalid registration data';
        throw new Error(message);
      } else if (error.response?.status === 409) {
        throw new Error('Email or phone number already exists');
      } else if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed';
        throw new Error(message);
      } else if (error.response?.status === 500) {
        const message =
          error.response.data?.message ||
          'Server error. Please try again later.';
        throw new Error(message);
      } else {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            'Registration failed',
        );
      }
    }
  },

  verifyOTP: async (data: OTPCredentials): Promise<LoginResponseData> => {
    try {
      const response = await apiClient.post<LoginResponseData>(
        '/auth/verify-otp',
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ OTP verification failed:', error);

      if (error.response?.status === 400) {
        throw new Error('Invalid OTP code');
      } else if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.status === 410) {
        throw new Error('OTP has expired');
      } else {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            'OTP verification failed',
        );
      }
    }
  },

  // logout: () => {
  //   return apiClient.post<void>('/auth/logout');
  // },

  refreshToken: (refreshToken: string) => {
    return apiClient.post<LoginResponseData>('/auth/refresh-token', {
      refreshToken,
    });
  },

  updateProfile: (data: UpdateProfileRequest) => {
    return apiClient.patch<{
      status_code: number;
      message: string;
      data: User;
    }>('/auth/profile', { ...data });
  },

  getProfile: () => {
    return apiClient.get<{
      status_code: number;
      message: string;
      data: User;
    }>('/auth/profile');
  },

  requestPasswordReset: (data: ResetPasswordRequest) => {
    return apiClient.post<ChangePasswordResponse>('/auth/forgot-password', {
      ...data,
    });
  },
  // FOROGT PASSWORD
  resetPassword: (data: ChangePasswordRequest) => {
    return apiClient.post<ChangePasswordResponse>('/auth/reset-password', {
      ...data,
    });
  },

  // Resend verification OTP
  resendVerification: (data: ResendOTPRequest) => {
    return apiClient.post<{
      status_code: number;
      message: string;
      data?: any;
    }>('/auth/resend-verification', data);
  },

  // Social authentication
  socialAuth: (data: SocialAuthRequest) => {
    return apiClient.post<SocialAuthResponse>('/auth/social-auth', data);
  },
};
