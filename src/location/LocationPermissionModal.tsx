import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import ReusableModal from '@/src/components/customer/ReusableModal';

interface LocationPermissionModalProps {
  visible: boolean;
  onRequestPermission: () => Promise<void>;
  onDeny: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * Enhanced location permission modal component using ReusableModal
 * Shows when location permission is needed with clear explanations
 */
export const LocationPermissionModal: React.FC<
  LocationPermissionModalProps
> = ({ visible, onRequestPermission, onDeny, onClose, isLoading = false }) => {
  const { colors } = useTheme();

  return (
    <ReusableModal
      visible={visible}
      onDismiss={onClose}
      title="Location Access Required"
      size="medium"
      animationType="slide"
      showCloseButton={true}
      dismissOnBackdropPress={false}
      scrollable={true}
    >
      <View className="items-center mb-6">
        {/* Icon */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <Ionicons name="location" size={40} color={colors.primary} />
        </View>

        {/* Title */}
        <Text
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: colors.onSurface }}
        >
          Enable Location Services
        </Text>

        {/* Detailed Explanation */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3 text-center"
            style={{ color: colors.onSurface }}
          >
            Why we need your location:
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-start">
              <Ionicons 
                name="restaurant-outline" 
                size={20} 
                color={colors.primary} 
                style={{ marginTop: 2, marginRight: 12 }}
              />
              <View className="flex-1">
                <Text
                  className="font-medium mb-1"
                  style={{ color: colors.onSurface }}
                >
                  Find Nearby Restaurants
                </Text>
                <Text
                  className="text-sm leading-5"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Discover restaurants closest to your current location
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={colors.primary} 
                style={{ marginTop: 2, marginRight: 12 }}
              />
              <View className="flex-1">
                <Text
                  className="font-medium mb-1"
                  style={{ color: colors.onSurface }}
                >
                  Accurate Delivery Times
                </Text>
                <Text
                  className="text-sm leading-5"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Get precise delivery estimates based on your exact location
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Ionicons 
                name="navigate-outline" 
                size={20} 
                color={colors.primary} 
                style={{ marginTop: 2, marginRight: 12 }}
              />
              <View className="flex-1">
                <Text
                  className="font-medium mb-1"
                  style={{ color: colors.onSurface }}
                >
                  Personalized Experience
                </Text>
                <Text
                  className="text-sm leading-5"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  See menus and offers available in your area
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Privacy Assurance */}
        <View
          className="p-4 rounded-xl mb-6"
          style={{ backgroundColor: colors.surfaceVariant }}
        >
          <View className="flex-row items-center mb-2">
            <Ionicons 
              name="shield-checkmark-outline" 
              size={18} 
              color={colors.primary} 
              style={{ marginRight: 8 }}
            />
            <Text
              className="font-semibold"
              style={{ color: colors.onSurfaceVariant }}
            >
              Your Privacy is Protected
            </Text>
          </View>
          <Text
            className="text-xs leading-4"
            style={{ color: colors.onSurfaceVariant }}
          >
            We only use your location to improve your food delivery experience. 
            Your data is never shared with third parties without your consent.
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full gap-3">
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isLoading ? 'opacity-50' : ''}`}
            style={{ backgroundColor: colors.primary }}
            onPress={onRequestPermission}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-center text-base">
              {isLoading ? 'Requesting Access...' : 'Allow Location Access'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 px-6 rounded-xl border"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.outline
            }}
            onPress={onDeny}
            disabled={isLoading}
          >
            <Text
              className="font-medium text-center text-base"
              style={{ color: colors.onSurface }}
            >
              Use Default Location (Yaoundé)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help text */}
        <Text
          className="text-center text-xs mt-4 px-4"
          style={{ color: colors.onSurfaceVariant }}
        >
          You can change location permissions anytime in your device settings
        </Text>
      </View>
    </ReusableModal>
  );
};

interface LocationStatusProps {
  location: { city: string; region: string; isFallback: boolean } | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

/**
 * Simple location status indicator component
 */
export const LocationStatus: React.FC<LocationStatusProps> = ({
  location,
  isLoading,
  error,
  hasPermission,
}) => {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View className="flex-row items-center">
        <View
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: colors.primary }}
        />
        <Text className="text-xs" style={{ color: colors.onSurfaceVariant }}>
          Getting location...
        </Text>
      </View>
    );
  }

  if (error && !location) {
    return (
      <View className="flex-row items-center">
        <View className="w-2 h-2 bg-red-400 rounded-full mr-2" />
        <Text className="text-xs" style={{ color: colors.onSurfaceVariant }}>
          Location error
        </Text>
      </View>
    );
  }

  if (!hasPermission && !location) {
    return (
      <View className="flex-row items-center">
        <View className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
        <Text className="text-xs" style={{ color: colors.onSurfaceVariant }}>
          Location access needed
        </Text>
      </View>
    );
  }

  if (location) {
    return (
      <View className="flex-row items-center">
        <View
          className={`w-2 h-2 rounded-full mr-2 ${
            location.isFallback ? 'bg-orange-400' : 'bg-green-400'
          }`}
        />
        <Text className="text-xs" style={{ color: colors.onSurfaceVariant }}>
          {location.isFallback
            ? 'Default location'
            : `${location.city}, ${location.region}`}
        </Text>
      </View>
    );
  }

  return null;
};

interface LocationRefreshButtonProps {
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Simple location refresh button
 */
export const LocationRefreshButton: React.FC<LocationRefreshButtonProps> = ({
  onRefresh,
  isLoading = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className={`p-2 rounded-full ${isLoading ? 'opacity-50' : ''}`}
      style={{ backgroundColor: colors.primary }}
      onPress={onRefresh}
      disabled={isLoading}
    >
      <Ionicons
        name={isLoading ? 'hourglass-outline' : 'refresh-outline'}
        size={20}
        color="white"
      />
    </TouchableOpacity>
  );
};
