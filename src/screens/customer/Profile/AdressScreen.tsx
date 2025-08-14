import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { Card, useTheme, FAB } from 'react-native-paper';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AddressEditModal, {
  AddressData,
} from '@/src/components/customer/AddressEditModal';

const AddressScreen = ({
  navigation,
}: RootStackScreenProps<'AddressScreen'>) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Mock addresses data - replace with your state management
  const [addresses, setAddresses] = useState<AddressData[]>([
    {
      id: '1',
      label: 'Home',
      fullAddress: 'Biyemassi Acacia',
      isDefault: true,
    },
    {
      id: '2',
      label: 'My Office',
      fullAddress: 'Biyem Assi Acacia 123',
      isDefault: false,
    },
    {
      id: '3',
      label: 'My Apartment',
      fullAddress: 'Biyem Assi Acacia 456',
      isDefault: false,
    },
    {
      id: '4',
      label: "Parent's House",
      fullAddress: 'Biyem Assi Acacia 789',
      isDefault: false,
    },
    {
      id: '5',
      label: 'My Villa',
      fullAddress: 'Biyem Assi Acacia 101',
      isDefault: false,
    },
  ]);

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

  const handleSaveAddress = (addressData: AddressData) => {
    if (modalMode === 'add') {
      const newAddress = {
        ...addressData,
        id: Date.now().toString(), // Simple ID generation
      };
      setAddresses((prev) => [...prev, newAddress]);
    } else {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === addressData.id ? addressData : addr)),
      );
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
            setAddresses((prev) =>
              prev.filter((addr) => addr.id !== addressId),
            );
          },
        },
      ],
    );
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
