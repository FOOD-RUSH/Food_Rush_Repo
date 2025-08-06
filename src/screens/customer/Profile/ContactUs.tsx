import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { SocialData } from '@/src/constants/SocialData';
import SocialCards from '@/src/components/common/SocialCards';
import { ScrollView } from 'react-native';

const ContactUs = () => {
  return (
    <CommonView >
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 space-y-4'>
         {SocialData.map((data) => (
        <SocialCards
          id={data.id}
          icon_name={data.icon_name}
          social_platform={data.social_platform}
          key={data.id}
        />
      ))}
      </ScrollView>
     
    </CommonView>
  );
};

export default ContactUs;
