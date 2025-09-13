import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Avatar, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';

type ProfileScreenProps = RestaurantProfileStackScreenProps<'ProfileScreen'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const user = useAuthUser(); // ✅ Use AuthStore
  const {colors} = useTheme()

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
      title: t('notifications'),
      subtitle: t('view_manage_notifications'),
      icon: 'bell-outline' as const,
      onPress: () => navigation.navigate('Notification'),
    },
      {
      title: t('account_settings'),
      subtitle: t('account_settings'),
      icon: 'setting' as const,
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

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
    ]);
  };

  return (
    <CommonView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.profileHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Avatar.Text
            size={80}
            label={user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : ''}
            style={[styles.avatar,{} ]}
          />
          <Text style={[styles.userName, {color: colors.onSurface}]}>{user?.fullName || ''}</Text>
          <Text style={[styles.restaurantName,  {color: colors.onSurface}]}>{user?.restaurantName || ''}</Text>
          <Text style={[styles.userEmail,  {color: colors.onSurface}]}>{user?.email || ''}</Text>
        </Animated.View>

        <Animated.View style={[styles.profileInfo, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#666" />
            <Text style={[styles.infoText, {color: colors.onSurface}]}>{user?.phoneNumber || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <Text style={[styles.infoText, {color: colors.onBackground}]}>{user?.address || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <Text style={[styles.infoText, {color: colors.onBackground}]}>{t('member_since')} {user?.joinDate || ''}</Text>
          </View>
        </Animated.View>

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
              <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View style={[styles.logoutContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} buttonColor="#007aff" icon="logout">
            <Text style={{color: 'white'}}>Logout</Text>
          </Button>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
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
