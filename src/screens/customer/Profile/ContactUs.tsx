import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { SocialData } from '@/src/constants/SocialData';
import SocialCards from '@/src/components/common/SocialCards';

const ContactUs = () => {
  return (
    <CommonView backgroundColor="#cde2f5">
      {SocialData.map((data) => (
        <SocialCards
          id={data.id}
          icon_name={data.icon_name}
          social_platform={data.social_platform}
          key={data.id}
        />
      ))}
    </CommonView>
  );
};

export default ContactUs;
