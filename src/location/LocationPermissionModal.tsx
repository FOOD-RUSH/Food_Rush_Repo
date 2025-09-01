import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface LocationPermissionModalProps {
  visible: boolean;
  onRequestPermission: () => Promise<void>;
  onDeny: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * Performance optimized location permission modal
 * Early returns when not visible to prevent unnecessary renders
 */
export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  visible,
  onRequestPermission,
  onDeny,
  onClose,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const benefits = [
    {
      icon: 'restaurant-outline' as const,
      title: t('find_nearby_restaurants', 'Find nearby restaurants'),
      description: t('discover_closest_restaurants', 'Discover the restaurants closest to your current location'),
    },
    {
      icon: 'time-outline' as const,
      title: t('accurate_delivery_times', 'Accurate delivery times'),
      description: t('precise_delivery_estimates', 'Get precise delivery estimates based on your exact location'),
    },
    {
      icon: 'navigate-outline' as const,
      title: t('personalized_experience', 'Personalized experience'),
      description: t('see_local_menus_offers', 'See menus and offers available in your area'),
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.backdrop }]}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.outline }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View
                style={[styles.iconBackground, { backgroundColor: colors.primaryContainer }]}
              >
                <Ionicons name="location" size={48} color={colors.primary} />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.onSurface }]}>
              {t('enable_location_services', 'Enable Location Services')}
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              {t('why_we_need_location', 'Why we need your location:')}
            </Text>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={[styles.benefitIcon, { backgroundColor: colors.primaryContainer }]}>
                    <Ionicons
                      name={benefit.icon}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={[styles.benefitTitle, { color: colors.onSurface }]}>
                      {benefit.title}
                    </Text>
                    <Text style={[styles.benefitDescription, { color: colors.onSurfaceVariant }]}>
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Privacy Assurance */}
            <View style={[styles.privacyContainer, { backgroundColor: colors.surfaceVariant }]}>
              <View style={styles.privacyHeader}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.privacyTitle, { color: colors.onSurfaceVariant }]}>
                  {t('privacy_protected', 'Your privacy is protected')}
                </Text>
              </View>
              <Text style={[styles.privacyText, { color: colors.onSurfaceVariant }]}>
                {t('location_privacy_notice', 'We only use your location to improve your food delivery experience. Your data is never shared with third parties without your consent.')}
              </Text>
            </View>

            {/* Help Text */}
            <Text style={[styles.helpText, { color: colors.onSurfaceVariant }]}>
              {t('location_settings_notice', 'You can change location permissions at any time in your device settings')}
            </Text>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.outline }]}>
            <Button
              mode="outlined"
              onPress={onDeny}
              style={styles.secondaryButton}
              disabled={isLoading}
            >
              {t('use_default_location', 'Use default location (Yaoundé)')}
            </Button>
            <Button
              mode="contained"
              onPress={onRequestPermission}
              style={styles.primaryButton}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading
                ? t('requesting_access', 'Requesting access...')
                : t('allow_location_access', 'Allow location access')
              }
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

LocationPermissionModal.displayName = 'LocationPermissionModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  privacyContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18,
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'column',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  secondaryButton: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
  },
});

interface LocationStatusProps {
  location: { city: string; region: string; isFallback: boolean } | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

/**
 * Optimized location status indicator
 */
export const LocationStatus: React.FC<LocationStatusProps> = React.memo(({
  location,
  isLoading,
  error,
  hasPermission,
}) => {
  const { colors } = useTheme();

  // Memoize status calculation
  const statusInfo = useMemo(() => {
    if (isLoading) {
      return {
        color: colors.primary,
        text: 'Obtention de la localisation...',
        dotColor: colors.primary,
      };
    }

    if (error && !location) {
      return {
        color: colors.onSurfaceVariant,
        text: 'Erreur de localisation',
        dotColor: '#ef4444',
      };
    }

    if (!hasPermission && !location) {
      return {
        color: colors.onSurfaceVariant,
        text: 'Accès à la localisation nécessaire',
        dotColor: '#9ca3af',
      };
    }

    if (location) {
      return {
        color: colors.onSurfaceVariant,
        text: location.isFallback
          ? 'Localisation par défaut'
          : `${location.city}, ${location.region}`,
        dotColor: location.isFallback ? '#f59e0b' : '#10b981',
      };
    }

    return null;
  }, [isLoading, error, location, hasPermission, colors]);

  if (!statusInfo) return null;

  return (
    <View className="flex-row items-center">
      <View
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: statusInfo.dotColor }}
      />
      <Text className="text-xs" style={{ color: statusInfo.color }}>
        {statusInfo.text}
      </Text>
    </View>
  );
});

LocationStatus.displayName = 'LocationStatus';

interface LocationRefreshButtonProps {
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Optimized location refresh button
 */
export const LocationRefreshButton: React.FC<LocationRefreshButtonProps> = React.memo(({
  onRefresh,
  isLoading = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className={`p-2 rounded-full ${isLoading ? 'opacity-50' : ''}`}
      style={{ backgroundColor: colors.primary }}
      onPress={onRefresh}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isLoading ? 'hourglass-outline' : 'refresh-outline'}
        size={20}
        color="white"
      />
    </TouchableOpacity>
  );
});

LocationRefreshButton.displayName = 'LocationRefreshButton';
