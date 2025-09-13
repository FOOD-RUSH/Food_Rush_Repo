import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Dimensions } from 'react-native';
import { useTheme, Card, Avatar, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAccountStackScreenProps } from '@/src/navigation/types';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import RestaurantStatusControl from '@/src/components/restaurant/RestaurantStatusControl';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightComponent?: React.ReactNode;
  color?: string;
  showDivider?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightComponent,
  color = '#007aff',
  showDivider = false
}) => {
  const { colors } = useTheme();

  return (
    <>
      <TouchableOpacity 
        onPress={onPress} 
        style={{ 
          paddingVertical: isSmallScreen ? 14 : 16,
          paddingHorizontal: 4,
        }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: isSmallScreen ? 44 : 48,
              height: isSmallScreen ? 44 : 48,
              borderRadius: isSmallScreen ? 22 : 24,
              backgroundColor: color + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <MaterialCommunityIcons 
              name={icon as any} 
              size={isSmallScreen ? 22 : 24} 
              color={color} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: isSmallScreen ? 16 : 17, 
              fontWeight: '600', 
              color: colors.onSurface,
              marginBottom: subtitle ? 2 : 0,
            }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{ 
                fontSize: isSmallScreen ? 13 : 14, 
                color: colors.onSurfaceVariant,
                lineHeight: 18,
              }}>
                {subtitle}
              </Text>
            )}
          </View>
          {rightComponent || (showChevron && (
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.onSurfaceVariant}
            />
          ))}
        </View>
      </TouchableOpacity>
      {showDivider && (
        <Divider style={{ marginLeft: isSmallScreen ? 60 : 64, marginVertical: 4 }} />
      )}
    </>
  );
};

const AccountHome: React.FC<RestaurantAccountStackScreenProps<'AccountHome'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useAuthUser();
  
  const [restaurantStatus, setRestaurantStatus] = useState<'online' | 'offline' | 'busy'>('offline');

  // Mock restaurant data - replace with actual data from store/API
  const restaurantData = {
    name: user?.restaurantName || 'Chez Marie Restaurant',
    email: user?.email || 'marie@chezmarierestaurant.cm',
    phone: user?.phoneNumber || '+237 6XX XXX XXX',
    address: user?.address || 'Douala, Cameroon',
    cuisine: 'African, Continental',
    rating: 4.5,
    totalOrders: 1247,
    joinDate: user?.joinDate || 'January 2024',
    profileImage: null,
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('logout'),
      t('are_you_sure_logout'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('logout'), 
          style: 'destructive', 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log('User logged out');
          }
        },
      ]
    );
  };

  const handleStatusChange = (status: 'online' | 'offline' | 'busy') => {
    setRestaurantStatus(status);
  };

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header - Clean and modern */}
        <View className={`${isSmallScreen ? 'px-4 pt-4 pb-6' : 'px-6 pt-6 pb-8'} items-center`}>
          <Avatar.Text
            size={isSmallScreen ? 80 : 90}
            label={user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : restaurantData.name.charAt(0)}
            style={{ backgroundColor: '#007aff', marginBottom: 16 }}
            labelStyle={{ fontSize: isSmallScreen ? 28 : 32, fontWeight: 'bold' }}
          />
          
          <Text 
            className={`${isSmallScreen ? 'text-xl' : 'text-2xl'} font-bold text-center mb-2`}
            style={{ color: colors.onSurface }}
          >
            {user?.fullName || restaurantData.name}
          </Text>
          
          <Text 
            className={`${isSmallScreen ? 'text-base' : 'text-lg'} text-center mb-1`}
            style={{ color: colors.onSurfaceVariant }}
          >
            {restaurantData.name}
          </Text>
          
          <Text 
            className={`${isSmallScreen ? 'text-sm' : 'text-base'} text-center mb-4`}
            style={{ color: colors.onSurfaceVariant }}
          >
            {restaurantData.email}
          </Text>

          {/* Quick Stats */}
          <View className="flex-row items-center space-x-6">
            <View className="items-center">
              <View className="flex-row items-center mb-1">
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text 
                  className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-bold ml-1`}
                  style={{ color: colors.onSurface }}
                >
                  {restaurantData.rating}
                </Text>
              </View>
              <Text 
                className={`${isSmallScreen ? 'text-xs' : 'text-sm'}`}
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('rating')}
              </Text>
            </View>
            
            <View className="items-center">
              <Text 
                className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-bold mb-1`}
                style={{ color: colors.onSurface }}
              >
                {restaurantData.totalOrders}
              </Text>
              <Text 
                className={`${isSmallScreen ? 'text-xs' : 'text-sm'}`}
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('orders')}
              </Text>
            </View>
          </View>
        </View>

        {/* Restaurant Status Control */}
        <View className={`${isSmallScreen ? 'mx-4 mb-4' : 'mx-6 mb-6'}`}>
          <RestaurantStatusControl
            currentStatus={restaurantStatus}
            onStatusChange={handleStatusChange}
            showAsCard={true}
            compact={false}
          />
        </View>

        {/* Restaurant Management Section */}
        <Card 
          className={`${isSmallScreen ? 'mx-4 mb-4' : 'mx-6 mb-6'}`}
          style={{ backgroundColor: colors.surface, borderRadius: 16 }}
        >
          <View className={`${isSmallScreen ? 'p-4' : 'p-5'}`}>
            <Text 
              className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold mb-4`}
              style={{ color: colors.onSurface }}
            >
              {t('restaurant_management')}
            </Text>
            
            <MenuItem
              icon="store-edit"
              title={t('edit_profile')}
              subtitle={t('update_restaurant_information')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantEditProfile');
              }}
              color="#007aff"
              showDivider
            />
            
            <MenuItem
              icon="map-marker-outline"
              title={t('restaurant_location')}
              subtitle={t('manage_address_delivery_zones')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantLocation');
              }}
              color="#00D084"
              showDivider
            />
            
            <MenuItem
              icon="credit-card-outline"
              title={t('payment_billing')}
              subtitle={t('manage_payment_methods_billing')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantPaymentBilling');
              }}
              color="#FF6B35"
            />
          </View>
        </Card>

        {/* App Settings Section */}
        <Card 
          className={`${isSmallScreen ? 'mx-4 mb-4' : 'mx-6 mb-6'}`}
          style={{ backgroundColor: colors.surface, borderRadius: 16 }}
        >
          <View className={`${isSmallScreen ? 'p-4' : 'p-5'}`}>
            <Text 
              className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold mb-4`}
              style={{ color: colors.onSurface }}
            >
              {t('app_settings')}
            </Text>
            
            <MenuItem
              icon="bell-outline"
              title={t('notifications')}
              subtitle={t('manage_notification_preferences')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantNotifications');
              }}
              color="#8B5CF6"
              showDivider
            />
            
            <MenuItem
              icon="palette-outline"
              title={t('appearance_language')}
              subtitle={t('theme_language_preferences')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantThemeSettings');
              }}
              color="#FF9500"
              showDivider
            />
            
            <MenuItem
              icon="cog-outline"
              title={t('account_settings')}
              subtitle={t('privacy_security_settings')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantSettings');
              }}
              color="#6B7280"
            />
          </View>
        </Card>

        {/* Support & Information Section */}
        <Card 
          className={`${isSmallScreen ? 'mx-4 mb-6' : 'mx-6 mb-8'}`}
          style={{ backgroundColor: colors.surface, borderRadius: 16 }}
        >
          <View className={`${isSmallScreen ? 'p-4' : 'p-5'}`}>
            <Text 
              className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold mb-4`}
              style={{ color: colors.onSurface }}
            >
              {t('support_information')}
            </Text>
            
            <MenuItem
              icon="help-circle-outline"
              title={t('help_support')}
              subtitle={t('faq_contact_support_team')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantSupport');
              }}
              color="#007aff"
              showDivider
            />
            
            <MenuItem
              icon="information-outline"
              title={t('about')}
              subtitle={t('app_version_terms_privacy')}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantAbout');
              }}
              color="#6B7280"
            />
          </View>
        </Card>

        {/* Logout Button */}
        <View className={`${isSmallScreen ? 'px-4' : 'px-6'}`}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={{
              backgroundColor: '#FF3B30',
              borderRadius: 12,
              paddingVertical: isSmallScreen ? 4 : 6,
            }}
            contentStyle={{
              paddingVertical: isSmallScreen ? 8 : 10,
            }}
            labelStyle={{
              fontSize: isSmallScreen ? 16 : 17,
              fontWeight: '600',
              color: 'white',
            }}
            icon="logout"
          >
            {t('logout')}
          </Button>
          
          <Text 
            className={`text-center ${isSmallScreen ? 'text-xs' : 'text-sm'} mt-4`}
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('version')} 1.0.0
          </Text>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AccountHome;