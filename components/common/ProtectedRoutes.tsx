import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store'
import { User } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: ('customer' | 'restaurant')[];
  fallback?: React.ReactNode;
  requireEmailVerification?: boolean;
  requireProfileCompletion?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserTypes,
  fallback = null,
  requireEmailVerification = false,
  requireProfileCompletion = false,
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <View>{fallback}</View>;
  }

  // Check if user type is allowed
  if (!allowedUserTypes.includes(user.userType)) {
    return <View>{fallback}</View>;
  }

  // Check email verification if required
  if (requireEmailVerification && !user.isEmailVerified) {
    return <View>{fallback}</View>;
  }

  // Check profile completion if required
  if (requireProfileCompletion && !isProfileComplete(user)) {
    return <View>{fallback}</View>;
  }

  return <View>{children}</View>;
};

const isProfileComplete = (user: User): boolean => {
  if (user.userType === 'customer') {
    const profile = user.profile as any;
    return !!(profile.firstName && profile.lastName && profile.phone);
  } else {
    const profile = user.profile as any;
    return !!(profile.name && profile.description && profile.phone && profile.address);
  }
};