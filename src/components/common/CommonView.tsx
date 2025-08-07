import { View, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';

interface CommonViewProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
}

const CommonView = ({ 
  children, 
  showStatusBar = true
}: CommonViewProps) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? '#fff' : '#0f172a';
  const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';

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
        className="flex-1"
        style={{ backgroundColor }}
      >
        <View className="flex-1 px-4" style={{ backgroundColor }}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommonView;
