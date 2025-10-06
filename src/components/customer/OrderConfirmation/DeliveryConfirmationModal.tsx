import {
  MaterialCommunityIcon,
  IoniconsIcon,
} from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme, Button, Card } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import {
  Typography,
  Heading4,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import Toast from 'react-native-toast-message';
import { apiClient } from '@/src/services/shared/apiClient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DeliveryConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  restaurantName?: string;
  deliveryAddress?: string;
  onConfirmSuccess?: () => void;
}

const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  visible,
  onClose,
  orderId,
  orderNumber,
  restaurantName,
  deliveryAddress,
  onConfirmSuccess,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmDelivery = useCallback(async () => {
    try {
      setIsConfirming(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // API call to confirm delivery received (matches API docs)
      const response = await apiClient.post(
        `/orders/${orderId}/confirm-received`,
      );

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Delivery Confirmed',
          text2: 'Thank you for confirming your delivery!',
          position: 'top',
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Call success callback
        onConfirmSuccess?.();

        // Close modal
        onClose();
      } else {
        throw new Error('Failed to confirm delivery');
      }
    } catch (error: any) {
      console.error('Error confirming delivery:', error);

      Toast.show({
        type: 'error',
        text1: 'Confirmation Failed',
        text2: error.message || 'Failed to confirm delivery. Please try again.',
        position: 'top',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsConfirming(false);
    }
  }, [orderId, onConfirmSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isConfirming) {
      Haptics.selectionAsync();
      onClose();
    }
  }, [isConfirming, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.outline,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Heading4 color={colors.onSurface} weight="bold">
              Confirm Delivery
            </Heading4>
            <Caption color={colors.onSurfaceVariant}>
              Order #{orderNumber || orderId.slice(-6)}
            </Caption>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            disabled={isConfirming}
            style={styles.closeButton}
          >
            <IoniconsIcon name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Success Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  colors.primaryContainer || colors.primary + '20',
              },
            ]}
          >
            <MaterialCommunityIcon
              name="package-variant-closed"
              size={64}
              color={colors.primary}
            />
          </View>

          {/* Main Message */}
          <View style={styles.messageContainer}>
            <Heading4
              color={colors.onSurface}
              weight="bold"
              align="center"
              style={{ marginBottom: 8 }}
            >
              Did you receive your order?
            </Heading4>
            <Body
              color={colors.onSurfaceVariant}
              align="center"
              style={{ lineHeight: 22 }}
            >
              Please confirm that you have received your delivery from{' '}
              {restaurantName || 'the restaurant'}.
            </Body>
          </View>

          {/* Order Details Card */}
          <Card style={[styles.orderCard, { backgroundColor: colors.surface }]}>
            <View style={styles.orderCardContent}>
              <View style={styles.orderDetailRow}>
                <MaterialCommunityIcon
                  name="store"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Label color={colors.onSurface} weight="semibold">
                    Restaurant
                  </Label>
                  <Body color={colors.onSurfaceVariant}>
                    {restaurantName || 'Restaurant Name'}
                  </Body>
                </View>
              </View>

              {deliveryAddress && (
                <View style={styles.orderDetailRow}>
                  <MaterialCommunityIcon
                    name="map-marker"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Label color={colors.onSurface} weight="semibold">
                      Delivery Address
                    </Label>
                    <Body color={colors.onSurfaceVariant} numberOfLines={2}>
                      {deliveryAddress}
                    </Body>
                  </View>
                </View>
              )}

              <View style={styles.orderDetailRow}>
                <MaterialCommunityIcon
                  name="clock-outline"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Label color={colors.onSurface} weight="semibold">
                    Delivery Time
                  </Label>
                  <Body color={colors.onSurfaceVariant}>
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Body>
                </View>
              </View>
            </View>
          </Card>

          {/* Information Note */}
          <Card
            style={[
              styles.infoCard,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <View style={styles.infoCardContent}>
              <MaterialCommunityIcon
                name="information"
                size={20}
                color={colors.primary}
              />
              <Body
                color={colors.onSurfaceVariant}
                style={{ flex: 1, marginLeft: 12, lineHeight: 20 }}
              >
                Confirming delivery helps us improve our service and ensures
                accurate order tracking.
              </Body>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View
          style={[
            styles.buttonContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.outline },
          ]}
        >
          <Button
            mode="outlined"
            onPress={handleClose}
            disabled={isConfirming}
            style={[styles.button, { borderColor: colors.outline }]}
            labelStyle={{ color: colors.onSurface }}
          >
            Not Yet
          </Button>

          <Button
            mode="contained"
            onPress={handleConfirmDelivery}
            loading={isConfirming}
            disabled={isConfirming}
            buttonColor={colors.primary}
            style={styles.button}
            labelStyle={{ color: 'white', fontWeight: '600' }}
          >
            {isConfirming ? 'Confirming...' : 'Yes, I Received It'}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  orderCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 16,
  },
  orderCardContent: {
    padding: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoCard: {
    width: '100%',
    borderRadius: 12,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    borderRadius: 12,
  },
});

export default DeliveryConfirmationModal;
