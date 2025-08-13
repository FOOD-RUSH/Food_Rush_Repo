import React, { useState } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

const SearchFood = () => {
  const [input, setInput] = useState('');
  const { colors } = useTheme();

  return (
    <View className="my-3">
      <TextInput
        mode="outlined"
        right={<Ionicons name="search" color={colors.outline} />}
        label="What are you craving ?"
        contentStyle={{ paddingHorizontal: 10 }}
        value={input}
        onChangeText={() => setInput(input)}
        style={{ backgroundColor: colors.surface, padding: 10 }}
        textColor={colors.onSurface}
        placeholderTextColor={colors.outline}
      />
    </View>
  );
};

export default SearchFood;
