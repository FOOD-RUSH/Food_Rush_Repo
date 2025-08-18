import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CheckoutContentProps {
  onDismiss: () => void;
  onConfirm: () => void;
  totalAmount: string;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ onDismiss, onConfirm, totalAmount }) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Content */}
      <View style={{ marginBottom: 32 }}>
       
        
        <View style={{
          backgroundColor: colors.primaryContainer,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 20,
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text
            style={{ 
              color: colors.primary,
              fontSize: 24,
              fontWeight: '600',
              letterSpacing: 0.15,
            }}
          >
            {totalAmount} FCFA
          </Text>
        </View>
        
        <Text
          style={{ 
            color: colors.onSurfaceVariant,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            letterSpacing: 0.25,
          }}
        >
          This action cannot be undone. Please confirm to proceed with your order.
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
            onConfirm();
            onDismiss();
          }}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: colors.primary,
            minWidth: 100,
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
              color: colors.onPrimary,
              fontSize: 14,
              fontWeight: '500',
              letterSpacing: 0.1,
            }}
          >
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutContent;
