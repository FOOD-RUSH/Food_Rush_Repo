import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ReusableModal from './ReusableModal';
import { useTranslation } from 'react-i18next';
import { useLocation } from '@/src/location';

export interface AddressData {
  id?: string;
  label: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  place?: string;
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

  // Location system removed - no location data available
  // const { location } = useLocation({
  //   showPermissionAlert: false,
  //   fallbackToYaounde: true,
  // });

  // const currentFullAddress =
  //   location?.city && location.region
  //     ? `${location.city}, ${location.region}`
  //     : 'Current Location';

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label);
      setFullAddress(initialData.fullAddress);
      setIsDefault(initialData.isDefault || false);
    } else {
      setLabel('');
      // Location system removed - no auto-population
      setFullAddress('');
      setIsDefault(false);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (label.trim() && fullAddress.trim()) {
      const addressData: AddressData = {
        id: initialData?.id,
        label: label.trim(),
        fullAddress: fullAddress.trim(),
        latitude: undefined, // Location system removed
        longitude: undefined, // Location system removed
        city: undefined, // Location system removed
        region: undefined, // Location system removed
        place: undefined,
        isDefault,
      };
      onSave(addressData);
      onDismiss();
    }
  };

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
            {t('label')}
          </Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder={t('enter_new_address')}
            placeholderTextColor={colors.onSurfaceVariant}
            className="px-4 py-3 rounded-xl text-base"
            style={{
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
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
              {t('full_address')}
            </Text>
            {/* Use current location button - kept but disabled */}
            <TouchableOpacity
              onPress={() => {
                // Location system removed - no functionality
                console.log('Use current location button pressed but location system is disabled');
              }}
              className="flex-row items-center px-3 py-1 rounded-full"
              style={{ backgroundColor: '#cccccc' }} // Gray color to indicate disabled
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={14} color="white" />
              <Text className="text-white text-xs font-medium ml-1">
                {t('use_current')}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={fullAddress}
            onChangeText={setFullAddress}
            placeholder={t('enter_address')}
            placeholderTextColor={colors.onSurfaceVariant}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
            className="px-4 py-3 rounded-xl text-base"
            style={{
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
              minHeight: 80,
            }}
          />
        </View>

        {/* Default Address Toggle */}
        <TouchableOpacity
          onPress={() => setIsDefault(!isDefault)}
          className="flex-row items-center justify-between mb-6"
        >
          <Text
            style={{ color: colors.onSurface }}
            className="text-base font-medium"
          >
            {t('set_to_default')}
          </Text>
          <View
            className="w-6 h-6 rounded-full border-2 items-center justify-center"
            style={{
              borderColor: isDefault ? '#007aff' : colors.outline,
              backgroundColor: isDefault ? '#007aff' : 'transparent',
            }}
          >
            {isDefault && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onDismiss}
            className="flex-1 py-4 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.surfaceVariant }}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-base font-medium"
            >
              {t('cancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 py-4 rounded-xl items-center justify-center"
            style={{
              backgroundColor:
                label.trim() && fullAddress.trim()
                  ? '#007aff'
                  : colors.surfaceVariant,
            }}
            activeOpacity={0.7}
            disabled={!label.trim() || !fullAddress.trim()}
          >
            <Text
              className="text-base font-medium"
              style={{
                color:
                  label.trim() && fullAddress.trim()
                    ? 'white'
                    : colors.onSurfaceVariant,
              }}
            >
              {mode === 'add'
                ? t('add_address_button')
                : t('update_address_button')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ReusableModal>
  );
};

export default AddressEditModal;
