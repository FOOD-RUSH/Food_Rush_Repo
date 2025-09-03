import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useLocation, useSavedAddresses, useLocationActions, AddressInputModal } from '@/src/location';
import { Card, useTheme, FAB } from 'react-native-paper';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const AddressScreen = ({
  navigation,
}: RootStackScreenProps<'AddressScreen'>) => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  // Store hooks
  const addresses = useSavedAddresses();
  const { setDefaultAddress, deleteSavedAddress } = useLocationActions();

  // Auth user

  // Location data
  const { location } = useLocation({
    autoInit: false,
    fallbackToYaounde: true,
  });

  
  // Error handling removed since we're using the new location system

  const handleEditAddress = (address: any) => {
    setSelectedAddress(address);
    setModalVisible(true);
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setModalVisible(true);
  };

  const handleSaveAddress = () => {
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
            deleteSavedAddress(addressId);
          },
        },
      ],
    );
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddress(addressId);
  };

  const AddressComponent = ({ address }: { address: any }) => {
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

        {location?.coordinates?.latitude && location?.coordinates?.longitude && (
          <TouchableOpacity
            onPress={() => {
              setSelectedAddress(null);
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

        {/* Address Input Modal */}
        <AddressInputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddressSaved={handleSaveAddress}
          initialAddress={selectedAddress}
        />
      </View>
    </CommonView>
  );
};

export default AddressScreen;
