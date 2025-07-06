import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

const SearchFood = () => {
  const [input, setInput] = useState('');
  return (
    <View className="my-3">
      <TextInput
        mode="outlined"
        right={<Ionicons name="search" color="grey" />}
        label="What are you craving ?"
        contentStyle={{ paddingHorizontal: 10 }}
        value={input}
        onChangeText={() => setInput(input)}
        style={{ backgroundColor: 'grey', padding: 10 }}
      />
    </View>
  );
};

export default SearchFood;
