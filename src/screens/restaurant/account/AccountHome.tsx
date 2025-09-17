import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme, Card, Avatar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAccountStackScreenProps } from '@/src/navigation/types';
import { useUser, useAuthActions } from '@/src/stores/customerStores/AuthStore';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, color }) => {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 16,
        paddingHorizontal: 16,
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: iconColor + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        <MaterialCommunityIcons 
          name={icon as any} 
          size={20} 
          color={iconColor} 
        />
      </View>
      <Text style={{ 
        flex: 1,
        fontSize: 16, 
        fontWeight: '500', 
        color: colors.onSurface,
      }}>
        {title}
      </Text>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
};

const AccountHome: React.FC<RestaurantAccountStackScreenProps<'AccountHome'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const user = useUser();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('are_you_sure_logout'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('logout'), 
          style: 'destructive', 
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              console.log('Initiating logout...');
              await logout();
              console.log('Logout completed successfully');
            } catch (error) {
              console.error('Logout error:', error);
              // Force logout even if it fails
              try {
                await logout();
              } catch (retryError) {
                console.error('Retry logout also failed:', retryError);
              }
            }
          }
        },
      ]
    );
  };

  // Get display name and email with fallbacks
  const displayName = user?.fullName || user?.restaurantName || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const avatarLabel = user?.fullName 
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const menuItems = [
    {
      icon: 'account-edit',
      title: t('edit_profile'),
      onPress: () => navigation.navigate('RestaurantEditProfile'),
      color: colors.primary,
    },
    {
      icon: 'map-marker-outline',
      title: t('restaurant_location'),
      onPress: () => navigation.navigate('RestaurantLocation'),
      color: '#00D084',
    },
    {
      icon: 'credit-card-outline',
      title: t('payment_billing'),
      onPress: () => navigation.navigate('RestaurantPaymentBilling'),
      color: '#FF6B35',
    },
    {
      icon: 'bell-outline',
      title: t('notifications'),
      onPress: () => navigation.navigate('RestaurantNotifications'),
      color: '#8B5CF6',
    },
    {
      icon: 'palette-outline',
      title: t('appearance_language'),
      onPress: () => navigation.navigate('RestaurantThemeSettings'),
      color: '#FF9500',
    },
    {
      icon: 'cog-outline',
      title: t('settings'),
      onPress: () => navigation.navigate('RestaurantSettings'),
      color: colors.onSurfaceVariant,
    },
    {
      icon: 'help-circle-outline',
      title: t('help_support'),
      onPress: () => navigation.navigate('RestaurantSupport'),
      color: colors.primary,
    },
    {
      icon: 'information-outline',
      title: t('about'),
      onPress: () => navigation.navigate('RestaurantAbout'),
      color: colors.onSurfaceVariant,
    },
  ];

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Avatar.Text
            size={80}
            label={avatarLabel}
            style={{ backgroundColor: colors.primary, marginBottom: 16 }}
            labelStyle={{ fontSize: 28, fontWeight: 'bold' }}
          />
          
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: colors.onSurface,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {displayName}
          </Text>
          
          <Text style={{ 
            fontSize: 16, 
            color: colors.onSurfaceVariant,
            textAlign: 'center',
          }}>
            {displayEmail}
          </Text>

          {/* User Role Badge */}
          <View style={{
            backgroundColor: colors.primaryContainer,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            marginTop: 8,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.onPrimaryContainer,
              textTransform: 'capitalize',
            }}>
              {user?.role || 'User'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <Card style={{ 
          backgroundColor: colors.surface, 
          marginHorizontal: 16,
          marginBottom: 24,
          borderRadius: 12,
        }}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
              color={item.color}
            />
          ))}
        </Card>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 16 }}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={{
              backgroundColor: colors.error,
              borderRadius: 8,
            }}
            contentStyle={{
              paddingVertical: 8,
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: 'white',
            }}
            icon="logout"
          >
            {t('logout')}
          </Button>
          
          <Text style={{
            textAlign: 'center',
            fontSize: 12,
            color: colors.onSurfaceVariant,
            marginTop: 16,
          }}>
            {t('version')} 1.0.0
          </Text>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AccountHome;
