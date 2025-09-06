import { useMutation } from "@tanstack/react-query";
import { restaurantAuthApi, RestaurantRegisterRequest } from "@/src/services/restaurant/authApi";

export const useRegisterRestaurant = () => {
  return useMutation({
    mutationFn: (userData: RestaurantRegisterRequest) =>
      restaurantAuthApi.register(userData).then((res) => res.data),
  });
};

export const useLoginRestaurant = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      restaurantAuthApi.login(credentials),
  });
};

export const useVerifyRestaurantOTP = () => {
  return useMutation({
    mutationFn: (otpData: { userId: string; otp: string; type: 'email' }) =>
      restaurantAuthApi.verifyOTP(otpData),
  });
};

export const useLogoutRestaurant = () => {
  return useMutation({
    mutationFn: () => restaurantAuthApi.logout(),
  });
};

export const useUpdateRestaurantProfile = () => {
  return useMutation({
    mutationFn: (userData: any) => restaurantAuthApi.updateProfile(userData),
  });
};

export const useResetRestaurantPassword = () => {
  return useMutation({
    mutationFn: ({ otp, email, newPassword }: { otp: string; email: string; newPassword: string }) =>
      restaurantAuthApi.resetPassword({ email, otp, newPassword }),
  });
};

export const useRequestRestaurantPasswordReset = () => {
  return useMutation({
    mutationFn: (data: any) => restaurantAuthApi.requestPasswordReset(data).then((response) => response.data),
  });
};