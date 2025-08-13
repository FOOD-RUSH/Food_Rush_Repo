import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import ReusableModal from './ReusableModal';

interface LogoutModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirmLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onDismiss,
  onConfirmLogout,
}) => {
  const { colors } = useTheme();

  return (
    <ReusableModal
      visible={visible}
      onDismiss={onDismiss}
      title="Logout"
      showCloseButton={false}
    >
      <View className="items-center ">
        {/* Logout message */}
        <Text 
          style={{ color: colors.onSurface }}
          className="text-center text-base mb-8 leading-6"
        >
          Are you sure you want to log out?
        </Text>
        
        {/* Action buttons */}
        <View className="flex-row w-full gap-3">
          {/* Cancel button */}
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
          
          {/* Logout button */}
          <TouchableOpacity
            onPress={() => {
              onConfirmLogout();
              onDismiss();
            }}
            className="flex-1 py-4 rounded-xl items-center justify-center bg-red-500"
            activeOpacity={0.7}
          >
            <Text className="text-white text-base font-medium">
              Yes, Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
};

export default LogoutModal;