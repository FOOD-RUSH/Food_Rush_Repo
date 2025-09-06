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
  ListRenderItem
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Avatar, Divider, Badge, Card } from 'react-native-paper';

// Type definitions
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'inventory' | 'payment' | 'schedule';
  read: boolean;
}

interface Restaurant {
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

interface User {
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
  icon: MaterialIconName;
  onPress: () => void;
  color: string;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

// Notification Modal Component
const NotificationModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Order Received',
      message: 'You have received a new order from John Doe',
      time: '2 minutes ago',
      type: 'order',
      read: false
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Pizza ingredients are running low',
      time: '1 hour ago',
      type: 'inventory',
      read: false
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of $45.50 has been received',
      time: '3 hours ago',
      type: 'payment',
      read: true
    }
  ]);

  const getNotificationIcon = (type: string): MaterialIconName => {
    switch (type) {
      case 'order': return 'shopping';
      case 'inventory': return 'package-variant';
      case 'payment': return 'credit-card';
      case 'schedule': return 'calendar-clock';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'order': return '#10B981';
      case 'inventory': return '#F59E0B';
      case 'payment': return '#3B82F6';
      case 'schedule': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const renderNotification: ListRenderItem<Notification> = ({ item }) => (
    <Card className="mx-6 mb-3" style={{ backgroundColor: item.read ? '#FFFFFF' : '#F0F9FF' }}>
      <TouchableOpacity 
        onPress={() => Alert.alert('Notification', item.message)}
        activeOpacity={0.7}
      >
        <Card.Content className="p-4">
          <View className="flex-row items-start">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4 mt-1"
              style={{ backgroundColor: `${getNotificationColor(item.type)}15` }}
            >
              <MaterialCommunityIcons
                name={getNotificationIcon(item.type)}
                size={20}
                color={getNotificationColor(item.type)}
              />
            </View>
            <View className="flex-1">
              <Text 
                className={`text-base ${item.read ? 'text-gray-800' : 'text-gray-900 font-semibold'} mb-1`}
              >
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                {item.message}
              </Text>
              <Text className="text-xs text-gray-400">{item.time}</Text>
            </View>
            {!item.read && <View className="w-3 h-3 bg-blue-500 rounded-full mt-2" />}
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-800">Notifications</Text>
          <TouchableOpacity 
            onPress={onClose} 
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-20">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <MaterialCommunityIcons name="bell-off" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 mb-2">No Notifications</Text>
              <Text className="text-gray-500 text-center">You&apos;re all caught up!</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

// Restaurant Profile Modal Component
const RestaurantProfileModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const [restaurant] = useState<Restaurant>({
    name: 'Delicious Bites',
    description: 'Authentic Italian cuisine with a modern twist',
    cuisine: 'Italian',
    rating: 4.8,
    totalReviews: 256,
    phone: '+1 (555) 123-4567',
    email: 'info@deliciousbites.com',
    address: '123 Main Street, Downtown',
    hours: {
      'Monday - Friday': '11:00 AM - 10:00 PM',
      'Saturday': '10:00 AM - 11:00 PM',
      'Sunday': '10:00 AM - 9:00 PM'
    },
    features: ['Delivery', 'Takeout', 'Dine-in', 'Vegetarian Options'],
    established: '2018',
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-800">Restaurant Profile</Text>
          <TouchableOpacity 
            onPress={onClose} 
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Restaurant Header */}
          <Card className="mx-6 mt-6" style={{ elevation: 2 }}>
            <Card.Content className="items-center py-8">
              <Avatar.Text
                size={80}
                label={restaurant.name.split(' ').map(n => n[0]).join('')}
                style={{ backgroundColor: '#3B82F6', marginBottom: 16 }}
              />
              <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                {restaurant.name}
              </Text>
              <Text className="text-gray-600 text-center mb-4 px-4">
                {restaurant.description}
              </Text>
              
              <View className="flex-row items-center bg-yellow-50 px-4 py-2 rounded-full">
                <MaterialCommunityIcons name="star" size={20} color="#F59E0B" />
                <Text className="text-lg font-bold text-gray-800 ml-2">{restaurant.rating}</Text>
                <Text className="text-gray-500 ml-2">({restaurant.totalReviews} reviews)</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Contact Information */}
          <Card className="mx-6 mt-6" style={{ elevation: 2 }}>
            <Card.Content className="p-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Contact Information</Text>
              
              <View className="space-y-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="phone" size={20} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-800 flex-1">{restaurant.phone}</Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="email" size={20} color="#10B981" />
                  </View>
                  <Text className="text-gray-800 flex-1">{restaurant.email}</Text>
                </View>
                
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="map-marker" size={20} color="#EF4444" />
                  </View>
                  <Text className="text-gray-800 flex-1">{restaurant.address}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Operating Hours */}
          <Card className="mx-6 mt-6" style={{ elevation: 2 }}>
            <Card.Content className="p-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Operating Hours</Text>
              {Object.entries(restaurant.hours).map(([days, hours]) => (
                <View key={days} className="flex-row justify-between items-center py-2">
                  <Text className="text-gray-700 font-medium">{days}</Text>
                  <Text className="text-gray-600">{hours}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Features */}
          <Card className="mx-6 mt-6" style={{ elevation: 2 }}>
            <Card.Content className="p-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Restaurant Features</Text>
              <View className="flex-row flex-wrap">
                {restaurant.features.map((feature, index) => (
                  <View key={index} className="bg-blue-50 px-3 py-2 rounded-full mr-2 mb-2">
                    <Text className="text-blue-700 text-sm font-medium">{feature}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Details */}
          <Card className="mx-6 mt-6" style={{ elevation: 2 }}>
            <Card.Content className="p-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Details</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Cuisine Type:</Text>
                  <Text className="text-gray-800 font-medium">{restaurant.cuisine}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Established:</Text>
                  <Text className="text-gray-800 font-medium">{restaurant.established}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const FoodDetailsScreen = () => {
  const [user] = useState<User>({
    name: 'John Smith',
    email: 'john@deliciousbites.com',
    phone: '+1 (555) 987-6543',
    restaurantName: 'Delicious Bites',
    joinDate: 'January 2023',
    address: '123 Main Street, Downtown',
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRestaurantProfile, setShowRestaurantProfile] = useState(false);
  const [unreadNotifications] = useState(2);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const profileOptions: ProfileOption[] = [
    {
      title: 'Restaurant Settings',
      subtitle: 'Manage restaurant information',
      icon: 'store-cog',
      color: '#3B82F6',
      onPress: () => Alert.alert('Coming Soon', 'Restaurant settings feature is coming soon!'),
    },
    {
      title: 'Account Settings',
      subtitle: 'Update personal information',
      icon: 'account-cog',
      color: '#10B981',
      onPress: () => Alert.alert('Coming Soon', 'Account settings feature is coming soon!'),
    },
    {
      title: 'Notifications',
      subtitle: 'Configure notification preferences',
      icon: 'bell-outline',
      color: '#F59E0B',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings feature is coming soon!'),
    },
    {
      title: 'Payment & Billing',
      subtitle: 'Manage payment methods',
      icon: 'credit-card-outline',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Coming Soon', 'Payment settings feature is coming soon!'),
    },
    {
      title: 'Support',
      subtitle: 'Get help and support',
      icon: 'help-circle-outline',
      color: '#06B6D4',
      onPress: () => Alert.alert('Support', 'For support, please contact us at support@restaurant.com'),
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-outline',
      color: '#6B7280',
      onPress: () => Alert.alert('About', 'Restaurant Management App v1.0.0\nBuilt with React Native'),
    },
  ];

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

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Top Action Buttons */}
      <View className="flex-row justify-between px-6 pt-12 pb-4">
        <TouchableOpacity
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm relative"
          onPress={() => setShowNotifications(true)}
        >
          <MaterialCommunityIcons name="bell" size={20} color="#3B82F6" />
          {unreadNotifications > 0 && (
            <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
          onPress={() => setShowRestaurantProfile(true)}
        >
          <MaterialCommunityIcons name="store" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card className="mx-6 mb-6" style={{ elevation: 2 }}>
            <Card.Content className="items-center py-8">
              <Avatar.Text
                size={80}
                label={user.name.split(' ').map(n => n[0]).join('')}
                style={{ backgroundColor: '#3B82F6', marginBottom: 16 }}
              />
              <Text className="text-2xl font-bold text-gray-800 mb-1">{user.name}</Text>
              <Text className="text-lg text-blue-600 font-medium mb-1">{user.restaurantName}</Text>
              <Text className="text-gray-500 mb-6">{user.email}</Text>
              
              <Button
                mode="outlined"
                onPress={handleEditProfile}
                icon="account-edit"
                textColor="#3B82F6"
                style={{ borderColor: '#3B82F6', borderRadius: 12 }}
                contentStyle={{ paddingHorizontal: 16 }}
              >
                Edit Profile
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Profile Info */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card className="mx-6 mb-6" style={{ elevation: 2 }}>
            <Card.Content className="p-6">
              <View className="space-y-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="phone" size={18} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-800 flex-1">{user.phone}</Text>
                </View>
                
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="map-marker" size={18} color="#10B981" />
                  </View>
                  <Text className="text-gray-800 flex-1">{user.address}</Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="calendar" size={18} color="#8B5CF6" />
                  </View>
                  <Text className="text-gray-800 flex-1">Member since {user.joinDate}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Options */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card className="mx-6 mb-6" style={{ elevation: 2 }}>
            <Card.Content className="p-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>
              {profileOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center py-4 border-b border-gray-100 last:border-b-0"
                  onPress={option.onPress}
                  activeOpacity={0.7}
                >
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${option.color}15` }}
                  >
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={22}
                      color={option.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium text-base">{option.title}</Text>
                    <Text className="text-gray-500 text-sm">{option.subtitle}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className="mx-6">
            <Button
              mode="contained"
              onPress={handleLogout}
              buttonColor="#EF4444"
              icon="logout"
              contentStyle={{ paddingVertical: 12 }}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
              style={{ borderRadius: 12 }}
            >
              Logout
            </Button>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modals */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      <RestaurantProfileModal
        visible={showRestaurantProfile}
        onClose={() => setShowRestaurantProfile(false)}
      />
    </View>
  );
};

export default FoodDetailsScreen;