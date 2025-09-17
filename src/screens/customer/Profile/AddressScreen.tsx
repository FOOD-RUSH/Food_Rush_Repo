import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import {
  useSavedAddresses,
  useLocationActions,
  useDefaultAddressId,
} from '@/src/location';
import AddressEditModal from '@/src/components/customer/AddressEditModal';
import { Card, useTheme, FAB, Snackbar } from 'react-native-paper';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAddressManager } from '@/src/hooks/customer/useAddressManager';

const AddressScreen = ({
  navigation,
}: RootStackScreenProps<'AddressScreen'>) => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showCurrentLocationSuggestion, setShowCurrentLocationSuggestion] = useState(false);

  // Store hooks
  const addresses = useSavedAddresses();
  const defaultAddressId = useDefaultAddressId();
  const {
    setDefaultAddress,
    deleteSavedAddress,
    addSavedAddress,
    updateSavedAddress,
  } = useLocationActions();

  // Address manager for location integration
  const {
    currentLocation,
    hasLocationPermission,
    addAddressFromCurrentLocation,
    requestLocationPermission,
    isProcessing,
  } = useAddressManager();

  // Check if we should show current location suggestion
  useEffect(() => {
    // Show suggestion if:
    // 1. No addresses saved yet
    // 2. We have current location
    // 3. User has location permission or location is available
    if (addresses.length === 0 && currentLocation && !showCurrentLocationSuggestion) {
      setShowCurrentLocationSuggestion(true);
    }
  }, [addresses.length, currentLocation, showCurrentLocationSuggestion]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simple refresh - just reset the refreshing state
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleEditAddress = (address: any) => {
    setSelectedAddress(address);
    setModalVisible(true);
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setModalVisible(true);
  };

  const handleSaveAddress = async (addressData: any) => {
    try {
      if (selectedAddress) {
        // Update existing address
        updateSavedAddress(selectedAddress.id, {
          ...addressData,
          updatedAt: Date.now(),
        });
        showMessage('Address updated successfully');
      } else {
        // Add new address - simplified without geocoding
        addSavedAddress({
          ...addressData,
          coordinates: addressData.coordinates || {
            latitude: 3.8667, // Default Yaoundé coordinates
            longitude: 11.5167,
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        showMessage('Address added successfully');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showMessage('Failed to save address. Please try again.');
    }
    setModalVisible(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      t('delete_address'),
      t('are_you_sure_you_want_to_delete_this_address'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            try {
              deleteSavedAddress(addressId);
              showMessage('Address deleted successfully');
            } catch (error) {
              console.error('Error deleting address:', error);
              showMessage('Failed to delete address. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleSetDefaultAddress = (addressId: string) => {
    try {
      setDefaultAddress(addressId);
      showMessage('Default address updated successfully');
    } catch (error) {
      console.error('Error setting default address:', error);
      showMessage('Failed to update default address. Please try again.');
    }
  };

  const handleAddCurrentLocation = async () => {
    try {
      const success = await addAddressFromCurrentLocation('Current Location');
      if (success) {
        showMessage('Current location added successfully');
        setShowCurrentLocationSuggestion(false);
      } else {
        showMessage('Failed to add current location. Please try again.');
      }
    } catch (error) {
      console.error('Error adding current location:', error);
      showMessage('Failed to add current location. Please try again.');
    }
  };

  const handleDismissLocationSuggestion = () => {
    setShowCurrentLocationSuggestion(false);
  };

  const AddressCard = ({ address }: { address: any }) => {
    const isDefault = address.id === defaultAddressId || address.isDefault;

    return (
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          backgroundColor: colors.surface,
          marginVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="location-outline" color="#007aff" size={24} />

              <View className="flex-col mx-3 flex-1">
                <View className="flex-row items-center">
                  <Text
                    style={{ color: colors.onSurface }}
                    className="text-lg font-semibold"
                  >
                    {address.label || 'Address'}
                  </Text>
                  {isDefault && (
                    <View
                      className="ml-2 px-2 py-1 rounded-full"
                      style={{ backgroundColor: '#007aff' }}
                    >
                      <Text className="text-white text-xs font-medium">
                        {t('default')}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{ color: colors.onSurfaceVariant }}
                  className="text-sm mt-1"
                  numberOfLines={2}
                >
                  {address.fullAddress ||
                    address.street ||
                    'No address details'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => handleEditAddress(address)}
                className="p-2 rounded-full mr-2"
                style={{ backgroundColor: colors.surfaceVariant }}
                activeOpacity={0.7}
              >
                <AntDesign name="edit" size={18} color="#007aff" />
              </TouchableOpacity>

              {!isDefault && (
                <TouchableOpacity
                  onPress={() => handleSetDefaultAddress(address.id)}
                  className="p-2 rounded-full mr-2"
                  style={{ backgroundColor: colors.surfaceVariant }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="star-outline" size={18} color="#007aff" />
                </TouchableOpacity>
              )}

              {!isDefault && (
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(address.id)}
                  className="p-2 rounded-full"
                  style={{ backgroundColor: colors.surfaceVariant }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={18}
                    color="#ff4444"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const CurrentLocationSuggestion = () => {
    if (!showCurrentLocationSuggestion || !currentLocation) return null;

    return (
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          backgroundColor: '#e3f2fd',
          marginVertical: 8,
          borderColor: '#007aff',
          borderWidth: 1,
        }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="location" color="#007aff" size={24} />
              <View className="flex-col mx-3 flex-1">
                <Text className="text-lg font-semibold text-blue-800">
                  Use Current Location
                </Text>
                <Text className="text-sm mt-1 text-blue-600" numberOfLines={2}>
                  {currentLocation.formattedAddress || `${currentLocation.city}, Cameroon`}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleAddCurrentLocation}
                disabled={isProcessing}
                className="px-4 py-2 rounded-full mr-2"
                style={{ 
                  backgroundColor: '#007aff',
                  opacity: isProcessing ? 0.6 : 1,
                }}
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">
                  {isProcessing ? 'Adding...' : 'Add'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDismissLocationSuggestion}
                className="p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const EmptyState = () => {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons
          name="location-outline"
          size={80}
          color={colors.onSurfaceVariant}
        />
        <Text
          style={{ color: colors.onSurface }}
          className="text-xl font-semibold mt-4 text-center"
        >
          {t('no_addresses_added')}
        </Text>
        <Text
          style={{ color: colors.onSurfaceVariant }}
          className="text-base mt-2 text-center leading-6"
        >
          {t('add_your_first_address_to_make_ordering_easier')}
        </Text>

        {/* Quick actions */}
        <View className="mt-6 w-full">
          {currentLocation && (
            <TouchableOpacity
              onPress={handleAddCurrentLocation}
              disabled={isProcessing}
              className="mb-3 px-6 py-3 rounded-xl flex-row items-center justify-center"
              style={{ 
                backgroundColor: '#007aff',
                opacity: isProcessing ? 0.6 : 1,
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {isProcessing ? 'Adding Current Location...' : 'Add Current Location'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleAddAddress}
            className="px-6 py-3 rounded-xl flex-row items-center justify-center border"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: '#007aff',
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="#007aff" />
            <Text className="font-medium ml-2" style={{ color: '#007aff' }}>
              {t('add_new_address')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <CommonView>
      <View
        className="flex-1 pt-10"
        style={{ backgroundColor: colors.background }}
      >
        {addresses.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="py-4"
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Current location suggestion */}
            <CurrentLocationSuggestion />
            
            {/* Saved addresses */}
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </ScrollView>
        )}

        {/* Add Address FAB */}
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 20,
            right: 0,
            bottom: 0,
            backgroundColor: '#007aff',
          }}
          onPress={handleAddAddress}
          color="white"
        />

        {/* Address Modal */}
        <AddressEditModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={handleSaveAddress}
          initialData={selectedAddress}
          mode={selectedAddress ? 'edit' : 'add'}
        />

        {/* Snackbar */}
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
          style={{ backgroundColor: colors.inverseSurface }}
        >
          <Text style={{ color: colors.inverseOnSurface }}>
            {snackbarMessage}
          </Text>
        </Snackbar>
      </View>
    </CommonView>
  );
};

export default AddressScreen;
 