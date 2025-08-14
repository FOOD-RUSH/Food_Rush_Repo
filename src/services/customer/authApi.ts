import { User } from '../../types';
import { apiClient } from './apiClient';

interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  role: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}
export interface OTPCredentials {
  userId: string;
  otp: string;
  type: 'email';
}

export const authApi = {
  login: async (credentials: LoginRequest) =>
    apiClient.post('/auth/login', { ...credentials }),

  register: async (data: RegisterRequest) =>
    apiClient.post('/auth/register', { ...data }),

  verifyOTP: async (data: OTPCredentials) =>
    apiClient.post('verify-otp', { ...data }),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: async (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh-token', {
      refreshToken,
    }),

  updateProfile: async (data: Partial<User>) =>
    apiClient.put<User>('/auth/profile', data),

  getProfile: async () => apiClient.get('/auth/profile'),
};
