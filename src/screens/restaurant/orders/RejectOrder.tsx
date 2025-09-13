import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  route: RouteProp<Record<string, { id: string }>, string>;
  navigation: StackNavigationProp<Record<string, object>, string>;
};

export default function RejectOrderScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    // TODO: CALL ENDPOINT -> POST /api/v1/orders/{id}/reject
    // Provide optional body: { "reason": "<reason>" }
    // Example:
    // await fetch(`/api/v1/orders/${id}/reject`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ reason })
    // });

    // After success navigate or show result
    setLoading(false);
    // Navigate to a confirmation/result screen for restaurant or order details
    navigation.replace('OrderDetails', { id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reject Order</Text>
      <Text style={styles.subtitle}>Order ID: {id}</Text>

      <TextInput
        style={styles.input}
        placeholder="Optional reason for rejection"
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <View style={styles.row}>
        <Button
          title={loading ? 'Rejecting...' : 'Reject Order'}
          onPress={handleReject}
          disabled={loading}
        />
      </View>

      <View style={styles.row}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>

      {/* TODO: If you want, trigger other endpoints here (notify customer, update analytics, etc.) */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    minHeight: 80,
    marginBottom: 12,
  },
  row: { marginVertical: 8 },
});
