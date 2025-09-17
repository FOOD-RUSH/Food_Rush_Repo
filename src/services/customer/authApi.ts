import { User } from '../../types';
import { apiClient } from '@/src/services/shared/apiClient';

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
  data: LoginResponse
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
    name: string
  }
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
  email: string,
  otp: string,
  newPassword: string
}
export interface ChangePasswordResponse {
  message: string
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

  // logout: () => {
  //   return apiClient.post<void>('/auth/logout');
  // },

  refreshToken: (refreshToken: string) => {
    return apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', {
      refreshToken,
    });
  },

  updateProfile: (data: UpdateProfileRequest) => {
    return apiClient.put<User>('/auth/profile', { ...data });
  },

  getProfile: () => {
    return apiClient.get<User>('/auth/profile');
  },

  requestPasswordReset: (data: ResetPasswordRequest) => {
    return apiClient.post<ChangePasswordResponse>('/auth/forgot-password', { ...data });
  },
  // FOROGT PASSWORD
  resetPassword: (data: ChangePasswordRequest) => {
    return apiClient.post<ChangePasswordResponse>('/auth/reset-password', { ...data });
  },

  // changePassword: (data: ChangePasswordRequest) => {
  //   return apiClient.post<void>('/auth/change-password', { ...data });
  // },

  // Social login
  googleLogin: (tokenId: string) => {
    return apiClient.post<LoginResponse>('/auth/google', { tokenId });
  },

  facebookLogin: (accessToken: string) => {
    return apiClient.post<LoginResponse>('/auth/facebook', { accessToken });
  },

  // Resend verification
  resendVerification: (email: string) => {
    return apiClient.post<void>('/auth/resend-verification', { email });
  },
};
