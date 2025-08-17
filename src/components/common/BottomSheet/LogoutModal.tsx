import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

interface LogoutContentProps {
  onDismiss: () => void;
  onConfirmLogout: () => void;
}

const LogoutContent: React.FC<LogoutContentProps> = ({ onDismiss, onConfirmLogout }) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Content */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{ 
            color: colors.onSurface,
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
            letterSpacing: 0.15,
          }}
        >
          Are you sure you want to sign out of your account?
        </Text>
      </View>

      {/* Google-style Action Buttons */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        gap: 8,
        paddingTop: 16,
      }}>
        <TouchableOpacity
          onPress={onDismiss}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: 'transparent',
            minWidth: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{ 
              color: colors.primary,
              fontSize: 14,
              fontWeight: '500',
              letterSpacing: 0.1,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onConfirmLogout();
            onDismiss();
          }}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: colors.error || '#d32f2f',
            minWidth: 80,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          }}
          activeOpacity={0.8}
        >
          <Text 
            style={{ 
              color: colors.onError || '#ffffff',
              fontSize: 14,
              fontWeight: '500',
              letterSpacing: 0.1,
            }}
          >
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoutContent;
