import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Platform, Modal } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Typography, Label, Caption } from './Typography';
import { formatCameroonTime } from '@/src/utils/timeUtils';

interface DateTimePickerProps {
  value: Date | null;
  onDateTimeChange: (dateTime: Date) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
}

const CustomDateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onDateTimeChange,
  placeholder,
  label,
  error = false,
  disabled = false,
  mode = 'datetime',
  minimumDate,
  maximumDate,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [currentMode, setCurrentMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [tempValue, setTempValue] = useState<Date | null>(null);

  // iOS-optimized onChange handler
  const onChange = useCallback(
    (event: any, selectedDate?: Date) => {
      const currentDate = selectedDate || value || new Date();

      // Handle different event types
      if (event.type === 'dismissed') {
        // User cancelled the picker
        setShow(false);
        setTempValue(null);
        setTempDate(null);
        setCurrentMode('date');
        return;
      }

      if (Platform.OS === 'android') {
        // Android: immediately apply changes and close
        if (mode === 'datetime') {
          if (currentMode === 'date') {
            setTempDate(currentDate);
            setCurrentMode('time');
            setTimeout(() => setShow(true), 100);
          } else {
            const finalDate = tempDate ? new Date(tempDate) : new Date();
            finalDate.setHours(currentDate.getHours());
            finalDate.setMinutes(currentDate.getMinutes());
            finalDate.setSeconds(0);
            finalDate.setMilliseconds(0);
            onDateTimeChange(finalDate);
            setShow(false);
            setTempDate(null);
            setCurrentMode('date');
          }
        } else {
          onDateTimeChange(currentDate);
          setShow(false);
        }
      } else {
        // iOS: store temporary value for modal confirmation
        if (mode === 'datetime') {
          if (currentMode === 'date') {
            // Store the selected date and prepare for time selection
            setTempDate(currentDate);
            // Don't switch mode here - let the Next button handle it
          } else {
            // Time selection - combine with previously selected date
            const finalDate = tempDate ? new Date(tempDate) : new Date();
            finalDate.setHours(currentDate.getHours());
            finalDate.setMinutes(currentDate.getMinutes());
            finalDate.setSeconds(0);
            finalDate.setMilliseconds(0);
            setTempValue(finalDate);
          }
        } else {
          setTempValue(currentDate);
        }
      }
    },
    [value, mode, currentMode, tempDate, onDateTimeChange],
  );

  // iOS modal handlers
  const handleConfirm = useCallback(() => {
    if (mode === 'datetime' && currentMode === 'date') {
      // Check if user has selected a date
      if (!tempDate) {
        // No date selected yet, use current picker value
        const currentPickerDate = value || new Date();
        setTempDate(currentPickerDate);
      }
      // Switch to time picker for datetime mode
      setCurrentMode('time');
      return;
    }

    // Final confirmation - apply the selected date/time
    if (mode === 'datetime' && currentMode === 'time') {
      // Combine date and time
      if (tempValue) {
        onDateTimeChange(tempValue);
      } else if (tempDate) {
        // Fallback: use tempDate with current time if tempValue is not set
        const fallbackDate = new Date(tempDate);
        const currentTime = value || new Date();
        fallbackDate.setHours(currentTime.getHours());
        fallbackDate.setMinutes(currentTime.getMinutes());
        fallbackDate.setSeconds(0);
        fallbackDate.setMilliseconds(0);
        onDateTimeChange(fallbackDate);
      }
    } else if (tempValue) {
      // Single mode (date or time only)
      onDateTimeChange(tempValue);
    }

    // Reset state
    setShow(false);
    setTempValue(null);
    setTempDate(null);
    setCurrentMode('date');
  }, [mode, currentMode, tempDate, tempValue, onDateTimeChange, value]);

  const handleCancel = useCallback(() => {
    setShow(false);
    setTempValue(null);
    setTempDate(null);
    setCurrentMode('date');
  }, []);

  const showPicker = useCallback(() => {
    if (!disabled) {
      setCurrentMode(mode === 'datetime' ? 'date' : (mode as 'date' | 'time'));
      setTempValue(value); // Initialize with current value
      setTempDate(null); // Reset temp date
      setShow(true);
    }
  }, [disabled, mode, value]);

  const formatDisplayValue = () => {
    if (!value) {
      return placeholder || t('select_date_time') || 'Select date and time';
    }

    switch (mode) {
      case 'date':
        return formatCameroonTime(value, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      case 'time':
        return formatCameroonTime(value, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      case 'datetime':
      default:
        return formatCameroonTime(value, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'date':
        return 'calendar';
      case 'time':
        return 'clock-outline';
      case 'datetime':
      default:
        return 'calendar-clock';
    }
  };

  const displayValue = formatDisplayValue();

  return (
    <View>
      {label && (
        <Label
          weight="semibold"
          color={colors.onSurface}
          style={{ marginBottom: 12, fontFamily: 'Urbanist-SemiBold' }}
        >
          {label}
        </Label>
      )}

      <TouchableOpacity
        onPress={showPicker}
        disabled={disabled}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 12,
          borderWidth: error ? 2 : 1,
          borderColor: error ? colors.error : colors.outline,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          opacity: disabled ? 0.6 : 1,
          flex: 1,
        }}
      >
        <Typography
          variant="body"
          color={value ? colors.onSurface : colors.onSurfaceVariant}
          style={{
            fontFamily: 'Urbanist-Regular',
            flex: 1,
            flexShrink: 1,
            overflow: 'hidden',
            paddingRight: 8,
          }}
          numberOfLines={1}
        >
          {displayValue}
        </Typography>
        <MaterialCommunityIcon
          name={getIcon()}
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      {/* iOS Modal Picker */}
      {Platform.OS === 'ios' && show && (
        <Modal
          visible={show}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: 34,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.outline,
                }}
              >
                <Button
                  mode="text"
                  onPress={handleCancel}
                  textColor={colors.primary}
                >
                  {t('cancel') || 'Cancel'}
                </Button>

                <Label
                  color={colors.onSurface}
                  weight="semibold"
                  style={{ fontSize: 17 }}
                >
                  {mode === 'datetime' && currentMode === 'date'
                    ? t('select_date') || 'Select Date'
                    : mode === 'datetime' && currentMode === 'time'
                      ? t('select_time') || 'Select Time'
                      : mode === 'date'
                        ? t('select_date') || 'Select Date'
                        : t('select_time') || 'Select Time'}
                </Label>

                <Button
                  mode="text"
                  onPress={handleConfirm}
                  textColor={colors.primary}
                >
                  {mode === 'datetime' && currentMode === 'date'
                    ? t('next') || 'Next'
                    : t('done') || 'Done'}
                </Button>
              </View>

              {mode === 'datetime' && (
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    backgroundColor: colors.surfaceVariant,
                  }}
                >
                  <Caption
                    color={colors.onSurfaceVariant}
                    align="center"
                    style={{ fontFamily: 'Urbanist-Medium' }}
                  >
                    {currentMode === 'date'
                      ? `${t('step') || 'Step'} 1 ${t('of') || 'of'} 2: ${t('select_date') || 'Select date'}`
                      : `${t('step') || 'Step'} 2 ${t('of') || 'of'} 2: ${t('select_time') || 'Select time'}`}
                  </Caption>
                </View>
              )}

              <DateTimePicker
                testID="dateTimePicker"
                value={tempValue || tempDate || value || new Date()}
                mode={currentMode}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={{
                  backgroundColor: colors.surface,
                  height: 200,
                }}
                textColor={colors.onSurface}
                accentColor={colors.primary}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempDate || value || new Date()}
          mode={currentMode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default CustomDateTimePicker;
