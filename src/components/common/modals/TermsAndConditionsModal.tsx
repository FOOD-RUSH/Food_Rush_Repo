import React from 'react';
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { IoniconsIcon } from '@/src/components/common/icons';
import {
  
  Heading1,
  Heading2,
  Body,
  Label,
} from '@/src/components/common/Typography';

interface TermsAndConditionsModalProps {
  visible: boolean;
  onDismiss: () => void;
  userType?: 'customer' | 'restaurant';
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  visible,
  onDismiss,
  userType = 'customer',
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('common');

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      marginTop: Platform.OS === 'ios' ? 50 : 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline + '30',
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      marginBottom: 12,
    },
    paragraph: {
      marginBottom: 12,
      lineHeight: 22,
    },
    bulletPoint: {
      marginBottom: 8,
      paddingLeft: 16,
    },
    bulletText: {
      lineHeight: 20,
    },
  });

  const renderCustomerTerms = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Heading1 color={colors.onSurface} weight="bold" style={styles.sectionTitle}>
          {t('foodrush_terms_title')}
        </Heading1>
        
        <Body color={colors.onSurfaceVariant} style={styles.paragraph}>
          {t('last_updated')}: {new Date().toLocaleDateString()}
        </Body>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          {t('customer_terms.acceptance_title')}
        </Heading2>
        <Body color={colors.onSurface} style={styles.paragraph}>
          {t('customer_terms.acceptance_content')}
        </Body>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          2. Account Registration & Security
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You agree to provide accurate, current, and complete registration information, including email, phone number, delivery address, and payment details.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Your account credentials are personal and confidential. You must notify us immediately of any unauthorized access.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          3. Ordering Process
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You are responsible for verifying order details—items, quantities, and delivery address—before completing your order.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Menu or availability may change without notice due to restaurant conditions.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          4. Payment & Fees
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Payment is collected via the App at the time of order placement. Additional fees (e.g., delivery fees, service charges) may apply.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You agree that all payment details you provide are accurate and authorize FoodRush to charge your selected payment method.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          5. Delivery & Timing
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Delivery is facilitated by independent drivers ("Couriers"). Estimated delivery times are approximations; actual times may vary due to traffic, weather, or other factors.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • FoodRush is not responsible for delays outside its control but will make reasonable efforts to communicate updates.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          6. Food Quality & Complaints
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • FoodRush is not liable for issues regarding food quality or preparation—that is the responsibility of the restaurant.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Customers should report concerns or complaints—such as missing items, poor quality, or contamination—via customer support promptly.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          7. Community Guidelines & Conduct
        </Heading2>
        <Body color={colors.onSurface} style={styles.paragraph}>
          You agree to:
        </Body>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Treat Couriers and restaurant staff with respect and courtesy. Harassment, abuse, or discrimination is prohibited.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Not provide false or misleading information.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Ensure a safe delivery pickup environment (e.g., greet Couriers clothed and appropriately). Inappropriate behavior may result in account penalties.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          8. Account Suspension & Termination
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • FoodRush reserves the right to suspend or terminate your access if you violate these Terms or engage in harmful or fraudulent behavior.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • If your account is locked or deactivated for suspicious activity or policy violations, you may contact support for review.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Our enforcement is intended to be fair and proportionate.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          9. Modifications to Terms
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • FoodRush may update these Terms at any time. Changes become effective when posted in-app or on our website.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • It is your responsibility to review these Terms periodically. Continued use of the Service after updates constitutes acceptance.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          10. Privacy
        </Heading2>
        <Body color={colors.onSurface} style={styles.paragraph}>
          Our Privacy Policy governs how we collect, use, and protect your personal information. By using the App, you consent to its terms.
        </Body>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          11. Disclaimers & Liability Limitations
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • The Service is provided "as is." FoodRush disclaims warranties of perfection, accuracy, or availability.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • FoodRush is not responsible for third-party restaurant actions or events beyond our reasonable control.
          </Body>
        </View>
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          12. Governing Law & Dispute Resolution
        </Heading2>
        <Body color={colors.onSurface} style={styles.paragraph}>
          These Terms are governed by the laws of the jurisdiction where FoodRush operates. Disputes shall be subject to the exclusive jurisdiction of relevant courts.
        </Body>
      </View>
    </ScrollView>
  );

  const renderRestaurantTerms = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Heading1 color={colors.onSurface} weight="bold" style={styles.sectionTitle}>
          Foodrush Partner Restaurant Terms & Service
        </Heading1>
        
        <Body color={colors.onSurfaceVariant} style={styles.paragraph}>
          These Terms & Conditions ("Agreement") set out the rights and obligations between you ("Restaurant Partner," "you," "your") and Foodrush ("Foodrush," "we," "us," "our") in respect of your participation in the Foodrush platform for ordering, delivery and/or pickup services (the "Service"). By signing up and operating as a Foodrush Partner, you agree to these Terms.
        </Body>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          1. Definitions
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Customer:</Label> A person placing an order through the Foodrush mobile application or website.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Delivery Partner / Driver:</Label> An independent contractor engaged to deliver orders from you to the Customer, whether managed by Foodrush or by you (if you choose self‑delivery).
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Order:</Label> A request by a Customer for food / items via Foodrush, accepted by you, for delivery or pickup.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Commission / Fee:</Label> The percentage or fixed amount deducted by Foodrush from the order subtotal, or other fees as defined in the Merchant Agreement.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Menu & Menu Items:</Label> Your offerings made visible via Foodrush, including name, description, price, photos.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Delivery Zone:</Label> The geographic boundary within which deliveries are accepted/provided.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          2. Enrollment and Onboarding
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must provide accurate, complete, and up‑to‑date information about your business (name, address, contacts, food hygiene license, tax identification, etc.).
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Foodrush will review your information and may approve or reject your application. Approval may depend on meeting local food safety regulations, insurance, and other legal requirements.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Onboarding includes integrating your menu, setting hours of operation, delivery zones (if applicable), prices, and methods of receiving orders (e.g. tablet, POS system, dashboard).
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          3. Order Processing
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • When a Customer places an order, we will send you a notification. You are required to accept or reject within a specified timeframe.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Once accepted, you must prepare the order in accordance with the Customer's instructions, within the committed prep time.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Orders must be fully prepared and packaged before the Delivery Partner picks up (in a delivery scenario). In a pickup scenario, orders must be prepared and ready for collection at agreed time.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must maintain accurate, up‑to‑date menu information (availability, pricing, photos, descriptions). If an item is out of stock, you should mark it as unavailable as soon as reasonably possible.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          4. Delivery & Pickup
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Delivery by Foodrush / Third Party Drivers:</Label> If using Foodrush drivers, once order is ready, you will package it appropriately and hand it over to the driver.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Self‑Delivery Option:</Label> You may, if eligible, use your own delivery personnel ("self‑delivery"). If so, you must ensure your drivers meet all requirements (licensing, local laws, food safety, insurance) and adhere to Foodrush's standards.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • For pickup orders, you must have clearly communicated when and where the Customer can collect.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          5. Fees, Payments, and Commissions
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Foodrush will charge you a commission on each accepted order. The commission rate, transaction fees, or other fees (delivery, promotion, marketing) will be agreed in your Merchant Agreement.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Payments to you will be made on a regular schedule (e.g. Daily, weekly), after deducting all applicable fees, refunds, chargebacks, and adjustments.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You are responsible for all costs in preparing and packaging the food, labor, utilities, and any other restaurant costs.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You will handle applicable taxes on your food items; Foodrush may remit taxes if required by law but you are responsible to provide required tax documentation.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          6. Quality, Food Safety, & Standards
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must comply with all applicable health, food safety, licensing, and sanitation laws and regulations.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Food must be prepared in a safe, hygienic manner, using safe ingredients and stored correctly.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Packaging must protect food, maintain temperature, avoid contamination, and be suitable for delivery.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You will maintain insurance as required by local law (e.g. general liability, foodborne illness insurance).
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          7. Hours of Operation, Menu & Availability
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You set your own operating hours in the system. You must update them accurately, especially for holidays, closures, or unexpected events.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You are responsible for maintaining accurate pricing, specials, surcharges, and charges. Any changes must be updated in Foodrush in advance.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Items listed must reflect what you can reliably make. Repeated issues of missing items or unacceptable quality may lead to warnings or suspension.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          8. Customer Service, Complaints & Refunds
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must cooperate with Foodrush in resolving customer complaints (wrong items, missing items, late deliveries, etc.).
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • If a Customer is entitled to refund or credit (under policy), Foodrush may issue such, and you may be responsible for covering that cost, depending on the nature of the complaint.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You will respond to requests from Foodrush for information (photos, etc.) to facilitate investigations.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          9. Standards of Conduct & Representation
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must represent your restaurant and food honestly (menu descriptions, photos, nutrition or allergy info if provided) and not mislead Customers.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must not discriminate against Customers, Drivers, or Foodrush staff.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must treat Delivery Partners appropriately; the handing over of orders must be smooth, and you should not expect Drivers to perform restaurant tasks beyond pickup.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          10. Promotions, Advertising & Pricing
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Foodrush may offer promotions, featured listings, discounts, loyalty programs, or marketing tools; you may choose to participate subject to additional fees or conditions.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Prices communicated to Customers must include or exclude tax as per local law, and any delivery or service fee must be transparent.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must not inflate prices secretly to offset commissions or fees (such behavior could violate consumer protection laws).
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          11. Data, Reporting & Access
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You will have access to reporting tools: order history, sales metrics, customer feedback, etc. Foodrush may require certain performance metrics (order acceptance rate, cancellation rate, etc.).
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You consent to Foodrush's use of transactional data for analytics, improvements, fraud detection, etc., in accordance with applicable data protection / privacy law.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          12. Suspension, Termination & Liability
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Foodrush may suspend or deactivate your restaurant's participation for failure to meet these Terms, for serious violations (e.g. food safety breach, repeated complaints, fraudulent behavior), or by mutual agreement.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Either party may terminate the relationship per the notice period in the Merchant Agreement. Upon termination, you must fulfill accepted orders already in process.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Limitation of Liability:</Label> Foodrush will not be liable for indirect or consequential losses (such as lost profits), except to the extent mandated by law. Your liability is similarly limited.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          13. Intellectual Property & Branding
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You grant Foodrush a non‑exclusive, royalty‑free license to use your name, logo, images of your menu items for the purpose of promoting the app, displaying in app, marketing, etc.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You represent that you own or have the rights to any material (images, trademarks, descriptions) you upload, and that they do not infringe the rights of third parties.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          14. Insurance & Compliance
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You shall maintain all required business, food safety, and liability insurance, and licenses required by local, regional, or national law.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You will comply with any laws governing food allergens, nutrition labeling, hygiene, labor, wages, and worker safety.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          15. Indemnification
        </Heading2>
        <Body color={colors.onSurface} style={styles.paragraph}>
          You agree to indemnify, defend and hold harmless Foodrush, its officers, directors, employees and agents from any claims, damages, losses, liabilities, costs or expenses arising out of your breach of these Terms, or your negligent or intentional acts (including food safety issues, misrepresentations, or failing to comply with law).
        </Body>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          16. Privacy & Confidentiality
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • You must adhere to any privacy laws applicable in your jurisdiction in handling Customer data. Foodrush will collect and store Customer data; as a partner you may receive certain data (e.g. contact for delivery, special instructions). Use such data only for fulfilling the order and not for unsolicited marketing unless you have consent.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Confidential information (business operations, commission structure, internal metrics) provided by Foodrush must be kept confidential.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          17. Changes to These Terms
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Foodrush may revise these Terms from time to time. When changes are material, we will provide notice (e.g. via email or in‑app). Continued use of the Service after changes implies your acceptance.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • If you do not agree to the changes, you may terminate under the provisions of Section 12.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          18. Governing Law & Dispute Resolution
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • This Agreement shall be governed by the laws of Cameroon.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • Any dispute arising under this Agreement shall first be attempted to be resolved via mediation or negotiation between the parties. If unresolved, then by arbitration or in court as agreed per local law.
          </Body>
        </View>
      </View>

      <View style={styles.section}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          19. Miscellaneous
        </Heading2>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Independent Contractor:</Label> Unless otherwise agreed, the Restaurant Partner is an independent contractor; partnership or employment is not created.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Force Majeure:</Label> Neither party shall be liable for delays or failures due to causes beyond their control (natural disasters, government actions, epidemics, etc.).
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Severability:</Label> If any provision is invalid or unenforceable, the rest remain in force.
          </Body>
        </View>
        <View style={styles.bulletPoint}>
          <Body color={colors.onSurface} style={styles.bulletText}>
            • <Label weight="semibold">Waiver:</Label> A failure to enforce a right does not waive that right in the future.
          </Body>
        </View>
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
        <Heading2 color={colors.onSurface} weight="semibold" style={styles.sectionTitle}>
          Contact Information
        </Heading2>
        <Body color={colors.onSurface} style={styles.paragraph}>
          For questions about these terms, contact us at:
        </Body>
        <Body color={colors.onSurface} style={styles.paragraph}>
          Email: partners@foodrush.cm{'\n'}
          Phone: +237 XXX XXX XXX{'\n'}
          Address: Douala, Cameroon
        </Body>
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Heading2 color={colors.onSurface} weight="semibold">
              {userType === 'restaurant' ? t('partner_terms') : t('terms_and_conditions')}
            </Heading2>
            <TouchableOpacity
              onPress={onDismiss}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <IoniconsIcon name="close" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {userType === 'restaurant' ? renderRestaurantTerms() : renderCustomerTerms()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default TermsAndConditionsModal;