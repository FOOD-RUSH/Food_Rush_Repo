import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Card, useTheme } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Typography,
  Heading4,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import { useResponsive } from '@/src/hooks/useResponsive';

interface FAQItem {
  title: string;
  id: number;
  description: string;
}

// FAQ data with comprehensive information about the Food Rush app
const getFAQData = (t: any): FAQItem[] => [
  {
    id: 1,
    title: t('what_is_foodrush', 'What is Food Rush?'),
    description: t(
      'foodrush_description',
      'Food Rush is a comprehensive food delivery platform that connects you with local restaurants in Cameroon. You can browse menus, place orders, track deliveries in real-time, and enjoy your favorite meals delivered right to your door. Our platform supports multiple payment methods including mobile money (MTN, Orange) and cash on delivery.',
    ),
  },
  {
    id: 2,
    title: t('how_can_i_make_a_payment', 'How can I make a payment?'),
    description: t(
      'payment_methods_description',
      "Food Rush supports multiple payment methods for your convenience: Mobile Money (MTN Mobile Money, Orange Money), Cash on Delivery, and Credit/Debit Cards. Simply select your preferred payment method during checkout. For mobile money payments, you'll receive an SMS prompt to complete the transaction.",
    ),
  },
  {
    id: 3,
    title: t('how_do_i_can_cancel_orders', 'How can I cancel my order?'),
    description: t(
      'cancel_order_description',
      'You can cancel your order within 5 minutes of placing it, provided the restaurant hasn\'t confirmed it yet. Go to "My Orders" > "Active Orders" > Select your order > "Cancel Order". If the restaurant has already confirmed your order, please contact our support team for assistance. Refunds for cancelled orders are processed within 24-48 hours.',
    ),
  },
  {
    id: 4,
    title: t('how_do_i_can_delete_my_account', 'How can I delete my account?'),
    description: t(
      'delete_account_description',
      'To delete your account, go to Profile > Settings > Account Settings > Delete Account. Please note that this action is permanent and cannot be undone. All your order history, saved addresses, and preferences will be permanently removed. You can also contact our support team for assistance with account deletion.',
    ),
  },
  {
    id: 5,
    title: t('how_does_delivery_work', 'How does delivery work?'),
    description: t(
      'delivery_description',
      "Once you place an order, the restaurant prepares your food and our delivery partner picks it up. You can track your order in real-time through the app. Delivery times typically range from 20-45 minutes depending on distance and restaurant preparation time. You'll receive notifications at each step of the delivery process.",
    ),
  },
  {
    id: 6,
    title: t(
      'what_if_my_order_is_wrong',
      'What if my order is wrong or missing items?',
    ),
    description: t(
      'wrong_order_description',
      "If your order is incorrect or missing items, please contact our support team immediately through the app or call our hotline. We'll work with the restaurant to resolve the issue quickly. You may be eligible for a refund, replacement, or credit for future orders depending on the situation.",
    ),
  },
  {
    id: 7,
    title: t('how_to_track_my_order', 'How can I track my order?'),
    description: t(
      'order_tracking_description',
      'You can track your order in real-time by going to "My Orders" > "Active Orders" and selecting your current order. The tracking screen shows the order status (confirmed, preparing, ready for pickup, out for delivery, delivered) with estimated delivery time and live updates.',
    ),
  },
  {
    id: 8,
    title: t(
      'delivery_fees_and_charges',
      'What are the delivery fees and charges?',
    ),
    description: t(
      'delivery_fees_description',
      'Delivery fees vary by restaurant and distance, typically ranging from 300-1000 XAF. Some restaurants offer free delivery for orders above a certain amount. All fees are clearly displayed before you complete your order. There are no hidden charges - what you see is what you pay.',
    ),
  },
];

const FAQ = () => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const faqData = getFAQData(t);

  const toggleExpanded = (id: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <CommonView>
      {/* Header */}
      <View
        className="px-4 py-6 border-b"
        style={{ borderBottomColor: colors.outline + '30' }}
      >
        <Heading4
          color={colors.onSurface}
          weight="bold"
          style={{ marginBottom: 8 }}
        >
          {t('frequently_asked_questions', 'Frequently Asked Questions')}
        </Heading4>
        <Body color={colors.onSurfaceVariant}>
          {t(
            'faq_subtitle',
            'Find answers to common questions about Food Rush',
          )}
        </Body>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ paddingBottom: scale(20) }}
      >
        {faqData.map((item) => (
          <QuestionCard
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleExpanded(item.id)}
          />
        ))}

        {/* Contact Support Section */}
        <Card
          mode="outlined"
          className="mt-6 mb-4"
          style={{
            backgroundColor: colors.primaryContainer || colors.primary + '20',
            borderColor: colors.primary + '30',
          }}
        >
          <View className="p-5">
            <View className="flex-row items-center mb-3">
              <MaterialIcons
                name="support-agent"
                size={24}
                color={colors.primary}
              />
              <Label
                color={colors.primary}
                weight="semibold"
                style={{ marginLeft: 8 }}
              >
                {t('need_more_help', 'Need More Help?')}
              </Label>
            </View>
            <Body
              color={colors.onPrimaryContainer || colors.primary}
              style={{ lineHeight: 20 }}
            >
              {t(
                'contact_support_description',
                "If you couldn't find the answer to your question, our support team is here to help you 24/7.",
              )}
            </Body>
          </View>
        </Card>
      </ScrollView>
    </CommonView>
  );
};

export default FAQ;

interface QuestionCardProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const QuestionCard = ({ item, isExpanded, onToggle }: QuestionCardProps) => {
  const { colors } = useTheme();
  const { scale } = useResponsive();

  return (
    <Card
      mode="outlined"
      className="mb-3"
      style={{
        backgroundColor: colors.surface,
        borderColor: isExpanded ? colors.primary + '50' : colors.outline,
        borderWidth: isExpanded ? 2 : 1,
      }}
    >
      <TouchableOpacity onPress={onToggle} className="p-5" activeOpacity={0.7}>
        <View className="flex-row justify-between items-center">
          <Label
            color={colors.onSurface}
            weight="semibold"
            style={{ flex: 1, paddingRight: 12, fontSize: scale(16) }}
          >
            {item.title}
          </Label>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={scale(24)}
            color={colors.primary}
          />
        </View>

        {isExpanded && (
          <>
            <Seperator style={{ marginVertical: scale(12) }} />
            <Body
              color={colors.onSurfaceVariant}
              style={{
                lineHeight: scale(22),
                fontSize: scale(14),
              }}
            >
              {item.description}
            </Body>
          </>
        )}
      </TouchableOpacity>
    </Card>
  );
};
