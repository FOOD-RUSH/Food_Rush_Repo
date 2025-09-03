// src/location/AddressInputModal.tsx - Simple MVP modal
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ManualAddressInput } from './types';

interface AddressInputModalProps {
  visible: boolean;
  onClose: () => void;
  onAddressSaved: (addressInput: ManualAddressInput) => void;
}

const AddressInputModal: React.FC<AddressInputModalProps> = ({
  visible,
  onClose,
  onAddressSaved,
}) => {
  const { colors } = useTheme();
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!street.trim()) return;

    setIsLoading(true);
    try {
      const addressInput: ManualAddressInput = {
        street: street.trim(),
        landmark: landmark.trim() || undefined,
      };

      await onAddressSaved(addressInput);
      setStreet('');
      setLandmark('');
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStreet('');
    setLandmark('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            Entrer votre adresse
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
              Adresse *
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: colors.surfaceVariant,
                color: colors.onSurface,
                borderColor: colors.outline
              }]}
              placeholder="Ex: Rue 1.234, Bastos"
              placeholderTextColor={colors.onSurfaceVariant}
              value={street}
              onChangeText={setStreet}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
              Point de repère (optionnel)
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: colors.surfaceVariant,
                color: colors.onSurface,
                borderColor: colors.outline
              }]}
              placeholder="Ex: Près du marché K"
              placeholderTextColor={colors.onSurfaceVariant}
              value={landmark}
              onChangeText={setLandmark}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.outline }]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.onSurface }]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
                (!street.trim() || isLoading) && styles.disabledButton
              ]}
              onPress={handleSave}
              disabled={!street.trim() || isLoading}
            >
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default AddressInputModal;
