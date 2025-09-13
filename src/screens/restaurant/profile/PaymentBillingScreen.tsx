import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';

const { width } = Dimensions.get('window');

const paymentMethods = [
  {
    type: 'Visa',
    last4: '1234',
    icon: 'credit-card',
    color1: '#4e54c8',
    color2: '#8f94fb',
  },
  {
    type: 'MasterCard',
    last4: '5678',
    icon: 'credit-card',
    color1: '#fc5c7d',
    color2: '#6a82fb',
  },
  {
    type: 'Apple Pay',
    last4: '',
    icon: 'apple',
    color1: '#232526',
    color2: '#414345',
  },
];

const billingHistory = [
  { id: '1', date: '2025-07-01', amount: '$49.99', status: 'Paid' },
  { id: '2', date: '2025-06-01', amount: '$49.99', status: 'Paid' },
  { id: '3', date: '2025-05-01', amount: '$49.99', status: 'Paid' },
];

type Props = RestaurantProfileStackScreenProps<'PaymentBilling'>;

const PaymentBillingScreen = ({ navigation }: Props) => {
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const historyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(historyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderPaymentCard = (
    item: (typeof paymentMethods)[0],
    index: number,
  ) => (
    <Animated.View
      key={index}
      style={{
        opacity: cardAnim,
        transform: [{ scale: cardAnim }],
        marginBottom: 18,
      }}
    >
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={styles.card}
        start={[0, 0]}
        end={[1, 1]}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={32}
          color="#fff"
        />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.cardType}>{item.type}</Text>
          {item.last4 ? (
            <Text style={styles.cardDetails}>**** {item.last4}</Text>
          ) : (
            <Text style={styles.cardDetails}>No card number</Text>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Animated Gradient Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerAnim }],
        }}
      >
        <LinearGradient
          colors={['#764ba2', '#667eea']}
          style={styles.header}
          start={[0, 0]}
          end={[1, 1]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment & Billing</Text>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={32}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
        </LinearGradient>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Payment Methods Section */}
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <View style={styles.cardsContainer}>
          {paymentMethods.map(renderPaymentCard)}
          <TouchableOpacity style={styles.addCardBtn}>
            <Ionicons name="add-circle-outline" size={28} color="#764ba2" />
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Billing History Section */}
        <Animated.View style={{ opacity: historyAnim, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Billing History</Text>
          {billingHistory.map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <MaterialCommunityIcons
                name="receipt"
                size={22}
                color="#764ba2"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyStatus}>{item.status}</Text>
              </View>
              <Text style={styles.historyAmount}>{item.amount}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#764ba2',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#764ba2',
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#764ba2',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cardType: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDetails: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: '#764ba2',
    justifyContent: 'center',
  },
  addCardText: {
    color: '#764ba2',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#764ba2',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  historyDate: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  historyStatus: {
    fontSize: 13,
    color: '#764ba2',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    color: '#764ba2',
    fontWeight: 'bold',
  },
});

export default PaymentBillingScreen;
