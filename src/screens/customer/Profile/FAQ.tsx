import { MaterialIcon } from '@/src/components/common/icons';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Card, useTheme } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';

import { Heading4, Body, Label } from '@/src/components/common/Typography';
import { useResponsive } from '@/src/hooks/useResponsive';

interface FAQItem {
  title: string;
  id: number;
  description: string;
}

// FAQ data specific to Food Rush app in Cameroon
const getFAQData = (t: any): FAQItem[] => [
  {
    id: 1,
    title: t('faq_what_is_foodrush_title'),
    description: t('faq_what_is_foodrush_desc'),
  },
  {
    id: 2,
    title: t('faq_how_to_order_title'),
    description: t('faq_how_to_order_desc'),
  },
  {
    id: 3,
    title: t('faq_payment_methods_title'),
    description: t('faq_payment_methods_desc'),
  },
  {
    id: 4,
    title: t('faq_delivery_time_title'),
    description: t('faq_delivery_time_desc'),
  },
  {
    id: 5,
    title: t('faq_track_order_title'),
    description: t('faq_track_order_desc'),
  },
  {
    id: 6,
    title: t('faq_cancel_order_title'),
    description: t('faq_cancel_order_desc'),
  },
  {
    id: 7,
    title: t('faq_delivery_fees_title'),
    description: t('faq_delivery_fees_desc'),
  },
  {
    id: 8,
    title: t('faq_wrong_order_title'),
    description: t('faq_wrong_order_desc'),
  },
  {
    id: 9,
    title: t('faq_change_address_title'),
    description: t('faq_change_address_desc'),
  },
  {
    id: 10,
    title: t('faq_payment_failed_title'),
    description: t('faq_payment_failed_desc'),
  },
  {
    id: 11,
    title: t('faq_restaurant_closed_title'),
    description: t('faq_restaurant_closed_desc'),
  },
  {
    id: 12,
    title: t('faq_account_security_title'),
    description: t('faq_account_security_desc'),
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-2"
        contentContainerStyle={{ paddingBottom: scale(20) }}
      >
        {/* Header */}
        <View
          className="px-4 pt-10 border-b"
          style={{ borderBottomColor: colors.outline + '30' }}
        >
          <Heading4
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: 8 }}
          >
            {t('frequently_asked_questions')}
          </Heading4>
          <Body color={colors.onSurfaceVariant}>
            {t('faq_subtitle')}
          </Body>
        </View>
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
              <MaterialIcon
                name="support-agent"
                size={24}
                color={colors.primary}
              />
              <Label
                color={colors.primary}
                weight="semibold"
                style={{ marginLeft: 8 }}
              >
                {t('need_more_help')}
              </Label>
            </View>
            <Body
              color={colors.onPrimaryContainer || colors.primary}
              style={{ lineHeight: 20, fontSize: 14 }}
            >
              {t('contact_support_description')}
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
            style={{ flex: 1, paddingRight: 12, fontSize: scale(14) }}
          >
            {item.title}
          </Label>
          <MaterialIcon
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
                lineHeight: scale(26),
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
