import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ReusableModal from './ReusableModal';

export interface AddressData {
  id?: string;
  label: string;
  fullAddress: string;
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
  const [label, setLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label);
      setFullAddress(initialData.fullAddress);
      setIsDefault(initialData.isDefault || false);
    } else {
      setLabel('');
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
      title={mode === 'add' ? 'Add Address' : 'Edit Address'}
      showCloseButton={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Address Label */}
        <View className="mb-4">
          <Text 
            style={{ color: colors.onSurface }}
            
            className="text-base font-medium mb-2"
          >
            Label
          </Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="e.g., Home, Office, etc."
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
          <Text 
            style={{ color: colors.onSurface }}
            className="text-base font-medium mb-2"
          >
            Full Address
          </Text>
          <TextInput
            value={fullAddress}
            onChangeText={setFullAddress}
            placeholder="Enter complete address"
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
            Set as default address
          </Text>
          <View 
            className="w-6 h-6 rounded-full border-2 items-center justify-center"
            style={{ 
              borderColor: isDefault ? '#007aff' : colors.outline,
              backgroundColor: isDefault ? '#007aff' : 'transparent',
            }}
          >
            {isDefault && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
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
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 py-4 rounded-xl items-center justify-center"
            style={{ 
              backgroundColor: (label.trim() && fullAddress.trim()) ? '#007aff' : colors.surfaceVariant 
            }}
            activeOpacity={0.7}
            disabled={!label.trim() || !fullAddress.trim()}
          >
            <Text 
              className="text-base font-medium"
              style={{ 
                color: (label.trim() && fullAddress.trim()) ? 'white' : colors.onSurfaceVariant 
              }}
            >
              {mode === 'add' ? 'Add Address' : 'Update'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ReusableModal>
  );
};

export default AddressEditModal;