import React, {
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { View, Text, Platform, StatusBar } from 'react-native';
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

  // Fixed backdrop configuration
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={backdropOpacity}
        enableTouchThrough={false}
        pressBehavior="close"
        style={[
          props.style,
          {
            backgroundColor: '#000000',
          },
        ]}
        // Ensure backdrop doesn't block content
        pointerEvents="auto"
      />
    ),
    [backdropOpacity],
  );

  // Platform-specific handle style
  const handleIndicatorStyle = useMemo(
    () =>
      showHandle
        ? {
            backgroundColor: colors.onSurfaceVariant,
            width: 32,
            height: 4,
            borderRadius: 2,
            marginTop: Platform.OS === 'ios' ? 8 : 12,
            marginBottom: Platform.OS === 'ios' ? 8 : 12,
          }
        : { display: 'none' as const },
    [colors.onSurfaceVariant, showHandle],
  );

  // Platform-specific background style
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopLeftRadius: Platform.OS === 'ios' ? 20 : 28,
      borderTopRightRadius: Platform.OS === 'ios' ? 20 : 28,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 16,
        },
      }),
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

  // Fixed container style - let the library handle z-index
  const containerStyle = useMemo(() => {
    if (detached) {
      return {
        marginHorizontal: 16,
        marginBottom: Platform.OS === 'android' ? 16 : insets.bottom + 16,
        borderRadius: Platform.OS === 'ios' ? 20 : 28,
        overflow: 'hidden' as const,
      };
    }
    return {};
  }, [detached, insets.bottom]);

  // Calculate top inset for Android status bar
  const topInset =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : insets.top;

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
      topInset={topInset}
      bottomInset={Platform.OS === 'android' ? insets.bottom : insets.bottom}
      detached={detached}
      style={containerStyle}
      stackBehavior="replace"
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      animateOnMount={true}
      // Ensure modal content is interactive
      containerStyle={{ pointerEvents: 'auto' }}
      // Additional props to ensure it's on top
      {...Platform.select({
        android: {
          enableOverDrag: false,
        },
        ios: {
          enableOverDrag: true,
        },
      })}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: Platform.OS === 'ios' ? 20 : 24,
          paddingTop: title ? 8 : Platform.OS === 'ios' ? 16 : 20,
          paddingBottom:
            Platform.OS === 'android'
              ? Math.max(16, insets.bottom)
              : 16 + insets.bottom,
          // Ensure content is interactive
          pointerEvents: 'auto',
        }}
      >
        {title && (
          <View
            style={{
              alignItems: 'center',
              marginBottom: 10,
              paddingBottom: 12,
              borderBottomWidth: Platform.OS === 'ios' ? 1 : 0.5,
              borderBottomColor: colors.outline + '15',
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontSize: Platform.OS === 'ios' ? 18 : 20,
                fontWeight: Platform.OS === 'ios' ? '600' : '500',
                letterSpacing: Platform.OS === 'ios' ? 0.15 : 0.25,
              }}
            >
              {title}
            </Text>
          </View>
        )}
        <View style={{ flex: 1, pointerEvents: 'auto' }}>{content}</View>
      </View>
    </BottomSheetModal>
  );
});

GlobalBottomSheet.displayName = 'GlobalBottomSheet';

export default GlobalBottomSheet;
