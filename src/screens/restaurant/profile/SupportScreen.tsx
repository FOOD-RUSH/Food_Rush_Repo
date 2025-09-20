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
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { RESTAURANT_COLORS } from '@/src/config/restaurantTheme';
import { useAppStore } from '@/src/stores/AppStore';
import CommonView from '@/src/components/common/CommonView';

type Props = RestaurantProfileStackScreenProps<'Support'>;

const SupportScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const themeMode = useAppStore((s) => s.theme);
  const isDarkMode = themeMode === 'dark';
  
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState<number | null>(null);

  const [faqs, setFaqs] = useState([
    {
      question: t('how_do_i_change_password'),
      answer: t('change_password_answer'),
    },
    {
      question: t('how_do_i_update_payment_method'),
      answer: t('update_payment_method_answer'),
    },
    {
      question: t('how_do_i_contact_support'),
      answer: t('contact_support_answer'),
    },
  ]);


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

  const styles = getStyles(isDarkMode, colors);

  return (
    <CommonView >
      {/* Animated Gradient Header */}
     
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View style={{ opacity: contentAnim, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>{t('faqs')}</Text>
          {faqs.map((faq, idx) => (
            <View key={idx} style={styles.faqContainer}>
              <TouchableOpacity onPress={() => setExpanded(expanded === idx ? null : idx)} style={styles.faqQuestionRow}>
                <MaterialCommunityIcons name={expanded === idx ? 'chevron-up' : 'chevron-down'} size={22} color={RESTAURANT_COLORS.PRIMARY} />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </TouchableOpacity>
              {expanded === idx && (
                <Animated.View style={styles.faqAnswerBox}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </Animated.View>
              )}
            </View>
          ))}
          <Text style={styles.sectionTitle}>{t('contact_us')}</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:support@restaurant.com')}>
            <MaterialCommunityIcons name="email-outline" size={22} color="#fff" />
            <Text style={styles.contactBtnText}>{t('email_support')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://wa.me/650979844')}>
            <MaterialCommunityIcons name="chat-outline" size={22} color="#fff" />
            <Text style={styles.contactBtnText}>{t('chat_on_whatsapp')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};

const getStyles = (isDarkMode: boolean, colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.BACKGROUND_DARK : RESTAURANT_COLORS.BACKGROUND_LIGHT,
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
    shadowColor: RESTAURANT_COLORS.PRIMARY,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RESTAURANT_COLORS.PRIMARY,
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 20,
  },
  faqContainer: {
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.SURFACE_DARK : RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    color: RESTAURANT_COLORS.PRIMARY,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  faqAnswerBox: {
    padding: 16,
    backgroundColor: isDarkMode ? RESTAURANT_COLORS.BACKGROUND_DARK : '#f3f0fa',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? RESTAURANT_COLORS.BORDER_DARK : RESTAURANT_COLORS.BORDER_LIGHT,
  },
  faqAnswer: {
    fontSize: 15,
    color: isDarkMode ? RESTAURANT_COLORS.TEXT_DARK : RESTAURANT_COLORS.TEXT_LIGHT,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RESTAURANT_COLORS.PRIMARY,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    marginHorizontal: 20,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: RESTAURANT_COLORS.PRIMARY,
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
