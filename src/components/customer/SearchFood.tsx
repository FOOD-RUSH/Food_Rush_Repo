import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

const SearchFood = () => {
  const [input, setInput] = useState('');
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'black' : 'white';
  const placeholderColor = theme === 'light' ? 'gray' : 'lightgray';

  return (
    <View className="my-3">
      <TextInput
        mode="outlined"
        right={<Ionicons name="search" color={placeholderColor} />}
        label="What are you craving ?"
        contentStyle={{ paddingHorizontal: 10 }}}
        value={input}
        onChangeText={() => setInput(input)}
        style={{ backgroundColor: backgroundColor, padding: 10 }}
        textColor={textColor}
        placeholderTextColor={placeholderColor}
      />
    </View>
  );
};

export default SearchFood;
