import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { signOutUser } from '@/store/slices/authSlice';

export default function CustomerScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = () => {
    dispatch(signOutUser());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Customer Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to Food Rush!</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleSignOut}
            style={styles.button}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 200,
  },
  button: {
    marginVertical: 10,
  },
}); 