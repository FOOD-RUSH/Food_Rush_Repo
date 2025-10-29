import { IoniconsIcon } from '@/src/components/common/icons';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';

import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface SocialCardsProps {
  id: number;
  icon_name: keyof IoniconsIconName;
  social_platform: string;
  link?: string;
}

const SocialCards = ({
  id,
  icon_name,
  social_platform,
  link,
}: SocialCardsProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const handlePress = async () => {
    if (!link) {
      Alert.alert(t('info'), t('contact_info_not_available'));
      return;
    }

    try {
      // Special handling for phone calls
      if (link.startsWith('tel:')) {
        const phoneNumber = link.replace('tel:', '');

        // Show confirmation dialog for phone calls
        Alert.alert(
          t('make_phone_call'),
          t('call_confirmation', { phoneNumber }),
          [
            {
              text: t('cancel'),
              style: 'cancel',
            },
            {
              text: t('call'),
              onPress: async () => {
                try {
                  // Check if the device can make phone calls
                  const canCall = await Linking.canOpenURL(link);

                  if (canCall) {
                    await Linking.openURL(link);
                  } else {
                    // Fallback: try alternative phone URL schemes
                    const alternativeLink =
                      Platform.OS === 'ios'
                        ? `telprompt:${phoneNumber}`
                        : `tel:${phoneNumber}`;

                    const canCallAlternative =
                      await Linking.canOpenURL(alternativeLink);

                    if (canCallAlternative) {
                      await Linking.openURL(alternativeLink);
                    } else {
                      Alert.alert(t('error'), t('phone_not_supported'));
                    }
                  }
                } catch (callError) {
                  console.error('Error making phone call:', callError);
                  Alert.alert(t('error'), t('call_failed'));
                }
              },
            },
          ],
          { cancelable: true },
        );
        return;
      }

      // Handle other links (WhatsApp, websites, etc.)
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert(
          t('error'),
          t('cannot_open_link', { platform: social_platform }),
        );
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert(
        t('error'),
        t('failed_to_open_link', { platform: social_platform }),
      );
    }
  };

  return (
    <Card
      mode="outlined"
      className="mb-3"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.outline,
        boxShadow: '2px 0px 3px rgba(0, 0, 0, 0.15)',
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        className="p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: colors.primaryContainer }}
          >
            <IoniconsIcon name={icon_name} color={colors.primary} size={24} />
          </View>

          <View className="flex-1">
            <Text
              className="text-lg font-semibold"
              style={{ color: colors.onSurface }}
            >
              {social_platform}
            </Text>
            {social_platform === 'Customer Service' && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('tap_to_call_support')}
              </Text>
            )}
            {social_platform === 'WhatsApp' && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('chat_with_us')}
              </Text>
            )}
            {social_platform === 'Email' && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('email_support')}
              </Text>
            )}
            {['Website', 'Facebook', 'Twitter', 'Instagram'].includes(
              social_platform,
            ) && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('visit_our')}
                {social_platform?.toLowerCase() || ''}
              </Text>
            )}
          </View>

          <IoniconsIcon
            name="chevron-forward"
            size={20}
            color={colors.onSurfaceVariant}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default SocialCards;
