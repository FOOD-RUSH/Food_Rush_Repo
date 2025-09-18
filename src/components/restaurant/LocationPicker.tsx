import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import { useLocation } from '@/src/location';
import { Location } from '@/src/location/types';

interface LocationPickerProps {
  onLocationSelected: (location: Location) => void;
  selectedLocation?: Location | null;
  required?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
  selectedLocation,
  required = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  const {
    location,
    isLoading,
    error,
    hasPermission,
    requestPermissionWithLocation,
    getCurrentLocation,
    showLocationPermissionDialog,
  } = useLocation({ autoRequest: false });

  const handleLocationRequest = useCallback(async () => {
    setIsPickingLocation(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (!hasPermission) {
        // Show permission dialog first
        showLocationPermissionDialog(
          async () => {
            const success = await requestPermissionWithLocation();
            if (success && location) {
              onLocationSelected(location);
            }
            setIsPickingLocation(false);
          },
          () => {
            setIsPickingLocation(false);
            Alert.alert(
              t('location_required'),
              t('location_required_for_restaurant'),
              [
                { text: t('cancel'), style: 'cancel' },
                { text: t('try_again'), onPress: handleLocationRequest },
              ],
            );
          },
        );
      } else {
        // Already have permission, just get location
        const success = await getCurrentLocation(true);
        if (success && location) {
          onLocationSelected(location);
        }
        setIsPickingLocation(false);
      }
    } catch (error) {
      console.error('Location picker error:', error);
      setIsPickingLocation(false);
      Alert.alert(t('error'), t('failed_to_get_location'), [{ text: t('ok') }]);
    }
  }, [
    hasPermission,
    location,
    onLocationSelected,
    requestPermissionWithLocation,
    getCurrentLocation,
    showLocationPermissionDialog,
    t,
  ]);

  const getLocationDisplayText = () => {
    if (selectedLocation) {
      return (
        selectedLocation.formattedAddress || selectedLocation.exactLocation
      );
    }
    if (location) {
      return location.formattedAddress || location.exactLocation;
    }
    return t('no_location_selected');
  };

  const getLocationIcon = () => {
    if (selectedLocation || location) {
      return 'map-marker-check';
    }
    return 'map-marker-outline';
  };

  const getLocationColor = () => {
    if (selectedLocation || location) {
      return colors.primary;
    }
    if (required) {
      return colors.error;
    }
    return colors.onSurfaceVariant;
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Card
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor:
            required && !selectedLocation && !location
              ? colors.error
              : colors.outline,
        }}
      >
        <TouchableOpacity
          onPress={handleLocationRequest}
          disabled={isLoading || isPickingLocation}
          style={{
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: getLocationColor() + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <MaterialCommunityIcons
              name={getLocationIcon() as any}
              size={20}
              color={getLocationColor()}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.onSurface,
                marginBottom: 4,
              }}
            >
              {t('restaurant_location')}
              {required && <Text style={{ color: colors.error }}> *</Text>}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  selectedLocation || location
                    ? colors.onSurface
                    : colors.onSurfaceVariant,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {getLocationDisplayText()}
            </Text>
            {error && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error,
                  marginTop: 4,
                }}
              >
                {error}
              </Text>
            )}
          </View>

          <View style={{ alignItems: 'center' }}>
            {isLoading || isPickingLocation ? (
              <MaterialCommunityIcons
                name="loading"
                size={24}
                color={colors.primary}
              />
            ) : (
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.onSurfaceVariant}
              />
            )}
          </View>
        </TouchableOpacity>
      </Card>

      {/* Manual Address Input Option */}
      <TouchableOpacity
        style={{
          marginTop: 8,
          padding: 12,
          alignItems: 'center',
        }}
        onPress={() => {
          Alert.alert(t('manual_address'), t('manual_address_description'), [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('continue'),
              onPress: () => {
                // For now, we'll use a fallback location
                // In a real app, you'd show a text input dialog
                const fallbackLocation: Location = {
                  latitude: 3.848,
                  longitude: 11.502,
                  city: 'Yaoundé',
                  exactLocation: 'Manual Address',
                  formattedAddress: 'Manual Address, Yaoundé, Cameroun',
                  isFallback: true,
                  timestamp: Date.now(),
                };
                onLocationSelected(fallbackLocation);
              },
            },
          ]);
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.primary,
            textDecorationLine: 'underline',
          }}
        >
          {t('enter_address_manually')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationPicker;
