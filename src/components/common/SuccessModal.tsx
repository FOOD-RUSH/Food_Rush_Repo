import React from 'react';
import { View } from 'react-native';
import { Modal, Card, Text, useTheme, IconButton } from 'react-native-paper';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal = ({ isVisible, onClose, message }: SuccessModalProps) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={isVisible}
      onDismiss={onClose}
      contentContainerStyle={{
        padding: 20,
        margin: 20,
        borderRadius: 12,
        backgroundColor: colors.surface,
      }}
    >
      <Card style={{ backgroundColor: colors.surface, borderRadius: 12 }}>
        <Card.Content style={{ alignItems: 'center' }}>
          <IconButton
            icon="check-circle"
            size={50}
            iconColor={colors.primary}
          />
          <Text style={{ fontSize: 18, marginTop: 10, textAlign: 'center', color: colors.onSurface }}>
            {message}
          </Text>
        </Card.Content>
      </Card>
    </Modal>
  );
};

export default SuccessModal;
