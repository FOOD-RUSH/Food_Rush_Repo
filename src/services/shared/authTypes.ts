import { User } from '@/src/types';

// Shared auth request types
export interface LoginRequest {
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

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

// Shared auth response types
export interface BaseAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends BaseAuthResponse {}

export interface LoginResponseData {
  data: LoginResponse;
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

export interface ChangePasswordResponse {
  message: string;
}

// Restaurant-specific types (extend base types)
export interface RestaurantRegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string; // Just the number without country code
  password: string;
  name: string; // Restaurant name
  address: string; // Restaurant address (from GPS)
  phone: string; // Full phone with country code
  nearLat: number; // Exact GPS latitude
  nearLng: number; // Exact GPS longitude
  document?: string; // Optional document URI
}

export interface RestaurantAuthResponse extends BaseAuthResponse {
  restaurants: any[];
  defaultRestaurantId: string;
}

// Restaurant-specific response types (keeping existing structure for compatibility)
export interface RestaurantRegisterResponse {
  status_code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      role: string;
    };
    restaurantOwnerId: string;
    restaurant: any; // Keep as any for now to maintain compatibility
    nextAction: string;
  };
}

export interface RestaurantLoginResponse {
  status_code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      phoneNumber: string;
      id: string;
      email: string;
      fullName: string;
      role: string;
      status: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    };
    restaurants: any[];
    defaultRestaurantId: string;
  };
}

// Social auth types
export interface SocialAuthRequest {
  provider: 'google' | 'facebook' | 'apple';
  providerId: string;
  email: string;
  fullName: string;
  profilePicture?: string;
}

export interface SocialAuthResponse {
  status_code: number;
  message: string;
  data: BaseAuthResponse;
}

// Common API response wrapper
export interface ApiResponse<T = any> {
  status_code: number;
  message: string;
  data: T;
}