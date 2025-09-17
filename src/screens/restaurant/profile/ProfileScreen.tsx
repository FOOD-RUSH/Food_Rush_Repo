<<<<<<< HEAD
import React, { useRef, useEffect } from 'react';
=======
import React, { useState, useRef, useEffect } from 'react';
>>>>>>> origin/Customer_Setup
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  StyleSheet,
<<<<<<< HEAD
=======
  Modal,
  SafeAreaView,
  FlatList,
>>>>>>> origin/Customer_Setup
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Avatar, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
<<<<<<< HEAD
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { useUser } from '@/src/stores/customerStores/AuthStore';
import { useRestaurantProfile } from '@/src/hooks/restaurant/useRestaurantApi';
=======
import { Ionicons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { useAuthStore, useAuthLoading } from '../../../stores/customerStores/AuthStore';
import Toast from 'react-native-toast-message';
>>>>>>> origin/Customer_Setup

type ProfileScreenProps = RestaurantProfileStackScreenProps<'ProfileScreen'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
<<<<<<< HEAD
  const { t } = useTranslation();
  const user = useUser(); // ✅ Use AuthStore
  const { data: restaurantProfile } = useRestaurantProfile();
  const {colors} = useTheme()
  
  // Use restaurant profile data if available, fallback to user data
  const profileData = restaurantProfile || user;

=======
  // Auth store
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const isLoggingOut = useAuthLoading();

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
  const [showRestaurantProfile, setShowRestaurantProfile] =
    useState<boolean>(false);
  const [unreadNotifications] = useState<number>(2);

  // Animation refs
>>>>>>> origin/Customer_Setup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const profileOptions = [
    {
      title: t('edit_profile'),
      subtitle: t('update_personal_restaurant_info' as any),
      icon: 'account-edit-outline' as const,
      onPress: () => navigation.navigate('RestaurantEditProfile'),
      iconColor: '#007AFF',
    },
    {
      title: t('payment_billing'),
      subtitle: t('manage_payment_methods'),
      icon: 'credit-card-outline' as const,
      onPress: () => navigation.navigate('PaymentBilling'),
    },
    {
<<<<<<< HEAD
      title: t('notifications'),
      subtitle: t('view_manage_notifications'),
      icon: 'bell-outline' as const,
      onPress: () => navigation.navigate('Notification'),
    },
      {
      title: t('account_settings'),
      subtitle: t('account_settings'),
      icon: 'setting' as const,
=======
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
      message: "Tomorrow's staff schedule has been updated",
      time: '2 days ago',
      type: 'schedule',
      read: true,
    },
  ]);

  // Restaurant data
  const [restaurant] = useState<RestaurantInfo>({
    name: 'The Great Eatery',
    description:
      'A family-owned restaurant serving delicious comfort food since 2020',
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
>>>>>>> origin/Customer_Setup
      onPress: () => navigation.navigate('AccountSettings'),
    },
    {
      title: t('support'),
      subtitle: t('get_help_contact'),
      icon: 'lifebuoy' as const,
      onPress: () => navigation.navigate('Support'),
      iconColor: '#666666',
    },
    {
      title: t('about'),
      subtitle: t('learn_more_app'),
      icon: 'information-outline' as const,
      onPress: () => navigation.navigate('About'),
    },
  
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

<<<<<<< HEAD
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
    ]);
  };

  return (
    <CommonView>
=======
  // Utility functions
  const getNotificationIcon = (
    type: NotificationType,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    const iconMap: Record<
      NotificationType,
      keyof typeof MaterialCommunityIcons.glyphMap
    > = {
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
    Alert.alert('Edit Profile', 'Profile editing feature is coming soon!', [
      { text: 'OK', style: 'default' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear your session and return you to the login screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              Toast.show({
                type: 'info',
                text1: 'Logging out...',
                text2: 'Please wait while we sign you out',
                position: 'top',
              });
              
              await logoutUser();
              
              Toast.show({
                type: 'success',
                text1: 'Logged out successfully',
                text2: 'You have been signed out of your account',
                position: 'top',
              });
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: 'Logout Error',
                text2: 'There was an issue logging out. Please try again.',
                position: 'top',
              });
            }
          },
        },
      ],
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
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationLeft}>
        <View
          style={[
            styles.notificationIconContainer,
            { backgroundColor: getNotificationColor(item.type) + '20' },
          ]}
        >
          <MaterialCommunityIcons
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.notificationContent}>
          <Text
            style={[styles.notificationTitle, !item.read && styles.unreadText]}
          >
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
  const NotificationModal: React.FC<ModalComponentProps> = ({
    visible,
    onClose,
  }) => (
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

  const RestaurantModal: React.FC<ModalComponentProps> = ({
    visible,
    onClose,
  }) => (
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

        <ScrollView
          style={styles.restaurantProfileContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.restaurantHeader}>
            <Avatar.Text
              size={60}
              label={restaurant.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
              style={styles.restaurantAvatar}
            />
            <Text style={styles.restaurantNameModal}>{restaurant.name}</Text>
            <Text style={styles.restaurantDescription}>
              {restaurant.description}
            </Text>

            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewText}>
                ({restaurant.totalReviews} reviews)
              </Text>
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
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color="#007AFF"
              />
              <Text style={styles.contactText}>{restaurant.address}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Operating Hours</Text>
            {renderHours()}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant Features</Text>
            <View style={styles.featuresContainer}>{renderFeatures()}</View>
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

>>>>>>> origin/Customer_Setup
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.profileHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Avatar.Text
            size={80}
<<<<<<< HEAD
            label={profileData?.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('') : profileData?.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'R'}
            style={[styles.avatar,{} ]}
          />
          <Text style={[styles.userName, {color: colors.onSurface}]}>{profileData?.fullName || profileData?.name || ''}</Text>
          <Text style={[styles.restaurantName,  {color: colors.onSurface}]}>{profileData?.restaurantName || profileData?.name || ''}</Text>
          <Text style={[styles.userEmail,  {color: colors.onSurface}]}>{profileData?.email || ''}</Text>
=======
            label={user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
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
>>>>>>> origin/Customer_Setup
        </Animated.View>

        <Animated.View style={[styles.profileInfo, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#666" />
            <Text style={[styles.infoText, {color: colors.onSurface}]}>{profileData?.phoneNumber || profileData?.phone || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <Text style={[styles.infoText, {color: colors.onBackground}]}>{profileData?.address || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <Text style={[styles.infoText, {color: colors.onBackground}]}>{t('member_since')} {profileData?.joinDate || profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : ''}</Text>
          </View>
        </Animated.View>

<<<<<<< HEAD
=======
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
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

>>>>>>> origin/Customer_Setup
        <Divider style={styles.divider} />

        <Animated.View style={[styles.optionsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionItem} onPress={option.onPress}>
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color={option.iconColor ?? '#007AFF'}
                  style={styles.optionIcon}
                />
                <View>
                  <Text style={[styles.optionTitle,  {color: colors.onSurface}]}>{option.title}</Text>
                  <Text style={[styles.optionSubtitle,  {color: colors.onSurface}]}>{option.subtitle}</Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#ccc"
              />
            </TouchableOpacity>
          ))}
        </Animated.View>

<<<<<<< HEAD
        <Animated.View style={[styles.logoutContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} buttonColor="#007aff" icon="logout">
            <Text style={{color: 'white'}}>Logout</Text>
=======
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
            icon={isLoggingOut ? undefined : "logout"}
            loading={isLoggingOut}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
>>>>>>> origin/Customer_Setup
          </Button>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
<<<<<<< HEAD
=======

      {/* Modals */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <RestaurantModal
        visible={showRestaurantProfile}
        onClose={() => setShowRestaurantProfile(false)}
      />
>>>>>>> origin/Customer_Setup
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  avatar: { backgroundColor: '#007AFF', marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  restaurantName: { fontSize: 18, marginBottom: 5 },
  userEmail: { fontSize: 16, marginBottom: 20 },
  profileInfo: { paddingHorizontal: 20, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { marginLeft: 15, fontSize: 16 },
  divider: { marginVertical: 20 },
  optionsContainer: { paddingHorizontal: 20 },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 0 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionIcon: { marginRight: 15 },
  optionTitle: { fontSize: 16, fontWeight: '500' },
  optionSubtitle: { fontSize: 14, marginTop: 2 },
  logoutContainer: { paddingHorizontal: 20, paddingVertical: 30 },
  logoutButton: { paddingVertical: 5 },
  appVersion: { textAlign: 'center', fontSize: 12,  marginTop: 20 },
});

export default ProfileScreen;
