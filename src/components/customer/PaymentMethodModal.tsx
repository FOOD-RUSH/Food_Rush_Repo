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
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { IoniconsIcon } from '@/src/components/common/icons';
import { images } from '@/assets/images';
import {
  PaymentProvider,
  PaymentMethodSelection,
} from '@/src/types/transaction';
import { useResponsive } from '@/src/hooks/useResponsive';
import PaymentService from '@/src/services/customer/payment.service';

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
  const { isTablet, wp, getResponsiveText } = useResponsive();

  const [selectedProvider, setSelectedProvider] = useState<'mtn' | 'orange'>(
    currentSelection?.provider || 'mtn',
  );
  const [phoneNumber, setPhoneNumber] = useState(
    currentSelection?.phoneNumber || '',
  );
  const [isValidating, setIsValidating] = useState(false);

  // Payment providers
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

  // Modal dimensions
  const modalDimensions = isTablet
    ? { width: Math.min(wp(80), 500), padding: 24, borderRadius: 20 }
    : { width: wp(90), padding: 20, borderRadius: 16 };

  // Format phone number as user types (XXX XX XX XX)
  const formatPhoneInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 9);

    if (limited.length <= 3) return limited;
    if (limited.length <= 5)
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    if (limited.length <= 7)
      return `${limited.slice(0, 3)} ${limited.slice(3, 5)} ${limited.slice(5)}`;
    return `${limited.slice(0, 3)} ${limited.slice(3, 5)} ${limited.slice(5, 7)} ${limited.slice(7)}`;
  };

  // Validate and confirm
  const handleConfirm = useCallback(() => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (!cleanNumber || cleanNumber.length !== 9) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('invalid_phone_format'),
        position: 'bottom',
      });
      return;
    }

    if (!PaymentService.validatePhoneNumber(cleanNumber, selectedProvider)) {
      const errorMessage =
        selectedProvider === 'mtn'
          ? t('invalid_mtn_number')
          : t('invalid_orange_number');
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: errorMessage,
        position: 'bottom',
      });
      return;
    }

    setIsValidating(true);

    setTimeout(() => {
      onConfirm({
        method: 'mobile_money',
        provider: selectedProvider,
        phoneNumber: cleanNumber,
      });
      setIsValidating(false);
    }, 300);
  }, [phoneNumber, selectedProvider, onConfirm, t]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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
              maxHeight: '85%',
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
            <ScrollView showsVerticalScrollIndicator={false}>
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
                  <IoniconsIcon
                    name="close"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
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

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: phoneNumber ? colors.primary : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                    backgroundColor: colors.surface,
                  }}
                >
                  {/* Country Code Prefix */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: 12,
                      borderRightWidth: 1,
                      borderRightColor: colors.outline,
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: getResponsiveText(18),
                        fontWeight: '600',
                        color: colors.onSurface,
                      }}
                    >
                      🇨🇲 +237
                    </Text>
                  </View>

                  {/* Phone Input */}
                  <TextInput
                    value={phoneNumber}
                    onChangeText={(text) =>
                      setPhoneNumber(formatPhoneInput(text))
                    }
                    placeholder="6XX XX XX XX"
                    placeholderTextColor={colors.onSurfaceVariant + '80'}
                    keyboardType="phone-pad"
                    maxLength={12} // 9 digits + 3 spaces
                    style={{
                      flex: 1,
                      fontSize: getResponsiveText(18),
                      fontWeight: '500',
                      color: colors.onSurface,
                      paddingVertical: 12,
                      letterSpacing: 1,
                    }}
                  />

                  {/* Clear Button */}
                  {phoneNumber.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setPhoneNumber('')}
                      style={{
                        padding: 4,
                        marginLeft: 8,
                      }}
                    >
                      <IoniconsIcon
                        name="close-circle"
                        size={20}
                        color={colors.onSurfaceVariant}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Helper Text */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                    paddingHorizontal: 4,
                  }}
                >
                  <IoniconsIcon
                    name="information-circle"
                    size={16}
                    color={colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: getResponsiveText(12),
                      color: colors.onSurfaceVariant,
                      flex: 1,
                    }}
                  >
                    {selectedProvider === 'mtn'
                      ? t('mtn_phone_format')
                      : t('orange_phone_format')}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  onPress={onDismiss}
                  disabled={isValidating}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: colors.outline,
                    alignItems: 'center',
                    backgroundColor: colors.surface,
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
                  disabled={isValidating || !phoneNumber}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor:
                      isValidating || !phoneNumber
                        ? colors.surfaceVariant
                        : colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isValidating ? (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={{
                          fontSize: getResponsiveText(16),
                          fontWeight: '600',
                          color: colors.onPrimary,
                        }}
                      >
                        {t('validating')}...
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: getResponsiveText(16),
                        fontWeight: '600',
                        color: !phoneNumber
                          ? colors.onSurfaceVariant
                          : colors.onPrimary,
                      }}
                    >
                      {t('confirm')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PaymentMethodModal;
