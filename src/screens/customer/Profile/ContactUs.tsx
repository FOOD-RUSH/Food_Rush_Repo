import { useTranslation } from 'react-i18next';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView } from 'react-native';
import SocialCards from '@/src/components/common/SocialCards';
import { t } from 'i18next';

// Enhanced social data with proper contact options
const contactData = [
  {
    id: 1,
    icon_name: 'headset-outline' as const,
    social_platform: t('customer_service'),
    link: 'tel:+1234567890', // Add your customer service phone
  },
  {
    id: 2,
    icon_name: 'logo-whatsapp' as const,
    social_platform: t('whatsapp'),
    link: 'https://wa.me/1234567890', // Add your WhatsApp link
  },
  {
    id: 3,
    icon_name: 'globe-outline' as const,
    social_platform: t('website'),
    link: 'https://yourwebsite.com', // Add your website URL
  },
  {
    id: 4,
    icon_name: 'logo-facebook' as const,
    social_platform: t('facebook'),
    link: 'https://facebook.com/yourpage', // Add your Facebook page
  },
  {
    id: 5,
    icon_name: 'logo-twitter' as const,
    social_platform: t('twitter'),
    link: 'https://twitter.com/yourhandle', // Add your Twitter handle
  },
  {
    id: 6,
    icon_name: 'logo-instagram' as const,
    social_platform: t('instagram'),
    link: 'https://instagram.com/yourhandle', // Add your Instagram handle
  },
];

const ContactUs = () => {
  const { t } = useTranslation('translation');
  return (
    <CommonView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
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
