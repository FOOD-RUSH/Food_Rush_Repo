import React, { useRef, useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '../../../navigation/types';
import { RESTAURANT_COLORS } from '@/src/config/restaurantTheme';
import { useAppStore } from '@/src/stores/customerStores/AppStore';
import CommonView from '@/src/components/common/CommonView';

const { width } = Dimensions.get('window');


type Props = RootStackScreenProps<'RestaurantPaymentBilling'>;

const PaymentBillingScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const themeMode = useAppStore((s) => s.theme);
  const isDarkMode = themeMode === 'dark';
  
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const historyAnim = useRef(new Animated.Value(0)).current;

  const [paymentMethods, setPaymentMethods] = useState([
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
  ]);

  const [billingHistory, setBillingHistory] = useState([
    { id: '1', date: '2025-07-01', amount: '$49.99', status: 'Paid' },
    { id: '2', date: '2025-06-01', amount: '$49.99', status: 'Paid' },
    { id: '3', date: '2025-05-01', amount: '$49.99', status: 'Paid' },
  ]);

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

<<<<<<< HEAD
  const styles = getStyles(isDarkMode);

  const renderPaymentCard = (item: typeof paymentMethods[0], index: number) => (
=======
  const renderPaymentCard = (
    item: (typeof paymentMethods)[0],
    index: number,
  ) => (
>>>>>>> origin/Customer_Setup
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
            <Text style={styles.cardDetails}>{t('no_card_number')}</Text>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <CommonView>
      {/* Animated Gradient Header */}
<<<<<<< HEAD
       
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
=======
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
>>>>>>> origin/Customer_Setup
        {/* Payment Methods Section */}
        <Text style={styles.sectionTitle}>{t('payment_methods')}</Text>
        <View style={styles.cardsContainer}>
          {paymentMethods.map(renderPaymentCard)}
          <TouchableOpacity style={styles.addCardBtn}>
            <Ionicons name="add-circle-outline" size={28} color="#764ba2" />
            <Text style={styles.addCardText}>{t('add_new_card')}</Text>
          </TouchableOpacity>
        </View>

        {/* Billing History Section */}
        <Animated.View style={{ opacity: historyAnim, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>{t('billing_history')}</Text>
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
    </CommonView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.BACKGROUND_DARK : RESTAURANT_COLORS.BACKGROUND_LIGHT,
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
    shadowColor: RESTAURANT_COLORS.PRIMARY,
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
    color: RESTAURANT_COLORS.PRIMARY,
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
    shadowColor: RESTAURANT_COLORS.PRIMARY,
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
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: RESTAURANT_COLORS.PRIMARY,
    justifyContent: 'center',
  },
  addCardText: {
    color: RESTAURANT_COLORS.PRIMARY,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 1,
    shadowColor: RESTAURANT_COLORS.PRIMARY,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
  },
  historyDate: {
    fontSize: 15,
    color: isDarkMode ? RESTAURANT_COLORS.TEXT_DARK : RESTAURANT_COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  historyStatus: {
    fontSize: 13,
    color: RESTAURANT_COLORS.PRIMARY,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    color: RESTAURANT_COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default PaymentBillingScreen;
