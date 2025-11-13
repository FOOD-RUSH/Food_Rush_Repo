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

// FAQ data with comprehensive information about the Food Rush app
const getFAQData = (t: any): FAQItem[] => [
  {
    id: 1,
    title: t('how_to_get_started'),
    description: t('get_started_description'),
  },
  {
    id: 2,
    title: t('what_is_foodrush'),
    description: t('foodrush_description'),
  },
  {
    id: 3,
    title: t('how_can_i_make_a_payment'),
    description: t('payment_methods_description'),
  },
  {
    id: 4,
    title: t('how_do_i_can_cancel_orders'),
    description: t('cancel_order_description'),
  },
  {
    id: 5,
    title: t('how_do_i_can_delete_my_account'),
    description: t('delete_account_description'),
  },
  {
    id: 6,
    title: t('how_does_delivery_work'),
    description: t('delivery_description'),
  },
  {
    id: 7,
    title: t('what_if_my_order_is_wrong'),
    description: t('wrong_order_description'),
  },
  {
    id: 8,
    title: t('how_to_track_my_order'),
    description: t('order_tracking_description'),
  },
  {
    id: 9,
    title: t('delivery_fees_and_charges'),
    description: t('delivery_fees_description'),
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
