import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateOnly } from '../../utils/timeUtils';

interface DatePickerProps {
  value: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = 'Select date',
  label,
  error = false,
  disabled = false,
  minimumDate,
  maximumDate,
}) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  const [tempValue, setTempValue] = useState<Date | null>(null);

  const onChange = useCallback((event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value || new Date();
    
    if (event.type === 'dismissed') {
      setShow(false);
      setTempValue(null);
      return;
    }

    if (Platform.OS === 'android') {
      setShow(false);
      onDateChange(currentDate);
    } else {
      // iOS: store temporary value for modal confirmation
      setTempValue(currentDate);
    }
  }, [value, onDateChange]);

  const handleConfirm = useCallback(() => {
    if (tempValue) {
      onDateChange(tempValue);
    }
    setShow(false);
    setTempValue(null);
  }, [tempValue, onDateChange]);

  const handleCancel = useCallback(() => {
    setShow(false);
    setTempValue(null);
  }, []);

  const showDatePicker = useCallback(() => {
    if (!disabled) {
      setTempValue(value);
      setShow(true);
    }
  }, [disabled, value]);

  const displayValue = value ? formatDateOnly(value) : placeholder;

  return (
    <View>
      {label && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
            color: colors.onSurface,
          }}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={showDatePicker}
        disabled={disabled}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderWidth: error ? 2 : 0,
          borderColor: error ? colors.error : 'transparent',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: value ? colors.onSurface : colors.onSurfaceVariant,
          }}
        >
          {displayValue}
        </Text>
        <MaterialCommunityIcon
          name="calendar-outline"
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
                  Cancel
                </Button>
                
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.onSurface,
                  }}
                >
                  Select Date
                </Text>
                
                <Button
                  mode="text"
                  onPress={handleConfirm}
                  textColor={colors.primary}
                >
                  Done
                </Button>
              </View>

              <DateTimePicker
                testID="datePicker"
                value={tempValue || value || new Date()}
                mode="date"
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

      {/* Android Inline Picker */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          testID="datePicker"
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePicker;
