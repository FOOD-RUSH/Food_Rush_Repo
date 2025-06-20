import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'
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
    return <>{fallback}</>;
  }

  // Check if user type is allowed
  if (!allowedUserTypes.includes(user.userType)) {
    return <>{fallback}</>;
  }

  // Check email verification if required
  if (requireEmailVerification && !user.isEmailVerified) {
    return <>{fallback}</>;
  }

  // Check profile completion if required
  if (requireProfileCompletion && !isProfileComplete(user)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
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