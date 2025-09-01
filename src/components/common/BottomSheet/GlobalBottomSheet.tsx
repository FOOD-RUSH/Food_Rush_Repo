import React, {
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { View, Text } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';
import { BottomSheetConfig } from '@/src/types/bottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GlobalBottomSheetProps {
  content: React.ReactNode;
  config: BottomSheetConfig;
  onDismiss: () => void;
}

export interface GlobalBottomSheetRef {
  present: () => void;
  dismiss: () => void;
  close: () => void;
  expand: () => void;
}

const GlobalBottomSheet = forwardRef<
  GlobalBottomSheetRef,
  GlobalBottomSheetProps
>(({ content, config, onDismiss }, ref) => {
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const {
    snapPoints = ['50%'],
    enablePanDownToClose = true,
    detached = false,
    title,
    showHandle = true,
    backdropOpacity = 0.4,
  } = config;

  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  useImperativeHandle(
    ref,
    () => ({
      present: () => {
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
      close: () => {
        bottomSheetModalRef.current?.close();
      },
      expand: () => {
        bottomSheetModalRef.current?.present();
      },
    }),
    [],
  );

  // WhatsApp-style backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={backdropOpacity}
        enableTouchThrough={false}
        pressBehavior="close"
        style={[props.style, { backgroundColor: '#000000' }]}
      />
    ),
    [backdropOpacity],
  );

  // WhatsApp-style handle
  const handleIndicatorStyle = useMemo(
    () =>
      showHandle
        ? {
            backgroundColor: colors.onSurfaceVariant,
            width: 32,
            height: 4,
            borderRadius: 2,
            marginTop: 8,
            marginBottom: 8,
          }
        : { display: 'none' as const },
    [colors.onSurfaceVariant, showHandle],
  );

  // Clean background style
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8,
    }),
    [colors.surface],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  const containerStyle = useMemo(() => {
    if (detached) {
      return {
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden' as const,
      };
    }
    return undefined;
  }, [detached]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={enablePanDownToClose}
      onChange={handleSheetChanges}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={handleIndicatorStyle}
      backgroundStyle={backgroundStyle}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableDynamicSizing={false}
      bottomInset={insets.bottom}
      detached={detached}
      style={containerStyle}
      stackBehavior="replace"
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: title ? 8 : 16,
          paddingBottom: 16 + insets.bottom,
        }}
      >
        {title && (
          <View
            style={{
              alignItems: 'center',
              marginBottom: 10,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.outline + '15',
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 18,
                fontWeight: '600',
                letterSpacing: 0.15,
              }}
            >
              {title}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>{content}</View>
      </View>
    </BottomSheetModal>
  );
});

GlobalBottomSheet.displayName = 'GlobalBottomSheet';

export default GlobalBottomSheet;
