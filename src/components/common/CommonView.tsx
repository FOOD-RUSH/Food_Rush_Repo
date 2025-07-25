import { View, StatusBar, StatusBarStyle, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CommonViewProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
  showStatusBar?: boolean;
  paddingHorizontal?: number;
  safeAreaEdges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  style?: StyleProp<ViewStyle>;
}

const CommonView = ({ 
  children, 
  backgroundColor = '#ffffff',
  statusBarStyle = 'dark-content',
  showStatusBar = true,
  paddingHorizontal = 16,
  safeAreaEdges = ['top', 'right', 'bottom', 'left'],
  style
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
        edges={safeAreaEdges}
        style={[{ 
          flex: 1, 
          backgroundColor 
        }, style]}
      >
        <View 
          style={[{ 
            flex: 1, 
            paddingHorizontal,
            backgroundColor 
          }, style]}
        >
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommonView;