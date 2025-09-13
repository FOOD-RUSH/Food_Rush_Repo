import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface SocialCardsProps {
  id: number;
  icon_name: keyof typeof Ionicons.glyphMap;
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
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert(t('error'), `${t('cannot_open')}${social_platform}`);
      }
    } catch (error) {
      Alert.alert(t('error'), `${t('failed_to_open')}${social_platform}`);
      console.error('Error opening link:', error);
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
            <Ionicons name={icon_name} color={colors.primary} size={24} />
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
            {['Website', 'Facebook', 'Twitter', 'Instagram'].includes(
              social_platform,
            ) && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('visit_our')}
                {social_platform.toLowerCase()}
              </Text>
            )}
          </View>

          <Ionicons
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
