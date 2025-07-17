import { View,  StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CommonViewProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  showStatusBar?: boolean;
}

const CommonView = ({ 
  children, 
  backgroundColor = '#fff',
  statusBarStyle = 'dark-content',
  showStatusBar = true
}: CommonViewProps) => {
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
        className="flex h-full "
        style={{ backgroundColor }}
      >
        <View className="flex-1 px-4 " style={{ backgroundColor }}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommonView;
