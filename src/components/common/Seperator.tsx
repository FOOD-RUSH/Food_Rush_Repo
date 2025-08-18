import { View } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

const Seperator = () => {
  const { colors } = useTheme();

  return (
    <View
      className={`h-[1px] my-3 `}
      style={{ backgroundColor: colors.outline }}
    />
  );
};

export default Seperator;
