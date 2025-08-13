import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Alert, 
  StyleSheet, 
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Avatar, Divider, Badge } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';

// Type definitions
type NotificationType = 'order' | 'inventory' | 'payment' | 'schedule';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
}

interface RestaurantInfo {
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  totalReviews: number;
  phone: string;
  email: string;
  address: string;
  hours: Record<string, string>;
  features: string[];
  established: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  restaurantName: string;
  joinDate: string;
  address: string;
}

interface ProfileOption {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

// Add proper typing for the component
type ProfileScreenProps = RestaurantProfileStackScreenProps<'ProfileScreen'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  // State management
  const [user] = useState<UserProfile>({
    name: 'Restaurant Owner',
    email: 'owner@restaurant.com',
    phone: '+1 234 567 8900',
    restaurantName: 'The Great Eatery',
    joinDate: 'January 2024',
    address: '123 Food Street, City',
  });

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showRestaurantProfile, setShowRestaurantProfile] = useState<boolean>(false);
  const [unreadNotifications] = useState<number>(2);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Notification data
  const [notifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #1234 has been placed by John Doe',
      time: '5 minutes ago',
      type: 'order',
      read: false,
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Tomatoes are running low in inventory',
      time: '2 hours ago',
      type: 'inventory',
      read: false,
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of $45.50 has been received',
      time: '1 day ago',
      type: 'payment',
      read: true,
    },
    {
      id: 4,
      title: 'Staff Schedule',
      message: 'Tomorrow\'s staff schedule has been updated',
      time: '2 days ago',
      type: 'schedule',
      read: true,
    },
  ]);

  // Restaurant data
  const [restaurant] = useState<RestaurantInfo>({
    name: 'The Great Eatery',
    description: 'A family-owned restaurant serving delicious comfort food since 2020',
    cuisine: 'American, Italian',
    rating: 4.5,
    totalReviews: 128,
    phone: '+1 234 567 8900',
    email: 'info@thegreateatery.com',
    address: '123 Food Street, City, State 12345',
    hours: {
      'Monday - Friday': '11:00 AM - 10:00 PM',
      'Saturday - Sunday': '10:00 AM - 11:00 PM',
    },
    features: ['Takeout', 'Delivery', 'Dine-in', 'Outdoor Seating'],
    established: '2020',
  });

  // Profile options configuration
  const profileOptions: ProfileOption[] = [
    {
      title: 'Payment & Billing',
      subtitle: 'Manage your payment methods and billing info',
      icon: 'credit-card-outline',
      onPress: () => navigation.navigate('PaymentBilling'), 
    },
    {
      title: 'Notifications',
      subtitle: 'View and manage your notifications',
      icon: 'bell-outline',
      onPress: () => navigation.navigate('Notification'),
    },
    {
      title: 'Account & Settings',
      subtitle: 'Update your account information and preferences',
      icon: 'account-cog-outline',
      onPress: () => navigation.navigate('AccountSettings'), 
    },
    {
      title: 'Restaurant Settings',
      subtitle: 'Edit your restaurant details and preferences',
      icon: 'store-cog-outline',
      onPress: () => navigation.navigate('RestaurantSettings'),
    },
    {
      title: 'Support',
      subtitle: 'Get help or contact support',
      icon: 'lifebuoy',
      onPress: () => navigation.navigate('Support'),
    },
    {
      title: 'About',
      subtitle: 'Learn more about this app',
      icon: 'information-outline',
      onPress: () => navigation.navigate('About'),
    },
  ];

  // Effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Utility functions
  const getNotificationIcon = (type: NotificationType): keyof typeof MaterialCommunityIcons.glyphMap => {
    const iconMap: Record<NotificationType, keyof typeof MaterialCommunityIcons.glyphMap> = {
      order: 'shopping',
      inventory: 'package-variant',
      payment: 'credit-card',
      schedule: 'calendar-clock',
    };
    return iconMap[type] || 'bell';
  };

  const getNotificationColor = (type: NotificationType): string => {
    const colorMap: Record<NotificationType, string> = {
      order: '#4CAF50',
      inventory: '#FF9800',
      payment: '#2196F3',
      schedule: '#9C27B0',
    };
    return colorMap[type] || '#666';
  };

  // Event handlers
  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing feature is coming soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
          }
        }
      ]
    );
  };

  const handleNotificationPress = (item: NotificationItem) => {
    Alert.alert('Notification', item.message);
  };

  // FIXED: This function now properly navigates to the edit screen with data
  const openEditProfile = () => {
    // Pass current user data to the edit screen
    const userProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      restaurantName: user.restaurantName,
      address: user.address,
      bio: '', // Add if you have this data
      website: '', // Add if you have this data
      cuisine: restaurant.cuisine, // Using restaurant data for cuisine
    };

    navigation.navigate('ProfileEditProfile', { userProfile });
  };

  // Render functions
  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationLeft}>
        <View style={[
          styles.notificationIconContainer,
          { backgroundColor: getNotificationColor(item.type) + '20' }
        ]}>
          <MaterialCommunityIcons
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            !item.read && styles.unreadText
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderHours = () => {
    return Object.entries(restaurant.hours).map(([days, hours]) => (
      <View key={days} style={styles.hoursRow}>
        <Text style={styles.hoursDay}>{days}</Text>
        <Text style={styles.hoursTime}>{hours}</Text>
      </View>
    ));
  };

  const renderFeatures = () => {
    return restaurant.features.map((feature, index) => (
      <View key={index} style={styles.featureTag}>
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    ));
  };

  // Modal Components
  const NotificationModal: React.FC<ModalComponentProps> = ({ visible, onClose }) => (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Notifications</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );

  const RestaurantModal: React.FC<ModalComponentProps> = ({ visible, onClose }) => (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Restaurant Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.restaurantProfileContent} showsVerticalScrollIndicator={false}>
          <View style={styles.restaurantHeader}>
            <Avatar.Text
              size={60}
              label={restaurant.name.split(' ').map(n => n[0]).join('')}
              style={styles.restaurantAvatar}
            />
            <Text style={styles.restaurantNameModal}>{restaurant.name}</Text>
            <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
            
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewText}>({restaurant.totalReviews} reviews)</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="phone" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{restaurant.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="email" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{restaurant.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
              <Text style={styles.contactText}>{restaurant.address}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Operating Hours</Text>
            {renderHours()}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant Features</Text>
            <View style={styles.featuresContainer}>
              {renderFeatures()}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cuisine Type:</Text>
              <Text style={styles.detailValue}>{restaurant.cuisine}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Established:</Text>
              <Text style={styles.detailValue}>{restaurant.established}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );


 return (
    <CommonView>
      {/* Top Action Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => setShowNotifications(true)}
        >
          <MaterialCommunityIcons name="bell" size={24} color="#007AFF" />
          {unreadNotifications > 0 && (
            <Badge size={16} style={styles.notificationBadge}>
              {unreadNotifications}
            </Badge>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => setShowRestaurantProfile(true)}
        >
          <MaterialCommunityIcons name="store" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Avatar.Text
            size={80}
            label={user.name.split(' ').map(n => n[0]).join('')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.restaurantName}>{user.restaurantName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <Button
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon="account-edit"
          >
            Edit Profile
          </Button>
        </Animated.View>

        <Animated.View
          style={[
            styles.profileInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#666" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <Text style={styles.infoText}>{user.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <Text style={styles.infoText}>Member since {user.joinDate}</Text>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={{
            marginTop: 16,
            marginHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: '#764ba2',
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={openEditProfile}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Edit Profile</Text>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <Animated.View
          style={[
            styles.optionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color="#007AFF"
                  style={styles.optionIcon}
                />
                <View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View
          style={[
            styles.logoutContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#FF3B30"
            icon="logout"
          >
            Logout
          </Button>
        </Animated.View>
      </ScrollView>

      {/* Modals */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      <RestaurantModal
        visible={showRestaurantProfile}
        onClose={() => setShowRestaurantProfile(false)}
      />
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 20,
  },
  topButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    backgroundColor: '#007AFF',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    marginTop: 10,
  },
  profileInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    marginVertical: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoutButton: {
    paddingVertical: 5,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  // Notification Modal Styles
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  unreadNotification: {
    backgroundColor: '#E3F2FD',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  // Restaurant Profile Modal Styles
  restaurantProfileContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  restaurantHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  restaurantAvatar: {
    backgroundColor: '#007AFF',
    marginBottom: 15,
  },
  restaurantNameModal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  restaurantDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
  },
  hoursDay: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  hoursTime: {
    fontSize: 14,
    color: '#666',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileScreen;