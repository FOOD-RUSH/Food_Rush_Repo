import { useTranslation } from 'react-i18next';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView, View } from 'react-native';
import SocialCards from '@/src/components/common/SocialCards';
import { useTheme } from 'react-native-paper';
import { Typography, Heading4, Body } from '@/src/components/common/Typography';
import { useResponsive } from '@/src/hooks/useResponsive';

// Enhanced social data with proper contact options for Food Rush
const getContactData = (t: any) => [
  {
    id: 1,
    icon_name: 'headset-outline' as const,
    social_platform: t('customer_service', 'Customer Service'),
    link: 'tel:+237690000000', // Food Rush customer service phone
    description: t(
      'call_support',
      'Call our support team for immediate assistance',
    ),
  },
  {
    id: 2,
    icon_name: 'logo-whatsapp' as const,
    social_platform: t('whatsapp', 'WhatsApp'),
    link: 'https://wa.me/237690000000', // Food Rush WhatsApp
    description: t(
      'whatsapp_support',
      'Chat with us on WhatsApp for quick help',
    ),
  },
  {
    id: 3,
    icon_name: 'mail-outline' as const,
    social_platform: t('email', 'Email'),
    link: 'mailto:support@foodrush.cm',
    description: t('email_support', 'Send us an email for detailed inquiries'),
  },
  {
    id: 4,
    icon_name: 'globe-outline' as const,
    social_platform: t('website', 'Website'),
    link: 'https://foodrush.cm',
    description: t('visit_website', 'Visit our website for more information'),
  },
  {
    id: 5,
    icon_name: 'logo-facebook' as const,
    social_platform: t('facebook', 'Facebook'),
    link: 'https://facebook.com/foodrushcm',
    description: t('facebook_page', 'Follow us on Facebook for updates'),
  },
  {
    id: 6,
    icon_name: 'logo-instagram' as const,
    social_platform: t('instagram', 'Instagram'),
    link: 'https://instagram.com/foodrushcm',
    description: t(
      'instagram_page',
      'Follow us on Instagram for food inspiration',
    ),
  },
];

const ContactUs = () => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const { scale } = useResponsive();

  const contactData = getContactData(t);

  return (
    <CommonView>
      {/* Header */}
      <View
        className="px-4 pt-10 border-b"
        style={{ borderBottomColor: colors.outline + '30' }}
      >
        <Heading4
          color={colors.onSurface}
          weight="bold"
          style={{ marginBottom: 8 }}
        >
          {t('contact_us', 'Contact Us')}
        </Heading4>
        <Body color={colors.onSurfaceVariant}>
          {t(
            'contact_subtitle',
            "Get in touch with our support team. We're here to help!",
          )}
        </Body>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ paddingBottom: scale(20) }}
      >
        {/* Support Hours Info */}
        <View
          className="mb-6 p-4 rounded-xl"
          style={{
            backgroundColor: colors.primaryContainer || colors.primary + '20',
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: colors.primary,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            {t('support_hours', 'Support Hours')}
          </Typography>
          <Body
            color={colors.onPrimaryContainer || colors.primary}
            style={{ lineHeight: 20 }}
          >
            {t('support_schedule', 'Monday - Sunday: 6:00 AM - 11:00 PM (WAT)')}
          </Body>
        </View>

        {/* Contact Options */}
        {contactData.map((data) => (
          <SocialCards
            key={data.id}
            id={data.id}
            icon_name={data.icon_name}
            social_platform={data.social_platform}
            link={data.link}
          />
        ))}

        {/* Emergency Contact */}
        <View
          className="mt-6 p-4 rounded-xl"
          style={{
            backgroundColor: colors.errorContainer || colors.error + '20',
          }}
        >
          <Typography
            variant="h6"
            style={{ color: colors.error, fontWeight: 'bold', marginBottom: 8 }}
          >
            {t('emergency_contact', 'Emergency Contact')}
          </Typography>
          <Body
            color={colors.onErrorContainer || colors.error}
            style={{ lineHeight: 20 }}
          >
            {t(
              'emergency_info',
              'For urgent delivery issues or safety concerns, call our 24/7 emergency line: +237 690 000 001',
            )}
          </Body>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ContactUs;
