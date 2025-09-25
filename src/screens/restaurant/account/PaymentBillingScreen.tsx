import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Switch, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import {
  Typography,
  Heading4,
  Heading5,
  Body,
  Label,
  LabelLarge,
  Caption,
} from '@/src/components/common/Typography';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'mobile_money';
  name: string;
  details: string;
  isDefault: boolean;
  isActive: boolean;
}

interface BillingInfo {
  totalEarnings: number;
  pendingPayouts: number;
  lastPayout: string;
  nextPayout: string;
}

const PaymentBillingScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'mobile_money',
      name: 'MTN Mobile Money',
      details: '**** **** 1234',
      isDefault: true,
      isActive: true,
    },
    {
      id: '2',
      type: 'bank',
      name: 'Commercial Bank',
      details: '**** **** 5678',
      isDefault: false,
      isActive: true,
    },
  ]);

  const [billingInfo] = useState<BillingInfo>({
    totalEarnings: 450000,
    pendingPayouts: 75000,
    lastPayout: '2024-01-15',
    nextPayout: '2024-01-30',
  });

  const [autoPayouts, setAutoPayouts] = useState(true);

  const handleAddPaymentMethod = () => {
    Alert.alert(t('add_payment_method'), t('choose_payment_method_type'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('mobile_money'),
        onPress: () => console.log('Add mobile money'),
      },
      {
        text: t('bank_account'),
        onPress: () => console.log('Add bank account'),
      },
    ]);
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    );
  };

  const handleToggleMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === methodId
          ? { ...method, isActive: !method.isActive }
          : method,
      ),
    );
  };

  const handleRequestPayout = () => {
    Alert.alert(
      t('request_payout'),
      `${t('request_payout_amount')} ${billingInfo.pendingPayouts.toLocaleString()} XAF?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => console.log('Payout requested') },
      ],
    );
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return 'cellphone';
      case 'bank':
        return 'bank';
      default:
        return 'credit-card';
    }
  };

  return (
    <CommonView>
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Overview */}
        <Card style={{ marginBottom: 16, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Heading5
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 16 }}
            >
              {t('earnings_overview')}
            </Heading5>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Body color={colors.onSurfaceVariant}>
                  {t('total_earnings')}
                </Body>
                <Heading4 color={colors.primary} weight="bold">
                  {billingInfo.totalEarnings.toLocaleString()} XAF
                </Heading4>
              </View>

              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Body color={colors.onSurfaceVariant}>
                  {t('pending_payouts')}
                </Body>
                <Heading4 color={colors.secondary} weight="bold">
                  {billingInfo.pendingPayouts.toLocaleString()} XAF
                </Heading4>
              </View>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View>
                <Caption color={colors.onSurfaceVariant}>
                  {t('last_payout')}
                </Caption>
                <Body color={colors.onSurface}>
                  {new Date(billingInfo.lastPayout).toLocaleDateString()}
                </Body>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Caption color={colors.onSurfaceVariant}>
                  {t('next_payout')}
                </Caption>
                <Body color={colors.onSurface}>
                  {new Date(billingInfo.nextPayout).toLocaleDateString()}
                </Body>
              </View>
            </View>

            {billingInfo.pendingPayouts > 0 && (
              <Button
                mode="contained"
                onPress={handleRequestPayout}
                style={{ marginTop: 16 }}
                icon="cash"
              >
                {t('request_payout')}
              </Button>
            )}
          </View>
        </Card>

        {/* Payment Methods */}
        <Card style={{ marginBottom: 16, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Heading5 color={colors.onSurface} weight="bold">
                {t('payment_methods')}
              </Heading5>
              <Button mode="outlined" onPress={handleAddPaymentMethod} compact>
                {t('add')}
              </Button>
            </View>

            {paymentMethods.map((method, index) => (
              <View key={method.id}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.primaryContainer,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={getPaymentIcon(method.type) as any}
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Label color={colors.onSurface} weight="medium">
                      {method.name}
                    </Label>
                    <Body color={colors.onSurfaceVariant}>
                      {method.details}
                    </Body>
                    {method.isDefault && (
                      <Caption color={colors.primary} weight="medium">
                        {t('default')}
                      </Caption>
                    )}
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Switch
                      value={method.isActive}
                      onValueChange={() => handleToggleMethod(method.id)}
                      trackColor={{
                        false: colors.outline,
                        true: colors.primary,
                      }}
                    />
                    {!method.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(method.id)}
                        style={{ marginTop: 4 }}
                      >
                        <Caption color={colors.primary}>
                          {t('set_default')}
                        </Caption>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {index < paymentMethods.length - 1 && <Divider />}
              </View>
            ))}
          </View>
        </Card>

        {/* Payout Settings */}
        <Card style={{ marginBottom: 16, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Heading5
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 16 }}
            >
              {t('payout_settings')}
            </Heading5>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Label color={colors.onSurface}>{t('automatic_payouts')}</Label>
                <Body color={colors.onSurfaceVariant}>
                  {t('automatic_payouts_description')}
                </Body>
              </View>
              <Switch
                value={autoPayouts}
                onValueChange={setAutoPayouts}
                trackColor={{ false: colors.outline, true: colors.primary }}
              />
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <TouchableOpacity style={{ paddingVertical: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Label color={colors.onSurface}>{t('payout_schedule')}</Label>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Body
                    color={colors.onSurfaceVariant}
                    style={{ marginRight: 8 }}
                  >
                    {t('weekly')}
                  </Body>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Transaction History */}
        <Card style={{ backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Heading5
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 16 }}
            >
              {t('recent_transactions')}
            </Heading5>

            <TouchableOpacity style={{ paddingVertical: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Label color={colors.onSurface}>
                  {t('view_all_transactions')}
                </Label>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </CommonView>
  );
};

export default PaymentBillingScreen;
