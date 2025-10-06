import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import * as ExpoLocation from 'expo-location';

import { useLocation } from '@/src/location';
import { Location } from '@/src/location/types';
import { Typography } from './Typography';
import { ResponsiveContainer } from './ResponsiveContainer';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';

interface LocationModalProps {
  onLocationSelected: (location: Location) => void;
  onClose: () => void;
  selectedLocation?: Location | null;
  required?: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({
  onLocationSelected,
  onClose,
  selectedLocation,
  required = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isSmallScreen, wp, hp } = useResponsive();
  const spacing = useResponsiveSpacing();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { location, isLoading, error, hasPermission } = useLocation({
    autoRequest: false,
  });

  const handleManualEntry = useCallback(() => {
    Alert.prompt(
      t('manual_address'),
      t('manual_address_description'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('save'),
          onPress: (address) => {
            if (address && address.trim()) {
              const manualLocation: Location = {
                latitude: 3.8667, // Yaoundé center coordinates
                longitude: 11.5167,
                city: 'Yaoundé',
                exactLocation: address.trim(),
                formattedAddress: `${address.trim()}, Yaoundé, Cameroun`,
                isFallback: true,
                timestamp: Date.now(),
              };
              onLocationSelected(manualLocation);
              onClose();
            } else {
              Alert.alert(t('error'), t('please_enter_valid_address'));
            }
          },
        },
      ],
      'plain-text',
      '',
      'default',
    );
  }, [t, onLocationSelected, onClose]);

  const handleGetCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Check if location services are enabled first
      const servicesEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setIsGettingLocation(false);
        Alert.alert(
          t('location_services_disabled'),
          t('location_services_disabled_description'),
          [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('open_settings'),
              onPress: () => ExpoLocation.enableNetworkProviderAsync(),
            },
          ],
        );
        return;
      }

      if (!hasPermission) {
        // Request permission first
        const { status } =
          await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setIsGettingLocation(false);
          Alert.alert(
            t('location_permission_required'),
            t('location_required_for_restaurant'),
            [
              { text: t('cancel'), style: 'cancel' },
              { text: t('try_again'), onPress: handleGetCurrentLocation },
            ],
          );
          return;
        }
      }

      // Get current location with improved timeout and accuracy
      const locationResult = await Promise.race([
        ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.High,
          timeInterval: 15000,
          distanceInterval: 1,
        }),
        new Promise<never>(
          (_, reject) =>
            setTimeout(() => reject(new Error('GPS timeout')), 20000), // Increased timeout to 20 seconds
        ),
      ]);

      if (locationResult) {
        // Reverse geocode to get address
        let formattedAddress = 'Yaoundé, Cameroun';
        let exactLocation = 'Yaoundé';

        try {
          const geocodeResult = await ExpoLocation.reverseGeocodeAsync({
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude,
          });

          if (geocodeResult && geocodeResult.length > 0) {
            const result = geocodeResult[0];
            const addressParts = [
              result.street,
              result.district || result.subregion,
              result.city || 'Yaoundé',
              'Cameroun',
            ].filter(Boolean);

            formattedAddress = addressParts.join(', ');
            exactLocation =
              result.street || result.district || result.subregion || 'Yaoundé';
          }
        } catch (geocodeError) {
          // Continue with coordinates even if geocoding fails
        }

        const newLocation: Location = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          city: 'Yaoundé',
          exactLocation,
          formattedAddress,
          isFallback: false,
          timestamp: Date.now(),
        };

        onLocationSelected(newLocation);
        onClose();
      }
    } catch (error) {
      console.error('Location error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('timeout')) {
        Alert.alert(t('location_timeout'), t('location_timeout_message'), [
          { text: t('cancel'), style: 'cancel' },
          { text: t('try_again'), onPress: handleGetCurrentLocation },
          { text: t('use_manual'), onPress: handleManualEntry },
        ]);
      } else {
        Alert.alert(t('location_error'), t('location_error_generic'), [
          { text: t('cancel'), style: 'cancel' },
          { text: t('try_again'), onPress: handleGetCurrentLocation },
          { text: t('use_manual'), onPress: handleManualEntry },
        ]);
      }
    } finally {
      setIsGettingLocation(false);
    }
  }, [hasPermission, onLocationSelected, onClose, t, handleManualEntry]);

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

  const isLocationLoading = isLoading || isGettingLocation;

  return (
    <ResponsiveContainer padding="none" style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.outline + '20',
          marginHorizontal: 12,
        }}
      >
        <Typography variant="h5" weight="semibold" color={colors.onSurface}>
          {t('select_location')}
        </Typography>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: spacing.sm,
            borderRadius: 20,
            backgroundColor: colors.surfaceVariant,
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcon
            name="close"
            size={20}
            color={colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
        {/* Location Icon and Description */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: spacing.xl,
          }}
        >
          <View
            style={{
              width: wp(20),
              height: wp(20),
              borderRadius: wp(10),
              backgroundColor: colors.primary + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <MaterialCommunityIcon
              name="map-marker"
              size={wp(8)}
              color={colors.primary}
            />
          </View>

          <Typography
            variant="h6"
            weight="semibold"
            align="center"
            style={{ marginBottom: spacing.sm }}
          >
            {t('restaurant_location')}
            {required && <Typography color={colors.error}> *</Typography>}
          </Typography>

          <Typography
            variant="body"
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginBottom: spacing.lg }}
          >
            {t('location_helps_customers_find_restaurant')}
          </Typography>
        </View>

        {/* Current Location Display */}
        {(selectedLocation || location) && (
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              borderRadius: 12,
              padding: spacing.md,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.primary + '30',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcon
                name="map-marker-check"
                size={20}
                color={colors.primary}
                style={{ marginRight: spacing.sm }}
              />
              <View style={{ flex: 1 }}>
                <Typography variant="labelLarge" weight="medium">
                  {t('selected_location')}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={colors.onSurfaceVariant}
                  numberOfLines={2}
                >
                  {getLocationDisplayText()}
                </Typography>
              </View>
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View
            style={{
              backgroundColor: colors.errorContainer,
              borderRadius: 8,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <Typography variant="bodySmall" color={colors.onErrorContainer}>
              {error}
            </Typography>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ gap: spacing.md }}>
          {/* Get Current Location Button */}
          <Button
            mode="contained"
            onPress={handleGetCurrentLocation}
            disabled={isLocationLoading}
            buttonColor={colors.primary}
            contentStyle={{
              paddingVertical: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
            }}
            style={{
              borderRadius: 12,
            }}
            icon={({ size, color }) =>
              isLocationLoading ? (
                <ActivityIndicator size={size} color={color} />
              ) : (
                <MaterialCommunityIcon
                  name="crosshairs-gps"
                  size={size}
                  color={color}
                />
              )
            }
          >
            {isLocationLoading
              ? t('getting_location')
              : t('use_current_location')}
          </Button>

          {/* Manual Entry Button */}
          <Button
            mode="outlined"
            onPress={handleManualEntry}
            disabled={isLocationLoading}
            contentStyle={{
              paddingVertical: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.onSurface,
            }}
            style={{
              borderRadius: 12,
              borderColor: colors.outline,
            }}
            icon={({ size, color }) => (
              <MaterialCommunityIcon name="pencil" size={size} color={color} />
            )}
          >
            {t('enter_address_manually')}
          </Button>
        </View>

        {/* Help Text */}
        <View
          style={{
            marginTop: spacing.xl,
            padding: spacing.md,
            backgroundColor: colors.surfaceVariant + '50',
            borderRadius: 8,
          }}
        >
          <Typography
            variant="caption"
            color={colors.onSurfaceVariant}
            align="center"
          >
            {t('location_privacy_notice')}
          </Typography>
        </View>
      </View>
    </ResponsiveContainer>
  );
};

export default LocationModal;
