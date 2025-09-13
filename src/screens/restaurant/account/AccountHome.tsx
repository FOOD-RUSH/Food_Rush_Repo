import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme, Card, Avatar, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAccountStackScreenProps } from '@/src/navigation/types';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightComponent?: React.ReactNode;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightComponent,
  color = '#007aff'
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={{ paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color + '15',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <MaterialCommunityIcons name={icon as any} size={20} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: colors.onSurface }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 }}>
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
  );
};

const AccountHome: React.FC<RestaurantAccountStackScreenProps<'AccountHome'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [isOnline, setIsOnline] = useState(true);

  // Mock restaurant data - replace with actual data from store/API
  const restaurantData = {
    name: 'Chez Marie Restaurant',
    email: 'marie@chezmarierestaurant.cm',
    phone: '+237 6XX XXX XXX',
    address: 'Douala, Cameroon',
    cuisine: 'African, Continental',
    rating: 4.5,
    totalOrders: 1247,
    joinDate: 'January 2024',
    profileImage: null,
  };

  const handleProfilePress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantProfile');
  };

  const handleLocationPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantLocation');
  };

  const handleThemeSettingsPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantThemeSettings');
  };

  const handleSettingsPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantSettings');
  };

  const handleSupportPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantSupport');
  };

  const handleAboutPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantAbout');
  };

  const toggleOnlineStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOnline(!isOnline);
  };

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.onBackground }}>
            {t('account')}
          </Text>
          <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 }}>
            {t('manage_your_restaurant')}
          </Text>
        </View>

        {/* Restaurant Profile Card */}
        <Card style={{ margin: 16, backgroundColor: colors.surface }}>
          <TouchableOpacity onPress={handleProfilePress} style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Text
                size={60}
                label={restaurantData.name.charAt(0)}
                style={{ backgroundColor: '#007aff' }}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface }}>
                  {restaurantData.name}
                </Text>
                <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 }}>
                  {restaurantData.cuisine}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginLeft: 4 }}>
                    {restaurantData.rating} • {restaurantData.totalOrders} {t('orders')}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.onSurfaceVariant}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Online Status */}
        <Card style={{ margin: 16, marginTop: 0, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: isOnline ? '#00C851' : '#FF4444',
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.onSurface }}>
                  {isOnline ? t('restaurant_online') : t('restaurant_offline')}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={toggleOnlineStatus}
                trackColor={{ false: '#767577', true: '#007aff' }}
                thumbColor={isOnline ? '#ffffff' : '#f4f3f4'}
              />
            </View>
            <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 4 }}>
              {isOnline ? t('accepting_orders') : t('not_accepting_orders')}
            </Text>
          </View>
        </Card>

        {/* Restaurant Management */}
        <Card style={{ margin: 16, marginTop: 0, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 12 }}>
              {t('restaurant_management')}
            </Text>
            
            <MenuItem
              icon="store"
              title={t('restaurant_profile')}
              subtitle={t('business_info_settings')}
              onPress={handleProfilePress}
              color="#007aff"
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <MenuItem
              icon="map-marker"
              title={t('restaurant_location')}
              subtitle={t('address_delivery_settings')}
              onPress={handleLocationPress}
              color="#00C851"
            />
          </View>
        </Card>

        {/* App Settings */}
        <Card style={{ margin: 16, marginTop: 0, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 12 }}>
              {t('app_settings')}
            </Text>
            
            <MenuItem
              icon="palette"
              title={t('theme_language_settings')}
              subtitle={t('appearance_language_preferences')}
              onPress={handleThemeSettingsPress}
              color="#8B5CF6"
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <MenuItem
              icon="cog"
              title={t('app_settings')}
              subtitle={t('notifications_other_preferences')}
              onPress={handleSettingsPress}
              color="#FF8800"
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <MenuItem
              icon="help-circle"
              title={t('help_support')}
              subtitle={t('faq_contact_support')}
              onPress={handleSupportPress}
              color="#007aff"
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <MenuItem
              icon="information"
              title={t('about')}
              subtitle={t('app_version_terms')}
              onPress={handleAboutPress}
              color="#6B7280"
            />
          </View>
        </Card>



        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </CommonView>
  );
};

export default AccountHome;