import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';

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

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value || new Date();
    setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    onDateChange(currentDate);
  };

  const showDatePicker = () => {
    if (!disabled) {
      setShow(true);
    }
  };

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
        <MaterialCommunityIcon           name="calendar-outline"
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="datePicker"
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="fr-FR" // French locale for Cameroon
        />
      )}
    </View>
  );
};

export default DatePicker;
