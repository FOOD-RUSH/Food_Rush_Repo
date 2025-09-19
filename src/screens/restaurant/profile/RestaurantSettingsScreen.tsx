import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { RESTAURANT_COLORS } from '@/src/config/restaurantTheme';
import { useAppStore } from '@/src/stores/customerStores';
import RowView from '@/src/components/common/RowView';
import CommonView from '@/src/components/common/CommonView';

// Type for props
// This screen is registered as 'RestaurantSettings' in RestaurantProfileStackParamList
// So use RestaurantProfileStackScreenProps<'RestaurantSettings'>
type Props = RestaurantProfileStackScreenProps<'RestaurantSettings'>;

const RestaurantSettingsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const themeMode = useAppStore((s) => s.theme);
  const isDarkMode = themeMode === 'dark';
  
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const [restaurantName, setRestaurantName] = useState('The Great Eatery');
  const [address, setAddress] = useState('123 Food Street, City');
  const [cuisine, setCuisine] = useState('Italian, American');
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [showOnMap, setShowOnMap] = useState(true);
  const resetApp = useAppStore(state => state.resetApp);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = getStyles(isDarkMode);

  // Navigation handlers
  const navigateToRestaurantInfo = () => {
    // Navigate to restaurant info edit screen
    console.log('Navigate to restaurant info');
  };

  const navigateToBusinessHours = () => {
    // Navigate to business hours screen
    console.log('Navigate to business hours');
  };

  const navigateToDeliverySettings = () => {
    // Navigate to delivery settings screen
    console.log('Navigate to delivery settings');
  };

  const navigateToPaymentSettings = () => {
    // Navigate to payment settings screen
    console.log('Navigate to payment settings');
  };

  const navigateToNotificationSettings = () => {
    // Navigate to notification settings screen
    console.log('Navigate to notification settings');
  };

  const navigateToPrivacySettings = () => {
    // Navigate to privacy settings screen
    console.log('Navigate to privacy settings');
  };

  return (
    <CommonView>
      {/* Animated Gradient Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerAnim }],
        }}
      >
        <LinearGradient
          colors={[RESTAURANT_COLORS.GRADIENT_START, RESTAURANT_COLORS.GRADIENT_END]}
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
          <Text style={styles.headerTitle}>{t('restaurant_settings')}</Text>
          <MaterialCommunityIcons name="store-cog-outline" size={32} color="#fff" style={{ marginLeft: 10 }} />
        </LinearGradient>
      </Animated.View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        className="flex-1 py-3 px-1"
      >
        <Animated.View style={{ opacity: contentAnim, marginTop: 24 }}>
          {/* Restaurant Management Section */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('restaurant_management')}</Text>
          
          <RowView
            title={t('restaurant_information')}
            subtitle={t('update_restaurant_name_address_and_cuisine_type')}
            onPress={navigateToRestaurantInfo}
            leftIconName="storefront-outline"
          />
          
          <RowView
            title={t('business_hours')}
            subtitle={t('set_opening_and_closing_times_for_each_day')}
            onPress={navigateToBusinessHours}
            leftIconName="time-outline"
          />
          
          <RowView
            title={t('delivery_settings')}
            subtitle={t('configure_delivery_zones_and_fees')}
            onPress={navigateToDeliverySettings}
            leftIconName="bicycle-outline"
          />
          
          {/* Divider */}
          <View
            className="h-[1px] mx-1 my-4"
            style={{ backgroundColor: colors.outline }}
          />
          
          {/* Business Settings Section */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('business_settings')}</Text>
          
          <RowView
            title={t('payment_methods')}
            subtitle={t('manage_accepted_payment_options')}
            onPress={navigateToPaymentSettings}
            leftIconName="card-outline"
          />
          
          <RowView
            title={t('notifications')}
            subtitle={t('customize_order_and_business_notifications')}
            onPress={navigateToNotificationSettings}
            leftIconName="notifications-outline"
          />
          
          <RowView
            title={t('privacy_and_security')}
            subtitle={t('manage_data_privacy_and_account_security')}
            onPress={navigateToPrivacySettings}
            leftIconName="shield-checkmark-outline"
          />
          
          {/* Quick Settings Section */}
          <View
            className="h-[1px] mx-1 my-4"
            style={{ backgroundColor: colors.outline }}
          />
          
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('quick_settings')}</Text>
          
          {/* Accepting Orders Toggle */}
          <View className="flex-row justify-between mb-4 items-center px-2 py-2">
            <MaterialCommunityIcons
              name="store-check"
              size={22}
              color={colors.onSurface}
            />
            <View className="flex-1 ml-3">
              <Text
                className="font-semibold text-base"
                style={{ color: colors.onSurface }}
              >
                {t('accepting_orders')}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('allow_customers_to_place_new_orders')}
              </Text>
            </View>
            <Switch
              value={acceptingOrders}
              onValueChange={setAcceptingOrders}
              thumbColor={acceptingOrders ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
          
          {/* Show on Map Toggle */}
          <View className="flex-row justify-between mb-4 items-center px-2 py-2">
            <MaterialCommunityIcons
              name="map-marker-check"
              size={22}
              color={colors.onSurface}
            />
            <View className="flex-1 ml-3">
              <Text
                className="font-semibold text-base"
                style={{ color: colors.onSurface }}
              >
                {t('show_on_map')}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('make_your_restaurant_visible_to_customers')}
              </Text>
            </View>
            <Switch
              value={showOnMap}
              onValueChange={setShowOnMap}
              thumbColor={showOnMap ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
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
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 12,
  },
});

export default RestaurantSettingsScreen;
