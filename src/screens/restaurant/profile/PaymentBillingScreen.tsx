import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Switch, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';

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
    Alert.alert(
      t('add_payment_method'),
      t('choose_payment_method_type'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('mobile_money'), onPress: () => console.log('Add mobile money') },
        { text: t('bank_account'), onPress: () => console.log('Add bank account') },
      ]
    );
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const handleToggleMethod = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === methodId
          ? { ...method, isActive: !method.isActive }
          : method
      )
    );
  };

  const handleRequestPayout = () => {
    Alert.alert(
      t('request_payout'),
      `${t('request_payout_amount')} ${billingInfo.pendingPayouts.toLocaleString()} XAF?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => console.log('Payout requested') },
      ]
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
      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Earnings Overview */}
        <Card style={{ marginBottom: 16, backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 }}>
              {t('earnings_overview')}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
                  {t('total_earnings')}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary }}>
                  {billingInfo.totalEarnings.toLocaleString()} XAF
                </Text>
              </View>
              
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
                  {t('pending_payouts')}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.secondary }}>
                  {billingInfo.pendingPayouts.toLocaleString()} XAF
                </Text>
              </View>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                  {t('last_payout')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.onSurface }}>
                  {new Date(billingInfo.lastPayout).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                  {t('next_payout')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.onSurface }}>
                  {new Date(billingInfo.nextPayout).toLocaleDateString()}
                </Text>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface }}>
                {t('payment_methods')}
              </Text>
              <Button mode="outlined" onPress={handleAddPaymentMethod} compact>
                {t('add')}
              </Button>
            </View>

            {paymentMethods.map((method, index) => (
              <View key={method.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primaryContainer,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <MaterialCommunityIcons
                      name={getPaymentIcon(method.type) as any}
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.onSurface }}>
                      {method.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
                      {method.details}
                    </Text>
                    {method.isDefault && (
                      <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '500' }}>
                        {t('default')}
                      </Text>
                    )}
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Switch
                      value={method.isActive}
                      onValueChange={() => handleToggleMethod(method.id)}
                      trackColor={{ false: colors.outline, true: colors.primary }}
                    />
                    {!method.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(method.id)}
                        style={{ marginTop: 4 }}
                      >
                        <Text style={{ fontSize: 12, color: colors.primary }}>
                          {t('set_default')}
                        </Text>
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 }}>
              {t('payout_settings')}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, color: colors.onSurface }}>
                  {t('automatic_payouts')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
                  {t('automatic_payouts_description')}
                </Text>
              </View>
              <Switch
                value={autoPayouts}
                onValueChange={setAutoPayouts}
                trackColor={{ false: colors.outline, true: colors.primary }}
              />
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <TouchableOpacity style={{ paddingVertical: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: colors.onSurface }}>
                  {t('payout_schedule')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginRight: 8 }}>
                    {t('weekly')}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Transaction History */}
        <Card style={{ backgroundColor: colors.surface }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 }}>
              {t('recent_transactions')}
            </Text>

            <TouchableOpacity style={{ paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: colors.onSurface }}>
                  {t('view_all_transactions')}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </CommonView>
  );
};

export default PaymentBillingScreen;