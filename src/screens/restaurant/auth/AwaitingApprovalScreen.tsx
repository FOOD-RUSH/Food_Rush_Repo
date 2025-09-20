import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/AuthStore';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { images } from '@/assets/images';
import { Heading1, Heading2, Body, BodySmall, Label } from '@/src/components/common/Typography';

interface AwaitingApprovalScreenProps extends AuthStackScreenProps<'AwaitingApproval'> {}

const AwaitingApprovalScreen: React.FC<AwaitingApprovalScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);

  const { restaurantId, userId } = route.params || {};

  const handleLogout = useCallback(async () => {
    Alert.alert(
      t('logout'),
      t('are_you_sure_logout'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.getParent()?.navigate('Onboarding');
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('failed_to_logout'),
                position: 'top',
              });
            }
          },
        },
      ],
    );
  }, [logout, navigation, t]);

  const handleRefresh = useCallback(async () => {
    Toast.show({
      type: 'info',
      text1: t('checking_status'),
      text2: t('refreshing_approval_status'),
      position: 'top',
    });

    // Simulate API call
    setTimeout(() => {
      Toast.show({
        type: 'info',
        text1: t('status_update'),
        text2: t('still_under_review'),
        position: 'top',
      });
    }, 1500);
  }, [t]);

  const handleContactSupport = useCallback(() => {
    // Navigate to support or open email
    Toast.show({
      type: 'info',
      text1: t('contact_support'),
      text2: t('support_will_contact_you'),
      position: 'top',
    });
  }, [t]);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <CommonView>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Professional Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={images.onboarding3}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Heading1 color={colors.onSurface} weight="bold" align="center" style={{ marginBottom: 12 }}>{t('application_under_review')}</Heading1>
            <Body color={colors.onSurfaceVariant} align="center" style={{ lineHeight: 24 }}>
              {t('review_process_description')}
            </Body>
          </View>

          {/* Status Steps */}
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepIcon, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={20} color="white" />
              </View>
              <View style={styles.stepContent}>
                <Label color={colors.onSurface} weight="semibold" style={{ marginBottom: 4 }}>{t('application_submitted')}</Label>
                <BodySmall color={colors.onSurfaceVariant} style={{ lineHeight: 20 }}>
                  {t('application_submitted_description')}
                </BodySmall>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.step}>
              <View style={[styles.stepIcon, styles.stepActive]}>
                <Ionicons name="time" size={20} color="white" />
              </View>
              <View style={styles.stepContent}>
                <Label color={colors.onSurface} weight="semibold" style={{ marginBottom: 4 }}>{t('under_review')}</Label>
                <BodySmall color={colors.onSurfaceVariant} style={{ lineHeight: 20 }}>
                  {t('under_review_description')}
                </BodySmall>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.step}>
              <View style={[styles.stepIcon, styles.stepPending]}>
                <Ionicons name="mail" size={20} color={colors.onSurfaceVariant} />
              </View>
              <View style={styles.stepContent}>
                <Label color={colors.onSurface} weight="semibold" style={{ marginBottom: 4 }}>{t('approval_notification')}</Label>
                <BodySmall color={colors.onSurfaceVariant} style={{ lineHeight: 20 }}>
                  {t('approval_notification_description')}
                </BodySmall>
              </View>
            </View>
          </View>

          {/* Info Card */}
          {(restaurantId || userId) && (
            <View style={styles.infoCard}>
              <Heading2 color={colors.onSurface} weight="semibold" align="center" style={{ marginBottom: 16 }}>{t('application_details')}</Heading2>
              {restaurantId && (
                <View style={styles.infoRow}>
                  <Ionicons name="business" size={18} color={colors.primary} />
                  <Label color={colors.onSurfaceVariant} weight="medium" style={{ flex: 1, marginLeft: 12 }}>{t('restaurant_id')}</Label>
                  <BodySmall color={colors.onSurface} weight="medium" style={{ fontFamily: 'monospace' }}>{restaurantId}</BodySmall>
                </View>
              )}
              {userId && (
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={18} color={colors.primary} />
                  <Label color={colors.onSurfaceVariant} weight="medium" style={{ flex: 1, marginLeft: 12 }}>{t('user_id')}</Label>
                  <BodySmall color={colors.onSurface} weight="medium" style={{ fontFamily: 'monospace' }}>{userId}</BodySmall>
                </View>
              )}
            </View>
          )}

          {/* Expected Timeline */}
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Label color={colors.onPrimaryContainer} weight="semibold" style={{ marginLeft: 12 }}>{t('expected_timeline')}</Label>
            </View>
            <BodySmall color={colors.onPrimaryContainer} style={{ lineHeight: 20, opacity: 0.8 }}>
              {t('review_timeline_description')}
            </BodySmall>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleRefresh}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Label color="white" weight="semibold">{t('check_status')}</Label>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
              <Label color={colors.primary} weight="semibold">{t('contact_support')}</Label>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    illustrationContainer: {
      width: '100%',
      height: 200,
      marginTop: 20,
      marginBottom: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    illustration: {
      width: '80%',
      height: '100%',
    },
    titleSection: {
      alignItems: 'center',
      marginBottom: 40,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 24,
    },
    stepsContainer: {
      width: '100%',
      marginBottom: 32,
    },
    step: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 4,
    },
    stepIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    stepCompleted: {
      backgroundColor: colors.primary,
    },
    stepActive: {
      backgroundColor: colors.secondary,
    },
    stepPending: {
      backgroundColor: colors.surfaceVariant,
    },
    stepContent: {
      flex: 1,
      paddingBottom: 8,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 4,
    },
    stepDescription: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      lineHeight: 20,
    },
    stepConnector: {
      width: 2,
      height: 24,
      backgroundColor: colors.outline,
      marginLeft: 23,
      marginVertical: 8,
    },
    infoCard: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: colors.onSurfaceVariant,
      marginLeft: 12,
    },
    infoValue: {
      fontSize: 14,
      color: colors.onSurface,
      fontFamily: 'monospace',
      fontWeight: '500',
    },
    timelineCard: {
      width: '100%',
      backgroundColor: colors.primaryContainer,
      borderRadius: 16,
      padding: 20,
      marginBottom: 32,
    },
    timelineHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    timelineTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onPrimaryContainer,
      marginLeft: 12,
    },
    timelineText: {
      fontSize: 14,
      color: colors.onPrimaryContainer,
      lineHeight: 20,
      opacity: 0.8,
    },
    actionSection: {
      width: '100%',
      gap: 12,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      elevation: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
  });

export default AwaitingApprovalScreen;
