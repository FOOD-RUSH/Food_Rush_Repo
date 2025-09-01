import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  disabled = false,
  onFocus,
  onClear,
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
    <View className='flex-1 flex-row items-center'>
      <TextInput
        placeholder={placeholder || t('search_for_food')}
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        outlineStyle={{
          borderColor: isFocused ? colors.primary : colors.surfaceVariant,
          borderRadius: 20,
          borderWidth: 1,
        }}
        style={{
          backgroundColor: isFocused ? '#e6f0ff' : colors.surfaceVariant,
          opacity: disabled ? 0.6 : 1,
          paddingTop: 5,
          paddingBottom: 5,
          paddingRight: 10,
          paddingLeft: 10,
          flex: 1,
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
  );
};

export default SearchInput;
