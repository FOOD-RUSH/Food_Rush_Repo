import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import { useTheme, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { useTransaction } from '@/src/hooks/customer/useTransactionHistory';
import { images } from '@/assets/images';
import { useResponsive } from '@/src/hooks/useResponsive';
import { parseISOToDate } from '@/src/utils/dateUtils';
import { formatCameroonTime } from '@/src/utils/timeUtils';

type TransactionDetailsScreenProps = RootStackScreenProps<'TransactionDetails'>;

const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { transactionId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isTablet, getResponsiveText } = useResponsive();
  
  const [isSharing, setIsSharing] = useState(false);
  
  // Fetch transaction details
  const {
    data: transaction,
    isLoading,
    isError,
    refetch,
  } = useTransaction(transactionId);
  
  // Get responsive dimensions
  const getCardDimensions = () => {
    if (isTablet) {
      return {
        padding: 20,
        borderRadius: 12,
        marginVertical: 8,
      };
    } else {
      return {
        padding: 16,
        borderRadius: 10,
        marginVertical: 6,
      };
    }
  };
  
  const cardDimensions = getCardDimensions();
  
  // Format date based on locale
  const formatTransactionDate = (dateString: string) => {
    try {
      const date = parseISOToDate(dateString);
      return formatCameroonTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.primary;
      case 'pending':
        return '#FF9500';
      case 'failed':
      case 'cancelled':
        return colors.error;
      default:
        return colors.onSurfaceVariant;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };
  
  // Get provider icon
  const getProviderIcon = (provider: 'mtn' | 'orange') => {
    return provider === 'mtn' ? images.Mobile_Money : images.Orange_Money;
  };
  
  // Share transaction details
  const handleShare = async () => {
    if (!transaction) return;
    
    setIsSharing(true);
    try {
      const shareContent = `
${t('transaction_details')}
${t('transaction_id')}: ${transaction.transactionId}
${t('amount')}: ${transaction.amount.toLocaleString()} ${transaction.currency}
${t('status')}: ${t(transaction.status)}
${t('provider')}: ${transaction.provider.toUpperCase()}
${t('date')}: ${formatTransactionDate(transaction.createdAt)}
${transaction.financialTransId ? `${t('provider_ref')}: ${transaction.financialTransId}` : ''}
      `.trim();
      
      await Share.share({
        message: shareContent,
        title: t('transaction_details'),
      });
    } catch (error) {
      console.error('Error sharing transaction:', error);
      Alert.alert(t('error'), t('failed_to_share_transaction'));
    } finally {
      setIsSharing(false);
    }
  };
  
  // Render detail row
  const renderDetailRow = (label: string, value: string, icon?: string) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingVertical: 12,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {icon && (
          <IoniconsIcon
            name={icon}
            size={20}
            color={colors.onSurfaceVariant}
            style={{ marginRight: 12 }}
          />
        )}
        <Text
          style={{
            fontSize: getResponsiveText(14),
            color: colors.onSurfaceVariant,
            flex: 1,
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        style={{
          fontSize: getResponsiveText(14),
          fontWeight: '500',
          color: colors.onSurface,
          textAlign: 'right',
          flex: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
  
  // Loading state
  if (isLoading) {
    return (
      <CommonView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcon name="receipt-long" size={80} color={colors.onSurfaceVariant} />
          <Text
            style={{
              fontSize: getResponsiveText(16),
              color: colors.onSurfaceVariant,
              marginTop: 16,
            }}
          >
            {t('loading_transaction_details')}
          </Text>
        </View>
      </CommonView>
    );
  }
  
  // Error state
  if (isError || !transaction) {
    return (
      <CommonView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialIcon name="error-outline" size={80} color={colors.error} />
          <Text
            style={{
              fontSize: getResponsiveText(18),
              fontWeight: '600',
              color: colors.onSurface,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {t('failed_to_load_transaction')}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: getResponsiveText(16),
                fontWeight: '600',
                color: colors.onPrimary,
              }}
            >
              {t('retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }
  
  return (
    <CommonView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.outline + '30',
            borderWidth: 1,
            borderRadius: cardDimensions.borderRadius,
            margin: 16,
          }}
        >
          <View style={{ padding: cardDimensions.padding }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Image
                source={getProviderIcon(transaction.provider)}
                style={{ width: 40, height: 40, marginRight: 16 }}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: getResponsiveText(18),
                    fontWeight: 'bold',
                    color: colors.onSurface,
                  }}
                >
                  {transaction.provider.toUpperCase()} Mobile Money
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <IoniconsIcon
                    name={getStatusIcon(transaction.status)}
                    size={16}
                    color={getStatusColor(transaction.status)}
                  />
                  <Text
                    style={{
                      fontSize: getResponsiveText(14),
                      color: getStatusColor(transaction.status),
                      marginLeft: 6,
                      fontWeight: '500',
                    }}
                  >
                    {t(transaction.status)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleShare}
                disabled={isSharing}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceVariant,
                }}
              >
                <IoniconsIcon
                  name="share-outline"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
            
            {/* Amount */}
            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <Text
                style={{
                  fontSize: getResponsiveText(32),
                  fontWeight: 'bold',
                  color: colors.primary,
                }}
              >
                {transaction.amount.toLocaleString()} {transaction.currency}
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveText(14),
                  color: colors.onSurfaceVariant,
                  marginTop: 4,
                }}
              >
                {transaction.description}
              </Text>
            </View>
          </View>
        </Card>
        
        {/* Transaction Details Card */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.outline + '30',
            borderWidth: 1,
            borderRadius: cardDimensions.borderRadius,
            marginHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <View style={{ padding: cardDimensions.padding }}>
            <Text
              style={{
                fontSize: getResponsiveText(16),
                fontWeight: 'bold',
                color: colors.onSurface,
                marginBottom: 16,
              }}
            >
              {t('transaction_details')}
            </Text>
            
            {renderDetailRow(
              t('transaction_id'),
              transaction.transactionId,
              'receipt-outline'
            )}
            <Divider />
            
            {transaction.financialTransId && (
              <>
                {renderDetailRow(
                  t('provider_reference'),
                  transaction.financialTransId,
                  'link-outline'
                )}
                <Divider />
              </>
            )}
            
            {renderDetailRow(
              t('payment_method'),
              `${transaction.provider.toUpperCase()} Mobile Money`,
              'card-outline'
            )}
            <Divider />
            
            {renderDetailRow(
              t('date_initiated'),
              formatTransactionDate(transaction.createdAt),
              'calendar-outline'
            )}
            <Divider />
            
            {transaction.updatedAt !== transaction.createdAt && (
              <>
                {renderDetailRow(
                  t('date_completed'),
                  formatTransactionDate(transaction.updatedAt),
                  'checkmark-circle-outline'
                )}
                <Divider />
              </>
            )}
            
            {transaction.payerName && (
              <>
                {renderDetailRow(
                  t('payer_name'),
                  transaction.payerName,
                  'person-outline'
                )}
                <Divider />
              </>
            )}
            
            {transaction.email && (
              renderDetailRow(
                t('email'),
                transaction.email,
                'mail-outline'
              )
            )}
          </View>
        </Card>
        
        {/* Order Details Card (if available) */}
        {transaction.orderDetails && (
          <Card
            mode="outlined"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.outline + '30',
              borderWidth: 1,
              borderRadius: cardDimensions.borderRadius,
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <View style={{ padding: cardDimensions.padding }}>
              <Text
                style={{
                  fontSize: getResponsiveText(16),
                  fontWeight: 'bold',
                  color: colors.onSurface,
                  marginBottom: 16,
                }}
              >
                {t('order_details')}
              </Text>
              
              {renderDetailRow(
                t('restaurant'),
                transaction.orderDetails.restaurantName,
                'restaurant-outline'
              )}
              <Divider />
              
              {renderDetailRow(
                t('items_count'),
                transaction.orderDetails.itemCount.toString(),
                'list-outline'
              )}
              
              {transaction.orderDetails.items.length > 0 && (
                <>
                  <Divider />
                  <View style={{ marginTop: 12 }}>
                    <Text
                      style={{
                        fontSize: getResponsiveText(14),
                        fontWeight: '500',
                        color: colors.onSurface,
                        marginBottom: 8,
                      }}
                    >
                      {t('items')}:
                    </Text>
                    {transaction.orderDetails.items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: getResponsiveText(13),
                          color: colors.onSurfaceVariant,
                          marginLeft: 16,
                          marginBottom: 4,
                        }}
                      >
                        • {item}
                      </Text>
                    ))}
                  </View>
                </>
              )}
            </View>
          </Card>
        )}
        
        {/* Help Card */}
        <Card
          mode="outlined"
          style={{
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.outline + '30',
            borderWidth: 1,
            borderRadius: cardDimensions.borderRadius,
            marginHorizontal: 16,
          }}
        >
          <View style={{ padding: cardDimensions.padding }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <IoniconsIcon
                name="help-circle-outline"
                size={24}
                color={colors.onSurfaceVariant}
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  fontSize: getResponsiveText(16),
                  fontWeight: 'bold',
                  color: colors.onSurface,
                }}
              >
                {t('need_help')}
              </Text>
            </View>
            <Text
              style={{
                fontSize: getResponsiveText(14),
                color: colors.onSurfaceVariant,
                lineHeight: 20,
              }}
            >
              {t('transaction_help_text')}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Help')}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                marginTop: 12,
                alignSelf: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: getResponsiveText(14),
                  fontWeight: '600',
                  color: colors.onPrimary,
                }}
              >
                {t('contact_support')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </CommonView>
  );
};

export default TransactionDetailsScreen;