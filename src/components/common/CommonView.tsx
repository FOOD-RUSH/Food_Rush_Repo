import { View, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

interface CommonViewProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
}

const CommonView = ({ children, showStatusBar = true }: CommonViewProps) => {
  const { colors } = useTheme();
  const backgroundColor = colors.background;
  const statusBarStyle = colors.onSurface === '#1e293b' ? 'dark-content' : 'light-content';

  return (
    <>
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={backgroundColor}
          translucent={false}
        />
      )}
      <SafeAreaView className="flex-1 " style={{ backgroundColor }}>
        <View className="flex-1 px-4" style={{ backgroundColor }}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommonView;
