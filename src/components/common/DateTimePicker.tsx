import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value || new Date();

    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (mode === 'datetime') {
      if (currentMode === 'date') {
        // Store the selected date and switch to time picker
        setTempDate(currentDate);
        setCurrentMode('time');
        if (Platform.OS === 'ios') {
          setShow(true);
        } else {
          // On Android, show time picker immediately
          setTimeout(() => {
            setShow(true);
          }, 100);
        }
      } else {
        // Combine the stored date with the selected time
        const finalDate = tempDate ? new Date(tempDate) : new Date();
        finalDate.setHours(currentDate.getHours());
        finalDate.setMinutes(currentDate.getMinutes());
        finalDate.setSeconds(0);
        finalDate.setMilliseconds(0);

        onDateTimeChange(finalDate);
        setTempDate(null);
        setCurrentMode('date');
        if (Platform.OS === 'ios') {
          setShow(false);
        }
      }
    } else {
      onDateTimeChange(currentDate);
      if (Platform.OS === 'ios') {
        setShow(false);
      }
    }
  };

  const showPicker = () => {
    if (!disabled) {
      setCurrentMode(mode === 'datetime' ? 'date' : (mode as 'date' | 'time'));
      setShow(true);
    }
  };

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
          padding: 8,
          borderWidth: error ? 2 : 1,
          borderColor: error ? colors.error : colors.outline,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'space-between',
          gap: 4,
          opacity: disabled ? 0.6 : 1,
          flex: 1,
        }}
      >
        <Typography
          variant="body"
          color={value ? colors.onSurface : colors.onSurfaceVariant}
          style={{ fontFamily: 'Urbanist-Regular' }}
        >
          {displayValue}
        </Typography>
        <MaterialCommunityIcons
          name={getIcon()}
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      {/* Show current step for datetime mode */}
      {mode === 'datetime' && show && (
        <Caption
          color={colors.onSurfaceVariant}
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontFamily: 'Urbanist-Regular',
          }}
        >
          {currentMode === 'date'
            ? t('select_date_first') || 'Step 1: Select date'
            : t('select_time_second') || 'Step 2: Select time'}
        </Caption>
      )}

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempDate || value || new Date()}
          mode={currentMode}
          is24Hour={true}
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

export default CustomDateTimePicker;
