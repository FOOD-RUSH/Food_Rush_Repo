import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { IoniconsIcon } from '@/src/components/common/icons';
import { images } from '@/assets/images';
import { PaymentProvider, PaymentMethodSelection } from '@/src/types/transaction';
import { useResponsive } from '@/src/hooks/useResponsive';
import EnhancedPaymentService from '@/src/services/customer/enhancedPayment.service';

interface PaymentMethodModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (selection: PaymentMethodSelection) => void;
  currentSelection?: PaymentMethodSelection;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  currentSelection,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const {  isTablet, wp, getResponsiveText } = useResponsive();
  
  const [selectedProvider, setSelectedProvider] = useState<'mtn' | 'orange'>(
    currentSelection?.provider || 'mtn'
  );
  const [phoneNumber, setPhoneNumber] = useState(currentSelection?.phoneNumber || '');

  // Payment providers configuration
  const paymentProviders: PaymentProvider[] = [
    {
      id: 'mtn',
      name: 'mtn',
      displayName: 'MTN Mobile Money',
      icon: images.Mobile_Money,
      color: '#FFCC00',
      description: t('mtn_mobile_money_description'),
    },
    {
      id: 'orange',
      name: 'orange',
      displayName: 'Orange Money',
      icon: images.Orange_Money,
      color: '#FF6600',
      description: t('orange_money_description'),
    },
  ];

  // Get responsive dimensions
  const getModalDimensions = () => {
    if (isTablet) {
      return {
        width: Math.min(wp(80), 500),
        padding: 24,
        borderRadius: 20,
      };
    } else {
      return {
        width: wp(90),
        padding: 20,
        borderRadius: 16,
      };
    }
  };

  const modalDimensions = getModalDimensions();

  // Validate phone number using enhanced service
  const validatePhoneNumber = (number: string, provider: 'mtn' | 'orange'): boolean => {
    return EnhancedPaymentService.validatePhoneNumber(number, provider);
  };

  // Handle confirm
  const handleConfirm = useCallback(() => {
    if (!phoneNumber.trim()) {
      Alert.alert(t('error'), t('phone_number_required'));
      return;
    }

    // Remove all non-digit characters for validation
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if it's 9 digits
    if (cleanNumber.length !== 9) {
      Alert.alert(t('error'), t('invalid_phone_format'));
      return;
    }

    if (!validatePhoneNumber(phoneNumber, selectedProvider)) {
      const errorMessage = selectedProvider === 'mtn' 
        ? t('invalid_mtn_number')
        : t('invalid_orange_number');
      Alert.alert(t('error'), errorMessage);
      return;
    }

    // Remove all spaces and non-digit characters before sending to payment service
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    onConfirm({
      method: 'mobile_money',
      provider: selectedProvider,
      phoneNumber: cleanPhoneNumber,
    });
  }, [phoneNumber, selectedProvider, onConfirm, t]);

  // Format phone number as user types
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 3) {
      formatted = cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    
    return formatted;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: modalDimensions.borderRadius,
            padding: modalDimensions.padding,
            width: modalDimensions.width,
            maxHeight: '80%',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
              },
              android: {
                elevation: 10,
              },
            }),
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: getResponsiveText(20),
                fontWeight: 'bold',
                color: colors.onSurface,
              }}
            >
              {t('select_payment_method')}
            </Text>
            <TouchableOpacity
              onPress={onDismiss}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <IoniconsIcon name="close" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Payment Providers */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: getResponsiveText(16),
                fontWeight: '600',
                color: colors.onSurface,
                marginBottom: 12,
              }}
            >
              {t('mobile_money_operators')}
            </Text>
            
            {paymentProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                onPress={() => setSelectedProvider(provider.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    selectedProvider === provider.id
                      ? colors.primary
                      : colors.outline + '30',
                  backgroundColor:
                    selectedProvider === provider.id
                      ? colors.primaryContainer + '20'
                      : colors.surface,
                  marginBottom: 12,
                }}
              >
                <Image
                  source={provider.icon}
                  style={{ width: 32, height: 32, marginRight: 12 }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: getResponsiveText(16),
                      fontWeight: '600',
                      color: colors.onSurface,
                    }}
                  >
                    {provider.displayName}
                  </Text>
                  <Text
                    style={{
                      fontSize: getResponsiveText(12),
                      color: colors.onSurfaceVariant,
                      marginTop: 2,
                    }}
                  >
                    {provider.description}
                  </Text>
                </View>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor:
                      selectedProvider === provider.id
                        ? colors.primary
                        : colors.outline,
                    backgroundColor:
                      selectedProvider === provider.id
                        ? colors.primary
                        : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {selectedProvider === provider.id && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.onPrimary,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Phone Number Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: getResponsiveText(16),
                fontWeight: '600',
                color: colors.onSurface,
                marginBottom: 8,
              }}
            >
              {t('phone_number')}
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              placeholder={t('enter_phone_number')}
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="phone-pad"
              style={{
                borderWidth: 1,
                borderColor: colors.outline,
                borderRadius: 8,
                padding: 12,
                fontSize: getResponsiveText(16),
                color: colors.onSurface,
                backgroundColor: colors.surface,
              }}
            />
            <Text
              style={{
                fontSize: getResponsiveText(12),
                color: colors.onSurfaceVariant,
                marginTop: 4,
              }}
            >
              {selectedProvider === 'mtn'
                ? t('mtn_phone_format')
                : t('orange_phone_format')}
            </Text>
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={onDismiss}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.outline,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: getResponsiveText(16),
                  fontWeight: '600',
                  color: colors.onSurface,
                }}
              >
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 8,
                backgroundColor: colors.primary,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: getResponsiveText(16),
                  fontWeight: '600',
                  color: colors.onPrimary,
                }}
              >
                {t('confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentMethodModal;