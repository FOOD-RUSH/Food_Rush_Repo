import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onClear?: () => void;
  showFilterButton?: boolean;
  onFilterPress?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  disabled = false,
  onFocus,
  onClear,
  showFilterButton = false,
  onFilterPress,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder={placeholder || t('search_for_food')}
          mode="outlined"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          // onBlur={handleBlur}
          editable={!disabled}
          outlineStyle={{
            borderColor: isFocused ? colors.primary : colors.outline,
            borderRadius: 12,
          }}
          style={{
            backgroundColor: colors.surface,
            opacity: disabled ? 0.6 : 1,
          }}
          left={
            <TextInput.Icon
              icon="magnify"
              size={20}
              color={colors.onSurfaceVariant}
            />
          }
          right={
            value ? (
              <TextInput.Icon
                icon="close"
                onPress={handleClear}
                color={colors.onSurfaceVariant}
              />
            ) : null
          }
        />
      </View>

      {showFilterButton && (
        <TouchableOpacity
          onPress={onFilterPress}
          disabled={disabled}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 12,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <MaterialIcons name="tune" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;
