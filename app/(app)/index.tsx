import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function AppIndex() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('AppIndex: Component mounted, user:', !!user);
    console.log('AppIndex: Redirecting to home screen');
    // For now, just redirect to home screen
    // You can add user type logic later
    router.replace('/(app)/home');
  }, [user, router]);

  console.log('AppIndex: Rendering LoadingScreen');
  return <LoadingScreen />;
} 