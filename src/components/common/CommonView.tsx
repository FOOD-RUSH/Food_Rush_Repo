import { View, StatusBar, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

interface CommonViewProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
  paddingHorizontal?: number;
  safeAreaEdges?: ('top' | 'right' | 'bottom' | 'left')[];
  style?: StyleProp<ViewStyle>;
}

const CommonView = ({ children, showStatusBar = true }: CommonViewProps) => {
  const { colors, dark } = useTheme();
  const backgroundColor = colors.background;
  const statusBarStyle = dark ? 'light-content' : 'dark-content';

  return (
    <>
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={backgroundColor}
          translucent={false}
        />
      )}

      <SafeAreaView
        className={`flex-1 ${dark ? 'dark' : ''}`}
        style={{ backgroundColor }}
      >
        <View
          className={`flex-1 px-4 ${dark ? 'dark' : ''}`}
          style={{ backgroundColor }}
        >
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommonView;
