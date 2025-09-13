import { restaurantApiClient } from './apiClient';

export interface RestaurantRegisterRequest {
  role: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  name: string; // Restaurant name
  address?: string; // Optional
  documentUri?: string; // Optional document
}

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
    restaurant: {
      id: string;
      name: string;
      address: string;
      phone: string;
      isOpen: boolean;
      latitude: number | null;
      longitude: number | null;
      verificationStatus: string;
      documentUrl: string | null;
      owner: {
        id: string;
        email: string;
        phoneNumber: string;
        password: string;
        fullName: string;
        role: string;
        status: string;
        authProvider: string;
        providerId: string | null;
        profilePicture: string | null;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        emailVerificationToken: string | null;
        phoneVerificationToken: string | null;
        passwordResetToken: string | null;
        passwordResetExpires: string | null;
        lastLoginAt: string | null;
        refreshToken: string | null;
        emailVerificationExpires: string | null;
        phoneVerificationExpires: string | null;
        riderStatus: string;
        vehicleType: string | null;
        isAvailable: boolean;
        licenseNumber: string | null;
        vehiclePlate: string | null;
        idDocumentUrl: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
      };
      ownerId: string;
      menuMode: string;
      timezone: string;
      deliveryBaseFee: number | null;
      deliveryPerKmRate: number | null;
      deliveryMinFee: number | null;
      deliveryMaxFee: number | null;
      deliveryFreeThreshold: number | null;
      deliverySurgeMultiplier: number | null;
      createdAt: string;
      updatedAt: string;
    };
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
    restaurants: {
      id: string;
      name: string;
      address: string;
      phone: string;
      isOpen: boolean;
      latitude: number | null;
      longitude: number | null;
      verificationStatus: string;
      documentUrl: string | null;
      ownerId: string;
      menuMode: string;
      timezone: string;
      deliveryBaseFee: number | null;
      deliveryPerKmRate: number | null;
      deliveryMinFee: number | null;
      deliveryMaxFee: number | null;
      deliveryFreeThreshold: number | null;
      deliverySurgeMultiplier: number | null;
      createdAt: string;
      updatedAt: string;
    }[];
    defaultRestaurantId: string;
  };
}

export const restaurantAuthApi = {
  register: (data: RestaurantRegisterRequest) => {
    return restaurantApiClient.post<RestaurantRegisterResponse>('/restaurants/auth/register-and-create', {...data});
  },

  login: (credentials: { email: string; password: string }) => {
    return restaurantApiClient.post<RestaurantLoginResponse>('/restaurants/auth/login', {...credentials});
  },

  verifyOTP: (data: { userId: string; otp: string; type: 'email' }) => {
    return restaurantApiClient.post('/restaurants/auth/verify-otp', data);
  },

  logout: () => {
    return restaurantApiClient.post('/restaurants/auth/logout');
  },

  refreshToken: (refreshToken: string) => {
    return restaurantApiClient.post('/restaurants/auth/refresh-token', { refreshToken });
  },

  updateProfile: (data: any) => {
    return restaurantApiClient.put('/restaurants/auth/profile', data);
  },

  getProfile: () => {
    return restaurantApiClient.get('/restaurants/auth/profile');
  },

  requestPasswordReset: (data: { email: string }) => {
    return restaurantApiClient.post('/restaurants/auth/forgot-password', data);
  },

  resetPassword: (data: { email: string; otp: string; newPassword: string }) => {
    return restaurantApiClient.post('/restaurants/auth/reset-password', data);
  },

  resendVerification: (email: string) => {
    return restaurantApiClient.post('/restaurants/auth/resend-verification', { email });
  },
};