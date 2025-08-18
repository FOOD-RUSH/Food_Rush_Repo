import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

const screen_WIDTH = Dimensions.get('window').width;

interface ReusableModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  containerStyle?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onDismiss,
  title,
  children,
  showCloseButton = true,
  containerStyle,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View
        className={`flex-1 justify-center items-center bg-black/50 px-6  ${containerStyle}`}
      >
        <Card
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            width: '100%',
            maxWidth: screen_WIDTH * 0.8,
            padding: 0,
          }}
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text
              style={{ color: colors.onSurface }}
              className="text-xl font-semibold text-center"
            >
              {title}
            </Text>
            {showCloseButton && (
              <TouchableOpacity
                onPress={onDismiss}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                style={{ backgroundColor: colors.surfaceVariant }}
              >
                <Text
                  style={{ color: colors.onSurfaceVariant }}
                  className="text-lg font-medium"
                >
                  ×
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <View className="px-6 pb-6">{children}</View>
        </Card>
      </View>
    </Modal>
  );
};

export default ReusableModal;
