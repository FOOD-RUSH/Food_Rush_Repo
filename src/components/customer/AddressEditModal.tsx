import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import ReusableModal from './ReusableModal';
import { useTranslation } from 'react-i18next';
import { useAddressManager } from '@/src/hooks/customer/useAddressManager';

export interface AddressData {
  id?: string;
  label: string;
  fullAddress: string;
  street?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault?: boolean;
}

interface AddressEditModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (address: AddressData) => void;
  initialData?: AddressData | null;
  mode: 'add' | 'edit';
}

const AddressEditModal: React.FC<AddressEditModalProps> = ({
  visible,
  onDismiss,
  onSave,
  initialData,
  mode,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [label, setLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState({
    latitude: 3.8667,
    longitude: 11.5167,
  });

  // Use address manager for location integration
  const {
    getCurrentLocationForAddress,
    requestLocationPermission,
    hasLocationPermission,
    isProcessing,
  } = useAddressManager();

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label || '');
      setFullAddress(initialData.fullAddress || '');
      setIsDefault(initialData.isDefault || false);
      if (initialData.coordinates) {
        setCurrentCoordinates(initialData.coordinates);
      } else {
        setCurrentCoordinates({
          latitude: 3.8667,
          longitude: 11.5167,
        });
      }
    } else {
      setLabel('');
      setFullAddress('');
      setIsDefault(false);
      setCurrentCoordinates({
        latitude: 3.8667,
        longitude: 11.5167,
      });
    }
  }, [initialData, visible]);

  const handleUseCurrentLocation = async () => {
    try {
      // Check if we have permission, request if needed
      if (!hasLocationPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Location Permission Required',
            'To use your current location, please enable location access in your device settings.',
            [{ text: 'OK' }],
          );
          return;
        }
      }

      // Get current location
      const result = await getCurrentLocationForAddress();

      if (result.success && result.address && result.coordinates) {
        setFullAddress(result.address);
        setCurrentCoordinates(result.coordinates);
      } else {
        Alert.alert(
          'Location Error',
          result.error ||
            'Unable to get your current location. Please enter your address manually.',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Error',
        'Failed to get your current location. Please try again or enter your address manually.',
        [{ text: 'OK' }],
      );
    }
  };

  const handleSave = () => {
    if (!label.trim() || !fullAddress.trim()) {
      return; // Don't save if required fields are empty
    }

    const addressData: AddressData = {
      id: initialData?.id,
      label: label.trim(),
      fullAddress: fullAddress.trim(),
      street: fullAddress.trim(),
      coordinates: currentCoordinates,
      isDefault,
    };

    onSave(addressData);
  };

  const isFormValid = label.trim() && fullAddress.trim();

  return (
    <ReusableModal
      visible={visible}
      onDismiss={onDismiss}
      title={mode === 'add' ? t('add_address') : t('edit_address')}
      showCloseButton={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Address Label */}
        <View className="mb-4">
          <Text
            style={{ color: colors.onSurface }}
            className="text-base font-medium mb-2"
          >
            {t('label')} *
          </Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Home, Work, etc."
            placeholderTextColor={colors.onSurfaceVariant}
            className="px-4 py-3 rounded-xl text-base"
            style={{
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
              borderWidth: 1,
              borderColor: colors.outline,
            }}
          />
        </View>

        {/* Full Address */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              style={{ color: colors.onSurface }}
              className="text-base font-medium"
            >
              {t('full_address')} *
            </Text>
            {/* Use current location button */}
            <TouchableOpacity
              onPress={handleUseCurrentLocation}
              disabled={isProcessing}
              className="flex-row items-center px-3 py-1 rounded-full"
              style={{
                backgroundColor: '#007aff',
                opacity: isProcessing ? 0.6 : 1,
              }}
              activeOpacity={0.7}
            >
              <IoniconsIcon                 name={isProcessing ? 'hourglass-outline' : 'location'}
                size={14}
                color="white"
              />
              <Text className="text-white text-xs font-medium ml-1">
                {isProcessing ? 'Getting...' : 'Use Current'}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={fullAddress}
            onChangeText={setFullAddress}
            placeholder="Enter your full address"
            placeholderTextColor={colors.onSurfaceVariant}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
            className="px-4 py-3 rounded-xl text-base"
            style={{
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
              minHeight: 80,
              borderWidth: 1,
              borderColor: colors.outline,
            }}
          />
        </View>

        {/* Default Address Toggle */}
        <TouchableOpacity
          onPress={() => setIsDefault(!isDefault)}
          className="flex-row items-center justify-between mb-6 p-3 rounded-xl"
          style={{ backgroundColor: colors.surfaceVariant }}
          activeOpacity={0.7}
        >
          <Text
            style={{ color: colors.onSurface }}
            className="text-base font-medium"
          >
            Set as default address
          </Text>
          <View
            className="w-6 h-6 rounded-full border-2 items-center justify-center"
            style={{
              borderColor: isDefault ? '#007aff' : colors.outline,
              backgroundColor: isDefault ? '#007aff' : 'transparent',
            }}
          >
            {isDefault && <IoniconsIcon name="checkmark" size={16} color="white" />}
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onDismiss}
            className="flex-1 py-4 rounded-xl items-center justify-center border"
            style={{
              backgroundColor: 'transparent',
              borderColor: colors.outline,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: colors.onSurface }}
              className="text-base font-medium"
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 py-4 rounded-xl items-center justify-center"
            style={{
              backgroundColor: isFormValid ? '#007aff' : colors.surfaceVariant,
              opacity: isFormValid ? 1 : 0.5,
            }}
            activeOpacity={0.7}
            disabled={!isFormValid}
          >
            <Text
              className="text-base font-medium"
              style={{
                color: isFormValid ? 'white' : colors.onSurfaceVariant,
              }}
            >
              {mode === 'add' ? 'Add Address' : 'Update Address'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ReusableModal>
  );
};

export default AddressEditModal;
