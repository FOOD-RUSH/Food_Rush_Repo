import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Card } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import { lightTheme } from '@/src/config/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface FAQItem {
  title: string;
  id: number;
  description: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    title: 'What is FoodRush?',
    description:
      'FoodRush is a comprehensive food delivery platform that connects you with your favorite restaurants and delivers fresh meals right to your doorstep. We partner with local restaurants to bring you a wide variety of cuisines at competitive prices.',
  },
  {
    id: 2,
    title: 'How I can make a payment?',
    description:
      'We accept multiple payment methods including credit/debit cards, digital wallets like PayPal, Apple Pay, Google Pay, and cash on delivery. All online payments are secured with industry-standard encryption.',
  },
  {
    id: 3,
    title: 'How do I can cancel orders?',
    description:
      'You can cancel your order within 5 minutes of placing it through the app. Go to "My Orders", select the order you want to cancel, and tap "Cancel Order". If the restaurant has already started preparing your food, cancellation may not be possible.',
  },
  {
    id: 4,
    title: 'How do I can delete my account?',
    description:
      'To delete your account, go to Settings > Account Settings > Delete Account. Please note that this action is irreversible and will permanently remove all your order history, saved addresses, and preferences.',
  },
];

const FAQ = () => {
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
