import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';

const notifications = [
  {
    id: '1',
    title: 'Payment Received',
    message: 'You have received a payment of $49.99.',
    icon: 'cash-check',
    color: '#4CAF50',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Order Completed',
    message: 'Order #1234 has been completed.',
    icon: 'check-circle-outline',
    color: '#2196F3',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '3',
    title: 'Inventory Low',
    message: 'You are running low on Cheese.',
    icon: 'alert-circle-outline',
    color: '#FF9800',
    time: '1 day ago',
    read: false,
  },
];

type Props = RestaurantProfileStackScreenProps<'Notification'>;

const NotificationScreen = ({ navigation }: Props) => {
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderNotification = ({
    item,
  }: {
    item: (typeof notifications)[0];
  }) => (
    <Animated.View
      style={{
        opacity: listAnim,
        transform: [
          {
            translateY: listAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification,
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + '22' }]}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={26}
            color={item.color}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.notificationTitle, !item.read && styles.unreadText]}
          >
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
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
          colors={['#667eea', '#764ba2']}
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <MaterialCommunityIcons
            name="bell-outline"
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
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6 }}
        />
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#764ba2',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  unreadNotification: {
    borderWidth: 1.5,
    borderColor: '#764ba2',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadText: {
    color: '#764ba2',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#764ba2',
    marginLeft: 10,
  },
});

export default NotificationScreen;
