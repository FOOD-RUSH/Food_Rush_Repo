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
    link: 'tel:+237672913008', // Food Rush customer service phone
    description: t(
      'call_support',
      'Call our support team for immediate assistance',
    ),
  },
  {
    id: 2,
    icon_name: 'logo-whatsapp' as const,
    social_platform: t('whatsapp', 'WhatsApp'),
    link: 'https://wa.me/237672913008', // Food Rush WhatsApp (removed + for better compatibility)
    description: t(
      'whatsapp_support',
      'Chat with us on WhatsApp for quick help',
    ),
  },
  {
    id: 3,
    icon_name: 'mail-outline' as const,
    social_platform: t('email', 'Email'),
    link: 'mailto:support@foodrush.cm', // Food Rush support email
    description: t(
      'email_support',
      'Send us an email for detailed inquiries',
    ),
  }];

const ContactUs = () => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const { scale } = useResponsive();

  const contactData = getContactData(t);

  return (
    <CommonView>
      {/* Header */}
    

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ paddingBottom: scale(20) }}
      >
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
            style={{ lineHeight: 23 }}
          >
            {t('support_schedule', 'Monday - Saturdays: 10:00 AM - 7:00 PM (WAT)')}
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

     
      </ScrollView>
    </CommonView>
  );
};

export default ContactUs;
