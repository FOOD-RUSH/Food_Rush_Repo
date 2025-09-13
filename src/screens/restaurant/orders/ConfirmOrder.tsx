import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  route: RouteProp<Record<string, { id: string }>, string>;
  navigation: StackNavigationProp<Record<string, object>, string>;
};

export default function ConfirmOrderScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Call the confirm order endpoint
      const response = await fetch(`https://foodrush-be.onrender.com/api/v1/orders/${id}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
        },
      });

      if (response.ok) {
        // After success navigate or show result
        navigation.replace('OrderDetails', { id });
      } else {
        console.error('Failed to confirm order');
        // Handle error
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirm Order</Text>
      <Text style={styles.subtitle}>Order ID: {id}</Text>

      <View style={styles.row}>
        <Button title={loading ? 'Confirming...' : 'Confirm Order'} onPress={handleConfirm} disabled={loading} />
      </View>

      <View style={styles.row}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>

      {/* TODO: Place any additional endpoint calls here, e.g. notify customer, refresh list */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  row: { marginVertical: 8 },
});