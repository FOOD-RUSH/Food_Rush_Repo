import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { Heading1, Heading2, Body, Label } from '@/src/components/common/Typography';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';

const TermsAndConditionsScreen = ({
  navigation,
}: RootStackScreenProps<'TermsAndConditions'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <CommonView>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Heading1 
          color={colors.onSurface} 
          weight="bold" 
          align="center"
          style={{ marginBottom: 24 }}
        >
          {t('terms_conditions')}
        </Heading1>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            1. Acceptance of Terms
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            By accessing and using the Food Rush application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            2. Service Description
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            Food Rush is a food delivery platform that connects customers with local restaurants. We facilitate the ordering and delivery of food items but do not prepare or handle the food directly.
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            3. User Accounts
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            • You must provide accurate and complete information when creating an account{'\n'}
            • You are responsible for maintaining the confidentiality of your account credentials{'\n'}
            • You must notify us immediately of any unauthorized use of your account{'\n'}
            • You must be at least 18 years old to use our services
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            4. Orders and Payments
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            • All orders are subject to restaurant availability and acceptance{'\n'}
            • Prices are set by individual restaurants and may change without notice{'\n'}
            • Payment is required at the time of order placement{'\n'}
            • Delivery fees and service charges apply as displayed during checkout{'\n'}
            • Refunds are processed according to our refund policy
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            5. Delivery and Cancellation
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            • Delivery times are estimates and may vary due to weather, traffic, or other factors{'\n'}
            • Orders can be cancelled within 5 minutes of placement if not yet confirmed by the restaurant{'\n'}
            • Cancellation after restaurant confirmation may incur charges{'\n'}
            • We are not responsible for delays caused by external factors
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            6. Food Safety and Quality
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            • Restaurants are responsible for food preparation, quality, and safety{'\n'}
            • We do not guarantee the quality, safety, or suitability of food items{'\n'}
            • Please report any food safety concerns immediately{'\n'}
            • Special dietary requirements should be communicated directly to restaurants
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            7. Privacy and Data Protection
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            • We collect and use your personal information as described in our Privacy Policy{'\n'}
            • Your data is protected using industry-standard security measures{'\n'}
            • We do not sell your personal information to third parties{'\n'}
            • You can request deletion of your account and data at any time
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            8. Prohibited Uses
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            You may not use our service to:{'\n'}
            • Violate any local, state, or international laws{'\n'}
            • Transmit harmful or malicious content{'\n'}
            • Impersonate another person or entity{'\n'}
            • Interfere with the proper functioning of the platform{'\n'}
            • Use the service for commercial purposes without authorization
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            9. Limitation of Liability
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            Food Rush shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. Our total liability shall not exceed the amount paid by you for the specific order in question.
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            10. Changes to Terms
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
          </Body>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Heading2 color={colors.onSurface} weight="semibold" style={{ marginBottom: 12 }}>
            11. Contact Information
          </Heading2>
          <Body color={colors.onSurfaceVariant} style={{ lineHeight: 24 }}>
            If you have any questions about these Terms and Conditions, please contact us at:{'\n\n'}
            Email: support@foodrush.cm{'\n'}
            WhatsApp: +237 6XX XXX XXX{'\n'}
            Address: Yaoundé, Cameroon
          </Body>
        </View>

        <View style={{ 
          backgroundColor: colors.surfaceVariant, 
          padding: 16, 
          borderRadius: 12,
          marginBottom: 32 
        }}>
          <Label color={colors.onSurfaceVariant} weight="medium" align="center">
            Last updated: January 2025
          </Label>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default TermsAndConditionsScreen;