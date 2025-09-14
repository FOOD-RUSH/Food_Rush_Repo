import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTimeOnly } from '../../utils/timeUtils';

interface TimePickerProps {
  value: Date | null;
  onTimeChange: (time: Date) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onTimeChange,
  placeholder = 'Select time',
  label,
  error = false,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value || new Date();
    setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    onTimeChange(currentDate);
  };

  const showTimePicker = () => {
    if (!disabled) {
      setShow(true);
    }
  };

  const displayValue = value ? formatTimeOnly(value) : placeholder;

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
        onPress={showTimePicker}
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
        <MaterialCommunityIcons
          name="clock-outline"
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="timePicker"
          value={value || new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          locale="fr-FR" // French locale for Cameroon
        />
      )}
    </View>
  );
};

export default TimePicker;