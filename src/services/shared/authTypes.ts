import { User } from '@/src/types';

// Shared auth request types
export interface LoginRequest {
  email: string;
  password: string;
}

// Updated to match exact backend API specification
// POST /api/v1/auth/register
export interface RegisterRequest {
  email: string; // "user@examle.com"
  phoneNumber: string; // "+237613345678"
  fullName: string; // "John Doew"
  password: string; // "password123"
  role: string; // "customer"
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

export interface ResendOTPRequest {
  userId: string;
  email: string;
  phone?: string;
  type: 'email' | 'phone' | 'reset_password';
  userType: 'customer' | 'restaurant';
}

// Legacy interface - use UpdateProfileRequest from profileApi instead
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

// New unified profile update interface
export interface UnifiedUpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string;
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

// Updated to match exact backend API response
// Response from POST /api/v1/auth/register
export interface RegisterResponseData {
  status_code: number; // 201
  message: string; // "Registration successful"
  data: {
    userId: string; // "d098c742-f677-44a2-9aff-0ba2362e0268"
    emailSent: boolean; // true
    name: string; // "John Doew"
    email: string; // "user@examle.com"
    phoneNumber: string; // "+237613345678"
    role: string; // "customer"
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
  picture?: {
    uri: string; // File URI from image picker
    type: string; // MIME type: 'image/jpeg' or 'image/png'
    name: string; // Filename with proper extension
  }; // Optional restaurant profile picture
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
