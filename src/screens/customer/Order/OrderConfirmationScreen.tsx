import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Params = {
  status?: 'CONFIRMED' | 'CANCELLED' | string;
  id?: string;
  reason?: string;
};

type Props = {
  route: RouteProp<Record<string, Params>, string>;
  navigation: StackNavigationProp<Record<string, object>, string>;
};

export default function OrderConfirmationScreen({ route, navigation }: Props) {
  const { status, id, reason } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      <Text style={styles.status}>Order ID: {id}</Text>
      <Text style={styles.status}>Status: {status ?? 'UNKNOWN'}</Text>

      {status === 'CANCELLED' && reason ? (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Button title="Go to Orders" onPress={() => navigation.navigate('OrderHistory')} />
      </View>

      {/* TODO: If you need to re-fetch order details, call GET /api/v1/orders/{id} here */}
      {/* TODO: If you need webhooks or followups, mark other endpoints here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  status: { fontSize: 16, marginBottom: 6 },
  reasonBox: { marginTop: 12, padding: 12, backgroundColor: '#fff3f3', borderRadius: 6 },
  reasonLabel: { fontWeight: '600' },
  reasonText: { marginTop: 6, color: '#333' },
  row: { marginTop: 20 },
});