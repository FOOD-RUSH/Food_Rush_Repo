import {
  IoniconsIcon,
  MaterialCommunityIcon,
} from '@/src/components/common/icons';
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { RESTAURANT_COLORS } from '@/src/config/restaurantTheme';
import { useAppStore } from '@/src/stores/AppStore';

type Props = RestaurantProfileStackScreenProps<'About'>;

const AboutScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const themeMode = useAppStore((s) => s.theme);
  const isDarkMode = themeMode === 'dark';

  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

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

  const styles = getStyles(isDarkMode, colors);

  return (
    <CommonView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Animated.View
          style={{ opacity: contentAnim, marginTop: 24, alignItems: 'center' }}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[
                RESTAURANT_COLORS.GRADIENT_END,
                RESTAURANT_COLORS.GRADIENT_START,
              ]}
              style={styles.logoBg}
            >
              <MaterialCommunityIcon
                name="silverware-fork-knife"
                size={48}
                color="#fff"
              />
            </LinearGradient>
          </View>
          <Text style={styles.appName}>{t('food_rush', 'Food Rush')}</Text>
          <Text style={styles.tagline}>{t('restaurant_partner_app', 'Restaurant Partner App')}</Text>
          <Text style={styles.version}>{t('version_1_0_0', 'Version 1.0.0')}</Text>
          <Text style={styles.description}>
            {t(
              'food_rush_restaurant_description',
              'Manage your restaurant, track orders, update menus, and grow your business with Food Rush - Cameroon\'s leading food delivery platform.',
            )}
          </Text>
          
          {/* Mission Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('our_mission', 'Our Mission')}</Text>
            <Text style={styles.creditText}>
              {t(
                'mission_statement',
                'To empower restaurants across Cameroon by connecting them with hungry customers through seamless technology and exceptional service.',
              )}
            </Text>
          </View>
          
          {/* Credits Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('credits', 'Credits')}</Text>
            <Text style={styles.creditText}>
              {t('developed_by_food_rush_team', 'Developed by Food Rush Team')}
            </Text>
            <Text style={styles.creditText}>
              {t('copyright_2025', '© 2025 Food Rush. All rights reserved.')}
            </Text>
            <Text style={styles.creditText}>
              {t('made_in_cameroon', 'Made with ❤️ in Cameroon')}
            </Text>
          </View>
          
          {/* Contact Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{t('contact_info', 'Contact Information')}</Text>
            <Text style={styles.creditText}>📧 support@foodrush.cm</Text>
            <Text style={styles.creditText}>📱 +237 672 913 008</Text>
            <Text style={styles.creditText}>🌐 www.foodrush.cm</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};

const getStyles = (isDarkMode: boolean, colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? RESTAURANT_COLORS.BACKGROUND_DARK
        : RESTAURANT_COLORS.BACKGROUND_LIGHT,
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
      color: colors.onPrimary,
      fontSize: 24,
      fontWeight: 'bold',
      flex: 1,
    },
    logoContainer: {
      marginTop: 16,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoBg: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      elevation: 4,
      shadowColor: RESTAURANT_COLORS.PRIMARY,
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
    },
    appName: {
      fontSize: 26,
      fontWeight: 'bold',
      color: RESTAURANT_COLORS.PRIMARY,
      marginTop: 6,
    },
    tagline: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode
        ? RESTAURANT_COLORS.TEXT_SECONDARY_DARK
        : RESTAURANT_COLORS.TEXT_SECONDARY_LIGHT,
      marginTop: 4,
      marginBottom: 8,
    },
    version: {
      fontSize: 15,
      color: isDarkMode
        ? RESTAURANT_COLORS.TEXT_SECONDARY_DARK
        : RESTAURANT_COLORS.TEXT_SECONDARY_LIGHT,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: isDarkMode
        ? RESTAURANT_COLORS.TEXT_DARK
        : RESTAURANT_COLORS.TEXT_LIGHT,
      textAlign: 'center',
      marginHorizontal: 24,
      marginBottom: 24,
    },
    sectionBox: {
      backgroundColor: isDarkMode
        ? RESTAURANT_COLORS.SURFACE_DARK
        : RESTAURANT_COLORS.SURFACE_LIGHT,
      borderRadius: 14,
      padding: 20,
      marginHorizontal: 20,
      marginTop: 18,
      alignItems: 'center',
      shadowColor: RESTAURANT_COLORS.PRIMARY,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: isDarkMode
        ? RESTAURANT_COLORS.BORDER_DARK
        : RESTAURANT_COLORS.BORDER_LIGHT,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: RESTAURANT_COLORS.PRIMARY,
      marginBottom: 10,
    },
    creditText: {
      fontSize: 15,
      color: isDarkMode
        ? RESTAURANT_COLORS.TEXT_DARK
        : RESTAURANT_COLORS.TEXT_LIGHT,
      marginTop: 2,
    },
  });

export default AboutScreen;
