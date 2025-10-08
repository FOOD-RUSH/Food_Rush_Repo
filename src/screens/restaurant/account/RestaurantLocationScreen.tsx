import {
  MaterialCommunityIcon,
  IoniconsIcon,
} from '@/src/components/common/icons';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import {
  Heading4,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import { useRestaurantProfile } from '@/src/hooks/restaurant/useRestaurantProfile';
import { useUpdateRestaurantLocation } from '@/src/hooks/restaurant/useRestaurantApi';
import { useLocation } from '@/src/location/useLocation';
import LocationService from '@/src/location/LocationService';
import Toast from 'react-native-toast-message';
import { Location } from '@/src/location/types';

const RestaurantLocationScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  // API hooks
  const { restaurantProfile, isLoading, error, loadProfileIfNeeded } =
    useRestaurantProfile();
  const updateLocationMutation = useUpdateRestaurantLocation();

  // Location service
  const { hasPermission, requestPermissionWithLocation } = useLocation({
    autoRequest: false,
    requestOnMount: false,
  });

  // State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Load profile on mount
  useEffect(() => {
    loadProfileIfNeeded();
  }, [loadProfileIfNeeded]);

  // Debug restaurant data
  useEffect(() => {
    if (restaurant) {
    } else {
    }
  }, [restaurant]);

  // Debug loading and error states
  useEffect(() => {
  }, [isLoading, error]);

  // Animation for loading indicator
  useEffect(() => {
    if (isGettingLocation) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      rotation.start();
      return () => rotation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isGettingLocation, rotateAnim]);

  // Get restaurant data
  const restaurant = restaurantProfile;

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProfileIfNeeded();
    } catch (error) {
      console.error('Error refreshing restaurant data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadProfileIfNeeded]);

  // Get exact GPS location
  const getExactLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {

      const servicesEnabled = await LocationService.isLocationEnabled();
      if (!servicesEnabled) {
        Toast.show({
          type: 'error',
          text1: 'Location Services Disabled',
          text2: 'Please enable location services in your device settings',
          position: 'top',
        });
        return;
      }

      if (!hasPermission) {
        const permissionGranted = await requestPermissionWithLocation();
        if (!permissionGranted) {
          Toast.show({
            type: 'error',
            text1: 'Location Permission Required',
            text2: 'Please allow location access to update restaurant location',
            position: 'top',
          });
          return;
        }
      }

      const locationResult = await LocationService.getCurrentLocation(true);

      if (
        locationResult.success &&
        locationResult.location &&
        !locationResult.location.isFallback
      ) {

        setSelectedLocation(locationResult.location);
        Toast.show({
          type: 'success',
          text1: 'Location Found',
          text2: 'Exact GPS coordinates obtained successfully',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2:
            locationResult.error ||
            'Could not get exact GPS location. Please try again.',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error getting exact location:', error);
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Failed to get GPS location. Please try again.',
        position: 'top',
      });
    } finally {
      setIsGettingLocation(false);
    }
  }, [hasPermission, requestPermissionWithLocation]);

  // Update restaurant location
  const updateRestaurantLocation = useCallback(async () => {
    if (!selectedLocation) {
      Toast.show({
        type: 'error',
        text1: 'No Location Selected',
        text2: 'Please get your GPS location first',
        position: 'top',
      });
      return;
    }

    if (!restaurant?.id) {
      Toast.show({
        type: 'error',
        text1: 'Restaurant ID Missing',
        text2: 'Unable to update location without restaurant ID',
        position: 'top',
      });
      return;
    }

    try {
      await updateLocationMutation.mutateAsync({
        restaurantId: restaurant.id,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });

      // Success is handled by the mutation's onSuccess callback
      setShowUpdateModal(false);
      setSelectedLocation(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Refresh restaurant data to get updated location
      await loadProfileIfNeeded();
    } catch (error: any) {
      console.error('Error updating restaurant location:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [selectedLocation, restaurant?.id, updateLocationMutation, loadProfileIfNeeded]);

  // Show update modal
  const showLocationUpdateModal = useCallback(() => {
    setShowUpdateModal(true);
    Haptics.selectionAsync();
  }, []);

  // Close update modal
  const closeUpdateModal = useCallback(() => {
    setShowUpdateModal(false);
    setSelectedLocation(null);
  }, []);

  // Handle get location from modal
  const handleGetLocationFromModal = useCallback(async () => {
    await getExactLocation();
  }, [getExactLocation]);

  // Loading state
  if (isLoading && !restaurant) {
    return (
      <CommonView>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcon
            name="loading"
            size={48}
            color={colors.primary}
          />
          <Body color={colors.onSurfaceVariant} style={{ marginTop: 16 }}>
            {t('loading_restaurant_location')}
          </Body>
        </View>
      </CommonView>
    );
  }

  // Error state
  if (error && !restaurant) {
    return (
      <CommonView>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcon
            name="alert-circle"
            size={48}
            color={colors.error}
          />
          <Heading4
            color={colors.onSurface}
            style={{ marginTop: 16, textAlign: 'center' }}
          >
            {t('failed_to_load_location')}
          </Heading4>
          <Body
            color={colors.onSurfaceVariant}
            style={{ marginTop: 8, textAlign: 'center' }}
          >
            {error || t('unable_to_fetch_restaurant_location_data')}
          </Body>
          <Button
            mode="contained"
            onPress={onRefresh}
            style={{ marginTop: 16 }}
            buttonColor={colors.primary}
          >
            {t('try_again')}
          </Button>
        </View>
      </CommonView>
    );
  }

  // No restaurant data but not loading or error (shouldn't happen)
  if (!restaurant && !isLoading && !error) {
    return (
      <CommonView>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcon
            name="store-off"
            size={48}
            color={colors.onSurfaceVariant}
          />
          <Heading4
            color={colors.onSurface}
            style={{ marginTop: 16, textAlign: 'center' }}
          >
            {t('no_restaurant_data')}
          </Heading4>
          <Body
            color={colors.onSurfaceVariant}
            style={{ marginTop: 8, textAlign: 'center' }}
          >
            {t('restaurant_information_not_available')}
          </Body>
          <Button
            mode="contained"
            onPress={onRefresh}
            style={{ marginTop: 16 }}
            buttonColor={colors.primary}
          >
            {t('reload')}
          </Button>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Current Location Display */}
        <View style={{ padding: 16 }}>
          <Card
            style={[styles.locationCard, { backgroundColor: colors.surface }]}
          >
            {/* Loading overlay when refreshing */}
            {isLoading && restaurant && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: colors.surface + '80',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 16,
                  zIndex: 1,
                }}
              >
                <MaterialCommunityIcon
                  name="loading"
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}
            <View style={{ padding: 20 }}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <MaterialCommunityIcon
                    name="store-marker"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Heading4 color={colors.onSurface} weight="bold">
                    {t('restaurant_location')}
                  </Heading4>
                  <Caption color={colors.onSurfaceVariant}>
                    {t('your_registered_business_address')}
                  </Caption>
                </View>
              </View>

              {/* Restaurant Info */}
              <View style={{ marginTop: 20 }}>
                <Label
                  color={colors.onSurface}
                  weight="semibold"
                  style={{ marginBottom: 4 }}
                >
                  {restaurant?.name}
                </Label>
                <Body
                  color={colors.onSurfaceVariant}
                  style={{ lineHeight: 20, marginBottom: 12 }}
                >
                  {restaurant?.address}
                </Body>

                {/* Coordinates */}
                {restaurant?.latitude && restaurant?.longitude && (
                  <View style={styles.coordinatesContainer}>
                    <MaterialCommunityIcon
                      name="map-marker"
                      size={16}
                      color={colors.onSurfaceVariant}
                    />
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginLeft: 4 }}
                    >
                      {typeof restaurant.latitude === 'number' ? restaurant.latitude.toFixed(6) : restaurant.latitude},{' '}
                      {typeof restaurant.longitude === 'number' ? restaurant.longitude.toFixed(6) : restaurant.longitude}
                    </Caption>
                  </View>
                )}

                {/* Delivery Radius */}
                {restaurant?.deliveryRadius && (
                  <View style={[styles.coordinatesContainer, { marginTop: 4 }]}>
                    <MaterialCommunityIcon
                      name="map-marker-radius"
                      size={16}
                      color={colors.onSurfaceVariant}
                    />
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginLeft: 4 }}
                    >
                      {t('delivery_radius')}: {restaurant?.deliveryRadius} km
                    </Caption>
                  </View>
                )}
              </View>
            </View>
          </Card>
        </View>

        {/* Update Location Button */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Button
            mode="contained"
            onPress={showLocationUpdateModal}
            buttonColor={colors.primary}
            contentStyle={{ paddingVertical: 12 }}
            style={{ borderRadius: 12 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
            icon={() => (
              <MaterialCommunityIcon
                name="crosshairs-gps"
                size={20}
                color="white"
              />
            )}
            >
              {t('update_location')}
            </Button>
        </View>

        {/* Info Card */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card
            style={[
              styles.infoCard,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <View style={{ padding: 16 }}>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcon
                  name="information"
                  size={20}
                  color={colors.primary}
                />
                <Label
                  color={colors.primary}
                  weight="semibold"
                  style={{ marginLeft: 8 }}
                >
                  {t('location_information')}
                </Label>
              </View>
              <Body
                color={colors.onSurfaceVariant}
                style={{ marginTop: 8, lineHeight: 20 }}
              >
                {t('location_information_description')}
              </Body>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Update Location Modal */}
      <Modal
        visible={showUpdateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeUpdateModal}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Modal Header */}
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.outline,
              },
            ]}
          >
            <Heading4 color={colors.onSurface} weight="bold">
              {t('update_restaurant_location')}
            </Heading4>
            <TouchableOpacity onPress={closeUpdateModal}>
              <IoniconsIcon name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Warning Card */}
            <Card
              style={[
                styles.warningCard,
                {
                  backgroundColor: colors.errorContainer || colors.error + '20',
                },
              ]}
            >
              <View style={{ padding: 16 }}>
                <View style={styles.warningHeader}>
                  <IoniconsIcon name="warning" size={24} color={colors.error} />
                  <Label
                    color={colors.error}
                    weight="semibold"
                    style={{ marginLeft: 8 }}
                  >
                    {t('important_notice')}
                  </Label>
                </View>
                <Body
                  color={colors.onErrorContainer || colors.error}
                  style={{ marginTop: 8, lineHeight: 20 }}
                >
                  {t('location_update_warning')}
                </Body>
              </View>
            </Card>

            {/* Current Location Display */}
            {selectedLocation && (
              <Card
                style={[
                  styles.selectedLocationCard,
                  {
                    backgroundColor:
                      colors.primaryContainer || colors.primary + '20',
                  },
                ]}
              >
                <View style={{ padding: 16 }}>
                  <View style={styles.selectedLocationHeader}>
                    <MaterialCommunityIcon
                      name="map-marker-check"
                      size={24}
                      color={colors.primary}
                    />
                    <Label
                      color={colors.primary}
                      weight="semibold"
                      style={{ marginLeft: 8 }}
                    >
                      {t('new_location_selected')}
                    </Label>
                  </View>
                  <Body
                    color={colors.onPrimaryContainer || colors.primary}
                    style={{ marginTop: 8, lineHeight: 20 }}
                  >
                    {selectedLocation.formattedAddress}
                  </Body>
                  <Caption
                    color={colors.onPrimaryContainer || colors.primary}
                    style={{ marginTop: 4 }}
                  >
                    {selectedLocation.latitude.toFixed(6)},{' '}
                    {selectedLocation.longitude.toFixed(6)}
                  </Caption>
                </View>
              </Card>
            )}

            {/* Instructions */}
            <View style={{ marginTop: 20 }}>
              <Label
                color={colors.onSurface}
                weight="semibold"
                style={{ marginBottom: 12 }}
              >
                {t('before_you_continue')}
              </Label>

              <View style={styles.instructionItem}>
                <IoniconsIcon
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
                <Body
                  color={colors.onSurface}
                  style={{ flex: 1, marginLeft: 12 }}
                >
                  {t('be_physically_present_at_restaurant')}
                </Body>
              </View>

              <View style={styles.instructionItem}>
                <IoniconsIcon
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
                <Body
                  color={colors.onSurface}
                  style={{ flex: 1, marginLeft: 12 }}
                >
                  {t('ensure_gps_location_enabled')}
                </Body>
              </View>

              <View style={styles.instructionItem}>
                <IoniconsIcon
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
                <Body
                  color={colors.onSurface}
                  style={{ flex: 1, marginLeft: 12 }}
                >
                  {t('verify_official_delivery_address')}
                </Body>
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View
            style={[
              styles.modalActions,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.outline,
              },
            ]}
          >
            {!selectedLocation ? (
              <>
                <Button
                  mode="outlined"
                  onPress={closeUpdateModal}
                  style={styles.modalButton}
                  labelStyle={{ color: colors.onSurface }}
                >
                  {t('cancel')}
                </Button>

                <Button
                  mode="contained"
                  onPress={handleGetLocationFromModal}
                  loading={isGettingLocation}
                  disabled={isGettingLocation}
                  buttonColor={colors.primary}
                  style={styles.modalButton}
                  icon={() => (
                    <Animated.View
                      style={{
                        transform: [
                          {
                            rotate: rotateAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      }}
                    >
                      <MaterialCommunityIcon
                        name={isGettingLocation ? 'loading' : 'crosshairs-gps'}
                        size={20}
                        color="white"
                      />
                    </Animated.View>
                  )}
                >
                  {isGettingLocation
                    ? t('getting_location')
                    : t('get_my_location')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  mode="outlined"
                  onPress={() => setSelectedLocation(null)}
                  style={styles.modalButton}
                  labelStyle={{ color: colors.onSurface }}
                >
                  {t('get_different_location')}
                </Button>

                <Button
                  mode="contained"
                  onPress={updateRestaurantLocation}
                  loading={updateLocationMutation.isPending}
                  disabled={updateLocationMutation.isPending}
                  buttonColor={colors.primary}
                  style={styles.modalButton}
                >
                  {updateLocationMutation.isPending
                    ? t('updating')
                    : t('update_location')}
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCard: {
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  warningCard: {
    borderRadius: 12,
    marginBottom: 20,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedLocationCard: {
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
  },
});

export default RestaurantLocationScreen;
