import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';

type Props = RestaurantProfileStackScreenProps<'Support'>;

const faqs = [
  {
    question: 'How do I change my password?',
    answer: 'Go to Account & Settings and tap on Change Password.',
  },
  {
    question: 'How do I update my payment method?',
    answer: 'Visit the Payment & Billing section to add or remove cards.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can email us at support@restaurant.com or use the chat below.',
  },
];

const SupportScreen = ({ navigation }: Props) => {
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Gradient Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerAnim }],
        }}
      >
        <LinearGradient
          colors={["#764ba2", "#667eea"]}
          style={styles.header}
          start={[0, 0]}
          end={[1, 1]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
          <MaterialCommunityIcons name="lifebuoy" size={32} color="#fff" style={{ marginLeft: 10 }} />
        </LinearGradient>
      </Animated.View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View style={{ opacity: contentAnim, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          {faqs.map((faq, idx) => (
            <View key={idx} style={styles.faqContainer}>
              <TouchableOpacity onPress={() => setExpanded(expanded === idx ? null : idx)} style={styles.faqQuestionRow}>
                <MaterialCommunityIcons name={expanded === idx ? 'chevron-up' : 'chevron-down'} size={22} color="#764ba2" />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </TouchableOpacity>
              {expanded === idx && (
                <Animated.View style={styles.faqAnswerBox}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </Animated.View>
              )}
            </View>
          ))}
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:support@restaurant.com')}>
            <MaterialCommunityIcons name="email-outline" size={22} color="#fff" />
            <Text style={styles.contactBtnText}>Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://wa.me/1234567890')}>
            <MaterialCommunityIcons name="chat-outline" size={22} color="#fff" />
            <Text style={styles.contactBtnText}>Chat on WhatsApp</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#764ba2',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#764ba2',
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 20,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    color: '#764ba2',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  faqAnswerBox: {
    padding: 16,
    backgroundColor: '#f3f0fa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  faqAnswer: {
    fontSize: 15,
    color: '#333',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#764ba2',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    marginHorizontal: 20,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#764ba2',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SupportScreen;