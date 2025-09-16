import { User } from '../../types';
import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
// i need to typescipt data: LoginResponse
export interface LoginResponseData {
  data: LoginResponse;
}

export interface RegisterRequest {
  role: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface RegisterResponseData {
  data: {
    email: string;
    phoneNumber: string;
    role: string;
    userId: string;
    name: string;
  };
}
export interface OTPCredentials {
  userId: string;
  otp: string;
  type: 'email';
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
export interface ChangePasswordResponse {
  message: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

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

  logout: () => {
    return apiClient.post<void>('/auth/logout');
  },

  refreshToken: (refreshToken: string) => {
    return apiClient.post<{
      status_code: number;
      message: string;
      data: {
        accessToken: string;
        refreshToken: string;
        user: User;
      };
    }>('/auth/refresh-token', {
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
  socialAuth: (data: {
    provider: 'google' | 'facebook' | 'apple';
    providerId: string;
    email: string;
    fullName: string;
    profilePicture?: string;
  }) => {
    return apiClient.post<{
      status_code: number;
      message: string;
      data: {
        user: User;
        accessToken: string;
        refreshToken: string;
      };
    }>('/auth/social-auth', data);
  },
};
