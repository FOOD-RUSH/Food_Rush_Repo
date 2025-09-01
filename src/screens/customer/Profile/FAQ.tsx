import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Card, useTheme } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import { MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18next';

interface FAQItem {
  title: string;
  id: number;
  description: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    title: t('what_is_foodrush'),
    description: t('foodrush_description'),
  },
  {
    id: 2,
    title: t('how_can_i_make_a_payment'),
    description: t('payment_methods_description'),
  },
  {
    id: 3,
    title: t('how_do_i_can_cancel_orders'),
    description: t('cancel_order_description'),
  },
  {
    id: 4,
    title: t('how_do_i_can_delete_my_account'),
    description: t('delete_account_description'),
  },
];

const FAQ = () => {
  const { t } = useTranslation('translation');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

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
      >
        {faqData.map((item) => (
          <QuestionCard
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleExpanded(item.id)}
          />
        ))}
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

  return (
    <Card
      mode="outlined"
      className="mb-3"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.outline,
      }}
    >
      <TouchableOpacity onPress={onToggle} className="p-5">
        <View className="flex-row justify-between items-center">
          <Text
            className="text-base font-semibold flex-1 pr-3"
            style={{ color: colors.onSurface }}
          >
            {item.title}
          </Text>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={colors.primary}
          />
        </View>

        {isExpanded && (
          <>
            <Seperator />
            <Text
              className="text-sm leading-5 mt-3"
              style={{ color: colors.onSurfaceVariant }}
            >
              {item.description}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Card>
  );
};
