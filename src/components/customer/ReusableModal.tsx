import { IoniconsIcon } from '@/src/components/common/icons';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ReusableModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  dismissOnBackdropPress?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  animationType?: 'slide' | 'fade' | 'none';
  containerStyle?: object;
  contentStyle?: object;
  scrollable?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onDismiss,
  title,
  children,
  showCloseButton = true,
  dismissOnBackdropPress = true,
  size = 'medium',
  animationType = 'slide',
  containerStyle,
  contentStyle,
  scrollable = false,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate modal dimensions based on size
  const getModalDimensions = () => {
    switch (size) {
      case 'small':
        return { width: screenWidth * 0.8, maxHeight: screenHeight * 0.4 };
      case 'medium':
        return { width: screenWidth * 0.9, maxHeight: screenHeight * 0.6 };
      case 'large':
        return { width: screenWidth * 0.95, maxHeight: screenHeight * 0.8 };
      case 'fullscreen':
        return {
          width: screenWidth,
          height: screenHeight,
          marginTop:
            Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
        };
      default:
        return { width: screenWidth * 0.9, maxHeight: screenHeight * 0.6 };
    }
  };

  const modalDimensions = getModalDimensions();
  const isFullscreen = size === 'fullscreen';

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onDismiss();
    }
  };

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? {
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled' as const,
        contentContainerStyle: { flexGrow: 1 },
      }
    : {};

  return (
    <Modal
      visible={visible}
      transparent={!isFullscreen}
      animationType={animationType}
      onRequestClose={onDismiss}
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Full screen overlay to prevent interaction with underlying content */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View
            style={{
              flex: 1,
              backgroundColor: isFullscreen
                ? colors.background
                : 'rgba(0, 0, 0, 0.5)',
              justifyContent: isFullscreen ? 'flex-start' : 'center',
              alignItems: 'center',
              paddingHorizontal: isFullscreen ? 0 : 16,
              paddingTop: isFullscreen ? 0 : insets.top,
              paddingBottom: isFullscreen ? 0 : insets.bottom,
              // Ensure modal is above everything including tab navigator
              zIndex: 9999,
              elevation: 9999,
            }}
          >
            {/* Prevent touches from passing through to content behind */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <Card
                style={[
                  {
                    backgroundColor: colors.surface,
                    borderRadius: isFullscreen ? 0 : 20,
                    padding: 0,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    ...modalDimensions,
                  },
                  containerStyle,
                ]}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingTop: isFullscreen ? insets.top + 16 : 20,
                      paddingBottom: 16,
                      borderBottomWidth: title ? 1 : 0,
                      borderBottomColor: colors.outline,
                    }}
                  >
                    {title && (
                      <Text
                        style={{
                          color: colors.onSurface,
                          fontSize: 20,
                          fontWeight: '600',
                          flex: 1,
                          textAlign: showCloseButton ? 'left' : 'center',
                        }}
                      >
                        {title}
                      </Text>
                    )}

                    {showCloseButton && (
                      <TouchableOpacity
                        onPress={onDismiss}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: colors.surfaceVariant,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: title ? 16 : 0,
                        }}
                        activeOpacity={0.7}
                      >
                        <IoniconsIcon                           name="close"
                          size={20}
                          color={colors.onSurfaceVariant}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Content */}
                <ContentWrapper
                  style={[
                    {
                      flex: isFullscreen || scrollable ? 1 : undefined,
                      paddingHorizontal: 20,
                      paddingBottom: isFullscreen ? insets.bottom + 20 : 20,
                      paddingTop: title || showCloseButton ? 0 : 20,
                    },
                    contentStyle,
                  ]}
                  {...contentWrapperProps}
                >
                  {children}
                </ContentWrapper>
              </Card>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReusableModal;
