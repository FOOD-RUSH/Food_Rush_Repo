import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Location } from '@/src/location/types';
import { Typography } from './Typography';
import { ResponsiveContainer } from './ResponsiveContainer';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';
import LocationModal from './LocationModal';

interface LocationPickerProps {
  onLocationSelected: (location: Location) => void;
  selectedLocation?: Location | null;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
  selectedLocation,
  required = false,
  label,
  placeholder,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isSmallScreen, wp } = useResponsive();
  const spacing = useResponsiveSpacing();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLocationPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleLocationSelected = useCallback((location: Location) => {
    onLocationSelected(location);
    setIsModalVisible(false);
  }, [onLocationSelected]);

  const getLocationDisplayText = () => {
    if (selectedLocation) {
      return selectedLocation.formattedAddress || selectedLocation.exactLocation;
    }
    return placeholder || t('tap_to_select_location');
  };

  const getLocationIcon = () => {
    if (selectedLocation) {
      return 'map-marker-check';
    }
    return 'map-marker-outline';
  };

  const getLocationColor = () => {
    if (selectedLocation) {
      return colors.primary;
    }
    if (required) {
      return colors.error;
    }
    return colors.onSurfaceVariant;
  };

  const getBorderColor = () => {
    if (selectedLocation) {
      return colors.primary + '30';
    }
    if (required && !selectedLocation) {
      return colors.error;
    }
    return colors.outline;
  };

  return (
    <ResponsiveContainer padding="none" style={{ marginBottom: spacing.md }}>
      <Card
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: getBorderColor(),
          elevation: 0,
        }}
      >
        <TouchableOpacity
          onPress={handleLocationPress}
          style={{
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          {/* Icon Container */}
          <View
            style={{
              width: isSmallScreen ? 40 : 48,
              height: isSmallScreen ? 40 : 48,
              borderRadius: isSmallScreen ? 20 : 24,
              backgroundColor: getLocationColor() + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}
          >
            <MaterialCommunityIcons
              name={getLocationIcon() as any}
              size={isSmallScreen ? 20 : 24}
              color={getLocationColor()}
            />
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Typography
              variant={isSmallScreen ? 'labelLarge' : 'h6'}
              weight="medium"
              color={colors.onSurface}
              style={{ marginBottom: spacing.xs }}
            >
              {label || t('restaurant_location')}
              {required && (
                <Typography color={colors.error}> *</Typography>
              )}
            </Typography>
            
            <Typography
              variant={isSmallScreen ? 'bodySmall' : 'body'}
              color={
                selectedLocation
                  ? colors.onSurface
                  : colors.onSurfaceVariant
              }
              numberOfLines={2}
              style={{ lineHeight: isSmallScreen ? 18 : 20 }}
            >
              {getLocationDisplayText()}
            </Typography>

            {/* Location Accuracy Indicator */}
            {selectedLocation && !selectedLocation.isFallback && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: spacing.xs,
                }}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={12}
                  color={colors.primary}
                  style={{ marginRight: 4 }}
                />
                <Typography
                  variant="caption"
                  color={colors.primary}
                >
                  {t('accurate_location')}
                </Typography>
              </View>
            )}

            {/* Fallback Location Indicator */}
            {selectedLocation?.isFallback && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: spacing.xs,
                }}
              >
                <MaterialCommunityIcons
                  name="information"
                  size={12}
                  color={colors.onSurfaceVariant}
                  style={{ marginRight: 4 }}
                />
                <Typography
                  variant="caption"
                  color={colors.onSurfaceVariant}
                >
                  {t('approximate_location')}
                </Typography>
              </View>
            )}
          </View>

          {/* Arrow Icon */}
          <View style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </View>
        </TouchableOpacity>
      </Card>

      {/* Help Text */}
      {!selectedLocation && (
        <View style={{ marginTop: spacing.sm, paddingHorizontal: spacing.sm }}>
          <Typography
            variant="caption"
            color={colors.onSurfaceVariant}
            align="center"
          >
            {t('location_helps_delivery_accuracy')}
          </Typography>
        </View>
      )}

      {/* Full Screen Location Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <LocationModal
            onLocationSelected={handleLocationSelected}
            onClose={handleCloseModal}
            selectedLocation={selectedLocation}
            required={required}
          />
        </SafeAreaView>
      </Modal>
    </ResponsiveContainer>
  );
};

export default LocationPicker;