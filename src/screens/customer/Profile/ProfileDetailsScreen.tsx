import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useCallback } from 'react';
import { Avatar, useTheme, Card, Divider, Surface } from 'react-native-paper';
import {
  AntDesign,
  MaterialIcons,
  Feather,
  Ionicons,
} from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { useProfileManager } from '@/src/hooks/customer/useAuthhooks';
import SkeletonLoader from '@/src/components/common/SkeletonLoader';
import ProfileErrorState from '@/src/components/profile/ProfileErrorState';
import { icons } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const ProfileDetailsScreen = ({
  navigation,
}: CustomerProfileStackScreenProps<'ProfileDetails'>) => {
  const { user, isLoading, error, refreshProfile } = useProfileManager();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const insets = useSafeAreaInsets();

  const isTablet = screenWidth > 768;
  const contentWidth = isTablet
    ? Math.min(600, screenWidth * 0.8)
    : screenWidth - 32;

  // Retry
  const handleRetry = useCallback(async () => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error('Failed to retry profile fetch:', error);
    }
  }, [refreshProfile]);

  // Navigate to Edit
  const navigateToEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  if (error && !user) {
    return (
      <CommonView>
        <ProfileErrorState
          error={error?.message || 'Failed to load profile. Please try again.'}
          onRetry={handleRetry}
          showRetryButton={true}
        />
      </CommonView>
    );
  }

  return (
    <CommonView>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          alignItems: isTablet ? 'center' : 'stretch',
        }}
      >
        <View style={{ width: contentWidth, alignSelf: 'center' }}>
          {/* Header Card */}
          <Surface
            style={{
              marginTop: 20,
              marginHorizontal: 16,
              borderRadius: 24,
              padding: 24,
              elevation: 2,
              backgroundColor: colors.surface,
            }}
          >
            <View style={{ alignItems: 'center', position: 'relative' }}>
              <View style={{ position: 'relative' }}>
                <Avatar.Image
                  source={
                    user?.profilePicture
                      ? { uri: user.profilePicture }
                      : icons.ProfilePlogo
                  }
                  size={120}
                  style={{
                    backgroundColor: colors.surfaceVariant,
                    borderWidth: 4,
                    borderColor: colors.primary + '20',
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: colors.primary,
                    borderRadius: 20,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                  activeOpacity={0.8}
                  onPress={navigateToEditProfile}
                >
                  <Feather name="edit-2" color="white" size={18} />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 16, alignItems: 'center' }}>
                {isLoading ? (
                  <>
                    <SkeletonLoader
                      width={160}
                      height={24}
                      borderRadius={8}
                      style={{ marginBottom: 8 }}
                    />
                    <SkeletonLoader
                      width={120}
                      height={18}
                      borderRadius={6}
                      style={{ marginBottom: 4 }}
                    />
                    <SkeletonLoader width={140} height={18} borderRadius={6} />
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        color: colors.onSurface,
                        fontSize: 22,
                        fontWeight: '600',
                        textAlign: 'center',
                        marginBottom: 4,
                      }}
                    >
                      {user?.fullName || t('full_name')}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 2,
                      }}
                    >
                      <Feather name="phone" size={14} color={colors.primary} />
                      <Text
                        style={{
                          color: colors.onSurfaceVariant,
                          fontSize: 16,
                          marginLeft: 6,
                        }}
                      >
                        {user?.phoneNumber || t('phone_number')}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <MaterialIcons
                        name="email"
                        size={14}
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          color: colors.onSurfaceVariant,
                          fontSize: 16,
                          marginLeft: 6,
                        }}
                      >
                        {user?.email || t('email')}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Surface>

          {/* Profile Details Section */}
          <Surface
            style={{
              marginTop: 24,
              marginHorizontal: 16,
              borderRadius: 20,
              padding: 20,
              elevation: 2,
              backgroundColor: colors.surface,
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
              }}
            >
              {t('profile_details')}
            </Text>

            {/* Account Information Cards */}
            {[
              {
                label: t('full_name'),
                value: user?.fullName,
                icon: 'user',
                iconSet: 'Feather',
              },
              {
                label: t('email'),
                value: user?.email,
                icon: 'email',
                iconSet: 'MaterialIcons',
              },
              {
                label: t('phone_number'),
                value: user?.phoneNumber,
                icon: 'phone',
                iconSet: 'Feather',
              },
              {
                label: t('role'),
                value: user?.role,
                icon: 'shield-check',
                iconSet: 'Feather',
              },
              {
                label: t('user_id'),
                value: user?.id,
                icon: 'fingerprint',
                iconSet: 'MaterialIcons',
              },
            ].map((item, idx) => {
              const IconComponent =
                item.iconSet === 'Feather'
                  ? Feather
                  : item.iconSet === 'MaterialIcons'
                    ? MaterialIcons
                    : Ionicons;

              return (
                <View key={idx}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 16,
                      paddingHorizontal: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primary + '15',
                        borderRadius: 12,
                        padding: 12,
                        marginRight: 16,
                      }}
                    >
                      <IconComponent
                        name={item.icon}
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.onSurfaceVariant,
                          fontSize: 13,
                          marginBottom: 4,
                          fontWeight: '500',
                        }}
                      >
                        {item.label}
                      </Text>
                      {isLoading ? (
                        <SkeletonLoader
                          width="85%"
                          height={20}
                          borderRadius={6}
                        />
                      ) : (
                        <Text
                          style={{
                            color: colors.onSurface,
                            fontSize: 16,
                            fontWeight: '500',
                          }}
                          numberOfLines={2}
                        >
                          {item.value || t('not_provided')}
                        </Text>
                      )}
                    </View>
                  </View>
                  {idx < 4 && (
                    <Divider
                      style={{
                        marginLeft: 52,
                        backgroundColor: colors.outline + '30',
                      }}
                    />
                  )}
                </View>
              );
            })}
          </Surface>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ProfileDetailsScreen;
