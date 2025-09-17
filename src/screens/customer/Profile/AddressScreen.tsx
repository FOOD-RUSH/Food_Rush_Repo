import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useLocation } from '@/src/location';
import { Card, useTheme, FAB } from 'react-native-paper';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AddressEditModal, {
  AddressData,
} from '@/src/components/customer/AddressEditModal';
import { useAddressStore } from '@/src/stores/customerStores/addressStore';
import { useUser } from '@/src/stores/customerStores/AuthStore';

const AddressScreen = ({
  navigation,
}: RootStackScreenProps<'AddressScreen'>) => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Store hooks
  const addresses = useAddressStore((state) => state.addresses);
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const deleteAddress = useAddressStore((state) => state.deleteAddress);
  const setDefaultAddress = useAddressStore((state) => state.setDefaultAddress);
  const error = useAddressStore((state) => state.error);
  const clearError = useAddressStore((state) => state.clearError);

  // Auth user
  const user = useUser();

  // Location data
  const { location } = useLocation({
    showPermissionAlert: false,
    fallbackToYaounde: true,
  });

  const currentFullAddress =
    location?.city && location?.region
      ? `${location.city}, ${location.region}`
      : t('current_location') || 'Current Location';

  useEffect(() => {
    if (error) {
      Alert.alert(t('error'), error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [clearError, error, t]);

  const handleEditAddress = (address: AddressData) => {
    setSelectedAddress(address);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setModalMode('add');
    setModalVisible(true);
  };

  const handleSaveAddress = async (addressData: AddressData) => {
    // Navigate back to checkout screen after saving the address
    navigation.goBack();
    try {
      if (modalMode === 'add') {
        await addAddress({
          ...addressData,
          isDefault: addressData.isDefault || false,
        });
      } else if (selectedAddress?.id) {
        await updateAddress(selectedAddress.id, addressData);
      }

      setModalVisible(false);
    } catch (err) {
      console.error('Error saving address:', err);
    }
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
            deleteAddress(addressId);
          },
        },
      ],
    );
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddress(addressId);
  };

  const AddressComponent = ({ address }: { address: AddressData }) => {
    return (
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          marginVertical: 12,
          borderColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
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
                    {address.label}
                  </Text>
                  {address.isDefault && (
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
                  {address.fullAddress}
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

              {!address.isDefault && (
                <TouchableOpacity
                  onPress={() => handleSetDefaultAddress(address.id!)}
                  className="p-2 rounded-full mr-2"
                  style={{ backgroundColor: colors.surfaceVariant }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="star-outline" size={18} color="#007aff" />
                </TouchableOpacity>
              )}

              {!address.isDefault && (
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(address.id!)}
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

  const EmptyAddressComponent = () => {
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

        {location?.latitude && location?.longitude && (
          <TouchableOpacity
            onPress={() => {
              setSelectedAddress(null);
              setModalMode('add');
              setModalVisible(true);
            }}
            className="mt-6 px-6 py-3 rounded-xl flex-row items-center"
            style={{ backgroundColor: '#007aff' }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-2">
              {t('add_current_location') || 'Add Current Location'}
            </Text>
          </TouchableOpacity>
        )}
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
          <EmptyAddressComponent />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="py-20 "
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {addresses.map((address, index) => (
              <AddressComponent key={index} address={address} />
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
          // loading={isLoading}
        />

        {/* Address Edit Modal */}
        <AddressEditModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={handleSaveAddress}
          initialData={selectedAddress}
          mode={modalMode}
        />
      </View>
    </CommonView>
  );
};

export default AddressScreen;
