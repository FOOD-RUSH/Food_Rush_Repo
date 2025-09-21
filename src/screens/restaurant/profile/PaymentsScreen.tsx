import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import { Typography, Heading4, Heading5, Body, Label, Caption } from '@/src/components/common/Typography';

const PaymentsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 16 }}>
          <Heading4 color={colors.onSurface} weight="bold" style={{ marginBottom: 8 }}>
            Payments & Billing
          </Heading4>
          <Body color={colors.onSurfaceVariant}>
            Manage your payment methods and billing information
          </Body>
        </View>

        {/* Coming Soon Card */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <View style={{ padding: 32, alignItems: 'center' }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primaryContainer || colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                <MaterialCommunityIcons 
                  name="credit-card-clock" 
                  size={40} 
                  color={colors.primary} 
                />
              </View>
              
              <Heading5 color={colors.onSurface} weight="bold" align="center" style={{ marginBottom: 12 }}>
                Coming Soon
              </Heading5>
              
              <Body color={colors.onSurfaceVariant} align="center" style={{ lineHeight: 22, marginBottom: 24 }}>
                We're working on bringing you a comprehensive payment management system. 
                You'll soon be able to manage your payment methods, view billing history, 
                and track your earnings all in one place.
              </Body>

              <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                  <Label color={colors.onSurface} style={{ marginLeft: 12 }}>
                    Payment method management
                  </Label>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                  <Label color={colors.onSurface} style={{ marginLeft: 12 }}>
                    Billing history and invoices
                  </Label>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                  <Label color={colors.onSurface} style={{ marginLeft: 12 }}>
                    Earnings tracking and reports
                  </Label>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                  <Label color={colors.onSurface} style={{ marginLeft: 12 }}>
                    Automated payout settings
                  </Label>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Current Status */}
        <View style={{ padding: 16, paddingTop: 0 }}>
          <Card style={{ backgroundColor: colors.surfaceVariant, borderRadius: 16 }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
                <Label color={colors.primary} weight="semibold" style={{ marginLeft: 8 }}>
                  Current Payment Status
                </Label>
              </View>
              
              <Body color={colors.onSurfaceVariant} style={{ lineHeight: 20 }}>
                Your restaurant is currently set up for cash payments and mobile money transactions. 
                All earnings are tracked in your analytics dashboard.
              </Body>
            </View>
          </Card>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </CommonView>
  );
};

export default PaymentsScreen;