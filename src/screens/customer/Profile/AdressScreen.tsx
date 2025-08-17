import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { Card, useTheme, FAB } from 'react-native-paper';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AddressEditModal, {
  AddressData,
} from '@/src/components/customer/AddressEditModal';
import { useAddressStore } from '@/src/stores/customerStores/addressStore';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';

const AddressScreen = ({
  navigation,
}: RootStackScreenProps<'AddressScreen'>) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // Store hooks
  const addresses = useAddressStore((state) => state.addresses);
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const deleteAddress = useAddressStore((state) => state.deleteAddress);
  const setDefaultAddress = useAddressStore((state) => state.setDefaultAddress);
  const isLoading = useAddressStore((state) => state.isLoading);
  const error = useAddressStore((state) => state.error);
  const clearError = useAddressStore((state) => state.clearError);
  
  // Auth user
  const user = useAuthUser();

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    }
  }, [fetchAddresses, user?.id]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [clearError, error]);

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
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
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
                        Default
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

  return (
    <CommonView>
      <View
        className="flex-1 pt-10"
        style={{ backgroundColor: colors.background }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="py-4 "
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {addresses.map((address) => (
            <AddressComponent key={address.id} address={address} />
          ))}
        </ScrollView>

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
          loading={isLoading}
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
