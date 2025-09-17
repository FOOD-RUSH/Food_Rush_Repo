import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '../navigation/types';
import { useAppStore } from '../stores/customerStores/AppStore';
import { useAuthStore } from '../stores/customerStores/AuthStore';

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
  const { setUserType, completeOnboarding } = useAppStore();
  const { setSelectedUserType } = useAuthStore();
  
  // Local state
  const [selectedType, setSelectedType] = useState<'customer' | 'restaurant' | null>(null);

  const handleUserTypePress = useCallback(
    (userType: 'customer' | 'restaurant') => {
      setSelectedType(userType);
    },
    [],
  );

  const handleContinue = useCallback(() => {
    if (selectedType) {
      // Update both stores
      setUserType(selectedType);
      setSelectedUserType(selectedType);
      completeOnboarding();
      
      // Navigate to Auth screen with user type
      navigation.replace('Auth', {
        screen: 'SignIn',
        params: { userType: selectedType },
      });
    }
  }, [selectedType, setUserType, setSelectedUserType, completeOnboarding, navigation]);

  const getCardStyle = useCallback(
    (isSelected: boolean) => ({
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 3,
      borderColor: isSelected ? colors.primary : 'transparent',
      padding: 4,
      marginBottom: 20,
      overflow: 'hidden',
      elevation: isSelected ? 8 : 2,
      shadowColor: isSelected ? colors.primary : '#000',
      shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
      shadowOpacity: isSelected ? 0.3 : 0.1,
      shadowRadius: isSelected ? 8 : 4,
    }),
    [colors],
  );

  const getButtonStyle = useCallback(
    (isSelected: boolean) => ({
      borderRadius: 30,
      backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
      elevation: isSelected ? 4 : 0,
      shadowColor: isSelected ? colors.primary : 'transparent',
      shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
      shadowOpacity: isSelected ? 0.3 : 0,
      shadowRadius: isSelected ? 4 : 0,
    }),
    [colors],
  );

  const getButtonLabelStyle = useCallback(
    (isSelected: boolean) => ({
      fontSize: 18,
      fontWeight: '600' as const,
      color: isSelected ? 'white' : '#9CA3AF',
    }),
    [],
  );

  // Responsive dimensions
  const cardHeight = Math.min(SCREEN_HEIGHT * 0.28, 220);
  const cardWidth = SCREEN_WIDTH - 48;
  const imageHeight = cardHeight - 60; // Account for text and padding

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={
          colors.onSurface === '#1e293b' ? 'dark-content' : 'light-content'
        }
        backgroundColor={colors.background}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 32,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 12,
              color: colors.onBackground,
              textAlign: 'center',
            }}
          >
            {t('what_are_your_needs')}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: colors.onBackground,
              textAlign: 'center',
              opacity: 0.8,
            }}
          >
            {t('choose_your_role')}
          </Text>
        </View>

        {/* User Type Cards */}
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 20 }}>
          {userTypes.map((type, index) => (
            <TouchableOpacity
              key={type.id}
              activeOpacity={0.8}
              style={[
                getCardStyle(selectedType === type.id),
                {
                  height: cardHeight,
                  width: cardWidth,
                  alignSelf: 'center',
                },
              ]}
              onPress={() => handleUserTypePress(type.id)}
            >
              {/* Image Container */}
              <View 
                style={{
                  height: imageHeight,
                  width: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
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
                      top: 12,
                      right: 12,
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

                {/* Gradient overlay for better text readability */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  }}
                />
              </View>

              {/* Title */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: selectedType === type.id ? colors.primary : colors.onSurface,
                  }}
                >
                  {t(type.title)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <View style={{ paddingTop: 32 }}>
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={!selectedType}
            contentStyle={{ paddingVertical: 16 }}
            style={getButtonStyle(!!selectedType)}
            labelStyle={getButtonLabelStyle(!!selectedType)}
          >
            {selectedType ? t('continue') : t('select_user_type')}
          </Button>

          {selectedType && (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 16,
                fontSize: 16,
                color: colors.primary,
                fontWeight: '500',
              }}
            >
              {t('you_selected')} {selectedType === 'customer' ? t('customer') : t('restaurant')}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserTypeSelectionScreen;