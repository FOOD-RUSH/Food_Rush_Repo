import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsAuthenticated, useUser } from '@/src/stores/customerStores/AuthStore';
import { useSelectedUserType } from '@/src/stores/customerStores/AppStore';
import Toast from 'react-native-toast-message';

export const useRouteGuard = (requiredRole: 'customer' | 'restaurant') => {
  const navigation = useNavigation();
  const userType = useSelectedUserType();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  useEffect(() => {
    // If not authenticated, redirect to auth
    if (!isAuthenticated) {
      navigation.navigate('Auth' as never);
      return;
    }

    // If user type doesn't match required role, redirect to appropriate app
    if (userType && userType !== requiredRole) {
      Toast.show({
        type: 'error',
        text1: 'Access Denied',
        text2: `This feature is only available for ${requiredRole}s`,
        position: 'top',
      });

      // Navigate to the appropriate app based on user type
      if (userType === 'customer') {
        navigation.navigate('CustomerApp' as never);
      } else if (userType === 'restaurant') {
        // Check if restaurant is approved
        const verificationStatus = user?.verificationStatus;
        
        if (verificationStatus === 'PENDING_VERIFICATION' || verificationStatus === 'PENDING') {
          navigation.navigate('AwaitingApproval' as never);
        } else {
          navigation.navigate('RestaurantApp' as never);
        }
      }
      return;
    }

    // If restaurant user, check verification status
    if (requiredRole === 'restaurant' && userType === 'restaurant') {
      const verificationStatus = user?.verificationStatus;
      
      if (verificationStatus === 'PENDING_VERIFICATION' || verificationStatus === 'PENDING') {
        Toast.show({
          type: 'warning',
          text1: 'Restaurant Not Approved',
          text2: 'Your restaurant is still under review',
          position: 'top',
        });
        
        navigation.navigate('AwaitingApproval' as never);
        return;
      }
    }
  }, [isAuthenticated, userType, requiredRole, navigation, user?.verificationStatus]);

  return {
    isAuthorized: isAuthenticated && userType === requiredRole,
    userType,
    isAuthenticated,
  };
};

// Specific route guards for different user types
export const useCustomerRouteGuard = () => useRouteGuard('customer');
export const useRestaurantRouteGuard = () => useRouteGuard('restaurant');

// Route guard for authenticated users (any type)
export const useAuthenticatedRouteGuard = () => {
  const navigation = useNavigation();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Auth' as never);
    }
  }, [isAuthenticated, navigation]);

  return { isAuthenticated };
};
