import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from 'react-native-paper';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  error = false,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<TextInput[]>([]);

  // Initialize OTP array from value
  const otpArray = value.split('').concat(['', '', '', '']).slice(0, 4);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [disabled]);

  const handleChange = (text: string, index: number) => {
    if (disabled) return;

    // Only allow single digit
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    if (digit) {
      // Update the OTP value
      const newOtp = otpArray
        .map((val, i) => (i === index ? digit : val))
        .join('');
      onChange(newOtp);

      // Auto-focus next input
      if (index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      } else {
        // Last input filled, dismiss keyboard
        Keyboard.dismiss();
      }
    } else {
      // Handle backspace
      const newOtp = otpArray
        .map((val, i) => (i === index ? '' : val))
        .join('');
      onChange(newOtp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const getInputStyle = (index: number) => {
    const isFocused = focusedIndex === index;
    const hasValue = !!otpArray[index];

    return [
      styles.input,
      {
        borderColor: error
          ? colors.error
          : isFocused
            ? colors.primary
            : hasValue
              ? colors.primary
              : colors.outline,
        backgroundColor: colors.surfaceVariant,
        color: colors.onSurface,
      },
    ];
  };

  return (
    <View style={styles.container}>
      {otpArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={getInputStyle(index)}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          editable={!disabled}
          contextMenuHidden
          textAlign="center"
          textAlignVertical="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  input: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default OTPInput;
