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
};

export const authApi = {
  login: (credentials: LoginRequest) => {
    return apiClient.post<LoginResponseData>('/auth/login', { ...credentials });
  },

  register: (data: RegisterRequest) => {
    return apiClient.post<RegisterResponseData>('/auth/register', { ...data });
  },

  verifyOTP: (data: OTPCredentials) => {
    return apiClient.post<LoginResponseData>('/auth/verify-otp', { ...data });
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
  resendVerification: (email: string) => {
    return apiClient.post<{
      status_code: number;
      message: string;
      data?: any;
    }>('/auth/resend-verification', { email });
  },

  // Social authentication
  socialAuth: (data: SocialAuthRequest) => {
    return apiClient.post<SocialAuthResponse>('/auth/social-auth', data);
  },
};
