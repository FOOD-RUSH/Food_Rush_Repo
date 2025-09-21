import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useAppStore } from '@/src/stores/AppStore';
import { Heading1, Heading4, Body, BodyLarge, Label } from '@/src/components/common/Typography';
// Types
interface UserType {
  id: 'customer' | 'restaurant';
  image: any;
  title: string;
}

// User types configuration
const userTypes: UserType[] = [
  {
    id: 'customer',
    image: images.customerImg,
    title: 'looking_for_food',
  },
  {
    id: 'restaurant',
    image: images.restaurantImg,
    title: 'create_a_restaurant',
  },
];

type UserTypeSelectionScreenProps = RootStackScreenProps<'UserTypeSelection'>;

const UserTypeSelectionScreen: React.FC<UserTypeSelectionScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Store actions
  const { setSelectedUserType, completeOnboarding } = useAppStore();

  // Local state
  const [selectedType, setSelectedType] = useState<
    'customer' | 'restaurant' | null
  >(null);

  const handleUserTypePress = useCallback(
    (userType: 'customer' | 'restaurant') => {
      setSelectedType(userType);
    },
    [],
  );

  const handleContinue = useCallback(() => {
    if (selectedType) {
      // Update app store with selected user type
      setSelectedUserType(selectedType);
      completeOnboarding();

      // Navigate to Auth screen with user type
      navigation.replace('Auth', {
        screen: 'SignIn',
        params: { userType: selectedType },
      });
    }
  }, [
    selectedType,
    setSelectedUserType,
    completeOnboarding,
    navigation,
  ]);

  // Removed style functions - using inline styles for better performance

  // Responsive dimensions
  const cardWidth = SCREEN_WIDTH - 32; // Reduced padding
  const cardHeight = Math.min(SCREEN_HEIGHT * 0.35, 280); // Increased height
  const imageHeight = cardHeight - 80; // More space for text

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={
          colors.onSurface === '#1e293b' ? 'dark-content' : 'light-content'
        }
        backgroundColor={colors.background}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20, // Reduced top padding
          paddingBottom: 32,
          minHeight: SCREEN_HEIGHT - 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Heading1
            align="center"
            color={colors.onBackground}
            style={{ marginBottom: 8 }}
          >
            {t('what_are_your_needs')}
          </Heading1>
          <Body
            align="center"
            color={colors.onBackground}
            style={{ opacity: 0.7 }}
          >
            {t('choose_your_role')}
          </Body>
        </View>

        {/* User Type Cards */}
        <View style={{ gap: 24 }}> {/* Proper spacing between cards */}
          {userTypes.map((type, index) => (
            <TouchableOpacity
              key={type.id}
              activeOpacity={0.8}
              style={[
                {
                  height: cardHeight,
                  width: cardWidth,
                  alignSelf: 'center',
                  borderRadius: 20,
                  backgroundColor: colors.surface,
                  borderWidth: 3,
                  borderColor: selectedType === type.id ? colors.primary : 'transparent',
                  overflow: 'hidden',
                  elevation: selectedType === type.id ? 8 : 3,
                  shadowColor: selectedType === type.id ? colors.primary : '#000',
                  shadowOffset: { width: 0, height: selectedType === type.id ? 4 : 2 },
                  shadowOpacity: selectedType === type.id ? 0.3 : 0.1,
                  shadowRadius: selectedType === type.id ? 8 : 4,
                },
              ]}
              onPress={() => handleUserTypePress(type.id)}
            >
              {/* Image Container - Full height, proper width */}
              <View
                style={{
                  height: imageHeight,
                  width: '100%',
                  position: 'relative',
                }}
              >
                <Image
                  source={type.image}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />

                {/* Selection indicator */}
                {selectedType === type.id && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: colors.primary,
                      borderRadius: 20,
                      padding: 8,
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                    }}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                  </View>
                )}
              </View>

              {/* Title Container - Clean rounded rectangle */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomLeftRadius: 17,
                  borderBottomRightRadius: 17,
                }}
              >
                <Heading4
                  align="center"
                  color={
                    selectedType === type.id
                      ? colors.primary
                      : colors.onSurface
                  }
                >
                  {t(type.title)}
                </Heading4>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <View style={{ paddingTop: 40 }}>
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={!selectedType}
            contentStyle={{ paddingVertical: 16 }}
            style={{
              borderRadius: 30,
              backgroundColor: selectedType ? colors.primary : colors.surfaceVariant,
              elevation: selectedType ? 4 : 0,
              shadowColor: selectedType ? colors.primary : 'transparent',
              shadowOffset: { width: 0, height: selectedType ? 2 : 0 },
              shadowOpacity: selectedType ? 0.3 : 0,
              shadowRadius: selectedType ? 4 : 0,
            }}
            labelStyle={{
              fontSize: 18,
              fontWeight: '600',
              color: selectedType ? 'white' : '#9CA3AF',
            }}
          >
            {selectedType ? t('continue') : t('select_user_type')}
          </Button>

          {selectedType && (
            <Body
              align="center"
              color={colors.primary}
              weight="medium"
              style={{ marginTop: 16 }}
            >
              <Text>{t('you_selected')} {selectedType === 'customer' ? t('customer') : t('restaurant')}</Text>
            </Body>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserTypeSelectionScreen;
