import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: NetInfoState['type'] | null;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true);
  const [type, setType] = useState<NetInfoState['type'] | null>(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
      setType(state.type);

      // Show toast when connection status changes
      if (state.isConnected === false) {
        Toast.show({
          type: 'error',
          text1: 'No Internet Connection',
          text2: 'Please check your network settings',
          position: 'bottom',
          visibilityTime: 3000,
        });
      } else if (state.isConnected === true && !state.isInternetReachable) {
        Toast.show({
          type: 'error',
          text1: 'Limited Internet Connection',
          text2:
            'You are connected to a network but cannot access the internet',
          position: 'bottom',
          visibilityTime: 3000,
        });
      } else if (
        state.isConnected === true &&
        state.isInternetReachable === true
      ) {
        Toast.show({
          type: 'success',
          text1: 'Internet Connection Restored',
          position: 'bottom',
          visibilityTime: 2000,
        });
      }
    });

    // Get initial network state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
      setType(state.type);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
        type,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
