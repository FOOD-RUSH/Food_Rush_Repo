import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Index: User state changed - user:', !!user, 'loading:', loading);
    
    if (!loading) {
      if (user) {
        console.log('Index: User is logged in, navigating to /(app)');
        router.replace('/(app)');
      } else {
        console.log('Index: User is not logged in, navigating to /(auth)/login');
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  if (loading) {
    console.log('Index: Still loading, showing LoadingScreen');
    return <LoadingScreen />;
  }

  console.log('Index: Not loading, showing loading text');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
} 