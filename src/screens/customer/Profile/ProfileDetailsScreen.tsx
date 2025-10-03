import { MaterialCommunityIcon, FeatherIcon } from '@/src/components/common/icons';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import {
  useTheme,
  Divider,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';

import { useTranslation } from 'react-i18next';

import CommonView from '@/src/components/common/CommonView';
import Avatar from '@/src/components/common/Avatar';
import {
  Heading1,
  Heading2,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import { useCustomerProfile, useAuthLoading } from '@/src/stores/AuthStore';
import { useProfileManager } from '@/src/hooks/customer/useAuthhooks';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';

const { width: screenWidth } = Dimensions.get('window');

const ProfileDetailsScreen = ({
  navigation,
}: CustomerProfileStackScreenProps<'ProfileDetails'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Use stored profile data instead of making API calls
  const user = useCustomerProfile();
  const isAuthLoading = useAuthLoading();
  const { refreshProfile, isRefetching } = useProfileManager();

  const isTablet = screenWidth > 768;
  const contentWidth = isTablet
    ? Math.min(600, screenWidth * 0.8)
    : screenWidth - 32;

  // Profile field configuration
  const profileFields = useMemo(
    () => [
      {
        label: t('full_name'),
        value: user?.fullName,
        icon: 'account',
        iconSet: 'MaterialCommunityIcons' as const,
      },
      {
        label: t('email'),
        value: user?.email,
        icon: 'email',
        iconSet: 'MaterialCommunityIcons' as const,
      },
      {
        label: t('phone_number'),
        value: user?.phoneNumber,
        icon: 'phone',
        iconSet: 'MaterialCommunityIcons' as const,
      },
      {
        label: t('role'),
        value: user?.role,
        icon: 'shield-account',
        iconSet: 'MaterialCommunityIcons' as const,
      },
      {
        label: t('status'),
        value: user?.status,
        icon: 'check-circle',
        iconSet: 'MaterialCommunityIcons' as const,
      },
     
    ],
    [user, t],
  );

  // Refresh profile data
  const handleRefresh = useCallback(async () => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, [refreshProfile]);

  // Navigate to Edit
  const navigateToEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const isLoading = isAuthLoading || isRefetching;

  return (
    <CommonView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
        //  paddingBottom: insets.bottom + 40,
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
              {/* Avatar with Edit Button */}
              <View style={{ position: 'relative', marginBottom: 20 }}>
                <Avatar
                  profilePicture={user?.profilePicture}
                  fullName={user?.fullName || 'User'}
                  size={120}
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
                  <FeatherIcon name="edit-2" color="white" size={18} />
                </TouchableOpacity>
              </View>

              {/* User Info */}
              <View style={{ alignItems: 'center' }}>
                {isLoading ? (
                  <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ marginTop: 8 }}
                    >
                      {t('loading_profile')}
                    </Caption>
                  </View>
                ) : (
                  <>
                    <Heading1
                      color={colors.onSurface}
                      weight="bold"
                      align="center"
                      style={{ marginBottom: 8 }}
                    >
                      {user?.fullName || t('full_name')}
                    </Heading1>

                    <View style={{ alignItems: 'center', gap: 4 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <MaterialCommunityIcon                           name="phone"
                          size={16}
                          color={colors.primary}
                        />
                        <Body
                          color={colors.onSurfaceVariant}
                          style={{ marginLeft: 6 }}
                        >
                          {user?.phoneNumber || t('not_provided')}
                        </Body>
                      </View>

                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <MaterialCommunityIcon                           name="email"
                          size={16}
                          color={colors.primary}
                        />
                        <Body
                          color={colors.onSurfaceVariant}
                          style={{ marginLeft: 6 }}
                        >
                          {user?.email || t('not_provided')}
                        </Body>
                      </View>
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Heading2 color={colors.onSurface} weight="bold">
                {t('profile_details')}
              </Heading2>

              <TouchableOpacity
                onPress={handleRefresh}
                disabled={isLoading}
                style={{
                  backgroundColor: colors.primaryContainer,
                  borderRadius: 12,
                  padding: 8,
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <MaterialCommunityIcon                   name="refresh"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Account Information Cards */}
            {profileFields.map((item, idx) => (
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
                      backgroundColor: colors.primaryContainer,
                      borderRadius: 12,
                      padding: 12,
                      marginRight: 16,
                    }}
                  >
                    <MaterialCommunityIcon                       name={item.icon}
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Label
                      color={colors.onSurfaceVariant}
                      weight="medium"
                      style={{ marginBottom: 4 }}
                    >
                      {item.label}
                    </Label>

                    {isLoading ? (
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                        <Caption
                          color={colors.onSurfaceVariant}
                          style={{ marginLeft: 8 }}
                        >
                          {t('loading')}
                        </Caption>
                      </View>
                    ) : (
                      <Body
                        color={colors.onSurface}
                        weight="medium"
                        numberOfLines={2}
                      >
                        {item.value || t('not_provided')}
                      </Body>
                    )}
                  </View>
                </View>

                {idx < profileFields.length - 1 && (
                  <Divider
                    style={{
                      marginLeft: 52,
                      backgroundColor: colors.outline + '30',
                    }}
                  />
                )}
              </View>
            ))}
          </Surface>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ProfileDetailsScreen;
