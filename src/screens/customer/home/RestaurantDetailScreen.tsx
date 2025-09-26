import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, FlatList } from 'react-native-gesture-handler';
import {
  View,
  StatusBar,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  TouchableRipple,
  Chip,
  Button,
  useTheme,
  Card,
  Divider,
} from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import MenuItemCard from '@/src/components/customer/MenuItemCard';
import ClassicFoodCard from '@/src/components/customer/ClassicFoodCard';
import { useRestaurantDetails } from '@/src/hooks/customer/useCustomerApi';
import { useTranslation } from 'react-i18next';
import { images } from '@/assets/images';
import { LoadingScreen } from '@/src/components/common';
import {
  Heading2,
  Heading3,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';
import ProfessionalErrorDisplay from '@/src/components/common/ProfessionalErrorDisplay';

const { width: screenWidth } = Dimensions.get('window');

const RestaurantDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'RestaurantDetails'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const restaurantId = route.params.restaurantId;

  // Responsive hooks
  const { hp, isSmallScreen, scale } = useResponsive();
  const spacing = useResponsiveSpacing();

  // fetching restaurant Details with new hook
  const {
    data: restaurantDetails,
    isLoading,
    refetch,
  } = useRestaurantDetails(restaurantId); // uses location from hook

  // Debug: Log restaurant details when they change
  React.useEffect(() => {
    if (restaurantDetails) {
      console.log('🍽️ Restaurant Details Received:', {
        id: restaurantDetails.id,
        name: restaurantDetails.name,
        distance: restaurantDetails.distance,
        deliveryPrice: restaurantDetails.deliveryPrice,
        estimatedDeliveryTime: restaurantDetails.estimatedDeliveryTime,
        hasDistance: !!restaurantDetails.distance,
        hasDeliveryPrice: !!restaurantDetails.deliveryPrice,
        hasEstimatedTime: !!restaurantDetails.estimatedDeliveryTime,
      });
    }
  }, [restaurantDetails]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? t('removed_from_favorites') : t('added_to_favorites'),
      isFavorite
        ? t('restaurant_removed_from_favorites')
        : t('restaurant_added_to_favorites'),
    );
  };

  const handleShare = () => {
    Alert.alert(t('share'), t('share_restaurant_functionality'));
  };

  const handleViewReviews = () => {
    navigation.navigate('RestaurantReviews', {
      restaurantId,
      restaurantName: restaurantDetails?.name || 'Restaurant',
    });
  };

  const handleWriteReview = () => {
    navigation.navigate('RestaurantReview', {
      restaurantId,
      restaurantName: restaurantDetails?.name || 'Restaurant',
      restaurantImage: restaurantDetails?.image,
    });
  };

  const handleViewLocation = () => {
    Alert.alert(t('current_location'), t('view_restaurant_location'));
  };

  const handleViewOffers = () => {
    Alert.alert(t('special_offers'), t('view_special_offers'));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Extract unique categories from menu items
  const categories = useMemo(() => {
    if (!restaurantDetails?.menu || restaurantDetails.menu.length === 0)
      return ['All'];

    const uniqueCategories = new Set<string>();
    restaurantDetails.menu.forEach((item) => {
      // Try to categorize based on item name/description
      const itemName = item.name.toLowerCase();
      const itemDescription = item.description?.toLowerCase() || '';

      if (itemName.includes('local') || itemDescription.includes('local')) {
        uniqueCategories.add('Local Dishes');
      } else if (
        itemName.includes('snack') ||
        itemDescription.includes('snack')
      ) {
        uniqueCategories.add('Snacks');
      } else if (
        itemName.includes('drink') ||
        itemDescription.includes('drink')
      ) {
        uniqueCategories.add('Drinks');
      } else if (
        itemName.includes('breakfast') ||
        itemDescription.includes('breakfast')
      ) {
        uniqueCategories.add('Breakfast');
      } else if (itemName.includes('burger') || itemName.includes('fast')) {
        uniqueCategories.add('Fast Food');
      } else {
        uniqueCategories.add('Main Dishes');
      }
    });

    return ['All', ...Array.from(uniqueCategories)];
  }, [restaurantDetails?.menu]);

  // Filter menu items based on selected category
  const filteredMenuItems = useMemo(() => {
    if (
      !restaurantDetails?.menu ||
      restaurantDetails.menu.length === 0 ||
      selectedCategory === 'All'
    ) {
      return restaurantDetails?.menu || [];
    }

    return restaurantDetails.menu.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemDescription = item.description?.toLowerCase() || '';

      switch (selectedCategory) {
        case 'Local Dishes':
          return (
            itemName.includes('local') || itemDescription.includes('local')
          );
        case 'Snacks':
          return (
            itemName.includes('snack') || itemDescription.includes('snack')
          );
        case 'Drinks':
          return (
            itemName.includes('drink') || itemDescription.includes('drink')
          );
        case 'Breakfast':
          return (
            itemName.includes('breakfast') ||
            itemDescription.includes('breakfast')
          );
        case 'Fast Food':
          return itemName.includes('burger') || itemName.includes('fast');
        case 'Main Dishes':
        default:
          return (
            !itemName.includes('local') &&
            !itemName.includes('snack') &&
            !itemName.includes('drink') &&
            !itemName.includes('breakfast') &&
            !itemName.includes('burger') &&
            !itemName.includes('fast')
          );
      }
    });
  }, [restaurantDetails?.menu, selectedCategory]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!restaurantDetails) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
          padding: spacing.lg,
        }}
      >
        <Ionicons
          name="restaurant-outline"
          size={scale(64)}
          color={colors.onSurfaceVariant}
          style={{ marginBottom: spacing.md }}
        />
        <Heading3
          color={colors.onSurface}
          align="center"
          style={{ marginBottom: spacing.sm }}
        >
          {t('failed_to_load_restaurant_details')}
        </Heading3>
        <Body
          color={colors.onSurfaceVariant}
          align="center"
          style={{ marginBottom: spacing.lg }}
        >
          {t('please_check_connection_and_try_again')}
        </Body>
        <Button
          mode="contained"
          onPress={() => refetch()}
          buttonColor={colors.primary}
          textColor="white"
          style={{ paddingHorizontal: spacing.lg }}
        >
          {t('retry')}
        </Button>
      </View>
    );
  }
  const seperator = () => {
    return <View style={{ width: spacing.sm }} />;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header Image with Navigation */}
      <View style={{ position: 'relative' }}>
        <Image
          source={
            restaurantDetails.image
              ? { uri: restaurantDetails.image }
              : images.onboarding2
          }
          style={{
            width: screenWidth,
            height: isSmallScreen ? hp(25) : hp(30),
            resizeMode: 'cover',
          }}
        />
        {/* Navigation Header */}
        <View
          style={{
            position: 'absolute',
            top: scale(48),
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
          }}
        >
          <Pressable
            onPress={handleGoBack}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: scale(24),
              padding: spacing.sm,
            }}
          >
            <MaterialIcons name="arrow-back" size={scale(24)} color="white" />
          </Pressable>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable
              onPress={handleToggleFavorite}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: scale(24),
                padding: spacing.sm,
              }}
            >
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={scale(24)}
                color={isFavorite ? '#FF6B6B' : 'white'}
              />
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: scale(24),
                padding: spacing.sm,
              }}
            >
              <MaterialIcons name="share" size={scale(24)} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Restaurant Information */}
      <View style={{ padding: spacing.lg }}>
        {/* Restaurant Name and Basic Info */}
        <Card
          style={{
            backgroundColor: colors.surface,
            marginBottom: spacing.lg,
            elevation: 2,
          }}
        >
          <Card.Content style={{ padding: spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: spacing.md,
              }}
            >
              <View style={{ flex: 1, marginRight: spacing.md }}>
                <Heading2
                  color={colors.onSurface}
                  weight="bold"
                  style={{ marginBottom: spacing.xs }}
                >
                  {restaurantDetails.name}
                </Heading2>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={scale(16)}
                    color={colors.primary}
                  />
                  <Body
                    color={colors.onSurfaceVariant}
                    style={{ marginLeft: spacing.xs, flex: 1 }}
                  >
                    {restaurantDetails.address || t('address_not_available')}
                  </Body>
                </View>
              </View>

              {/* Delivery Fee Badge */}
              <View
                style={{
                  backgroundColor: colors.primaryContainer,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: scale(8),
                  alignItems: 'center',
                }}
              >
                <Caption color={colors.onPrimaryContainer} weight="medium">
                  {t('delivery_fee')}
                </Caption>
                <Label color={colors.onPrimaryContainer} weight="bold">
                  {restaurantDetails.deliveryPrice || 'N/A'} XAF
                </Label>
              </View>
            </View>

            {/* Restaurant Description */}
            <Body
              color={colors.onSurfaceVariant}
              style={{
                marginBottom: spacing.md,
                lineHeight: scale(22),
              }}
            >
              {restaurantDetails.description || t('delicious_food_awaits_you')}
            </Body>
          </Card.Content>
        </Card>

        {/* Rating Section */}
        <Card
          style={{
            backgroundColor: colors.surface,
            marginBottom: spacing.md,
            elevation: 1,
          }}
        >
          <TouchableRipple onPress={handleViewReviews}>
            <Card.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.md,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: '#FFD700',
                    borderRadius: scale(20),
                    padding: spacing.xs,
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons name="star" color="white" size={scale(16)} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Label
                      color={colors.onSurface}
                      weight="bold"
                      style={{ fontSize: scale(18) }}
                    >
                      {restaurantDetails.rating || '4.5'}
                    </Label>
                    <Body
                      color={colors.onSurfaceVariant}
                      style={{ marginLeft: spacing.xs }}
                    >
                      ({restaurantDetails.ratingCount || 0} {t('reviews')})
                    </Body>
                  </View>
                  <Caption color={colors.onSurfaceVariant}>
                    {t('tap_to_view_all_reviews')}
                  </Caption>
                </View>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={scale(16)}
                color={colors.onSurfaceVariant}
              />
            </Card.Content>
          </TouchableRipple>

          {/* Write Review Button */}
          <Divider style={{ marginHorizontal: spacing.lg }} />
          <TouchableRipple onPress={handleWriteReview}>
            <Card.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.md,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: colors.primaryContainer,
                    borderRadius: scale(20),
                    padding: spacing.xs,
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    color={colors.onPrimaryContainer}
                    size={scale(16)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Label color={colors.onSurface} weight="semibold">
                    {t('write_review')}
                  </Label>
                  <Caption color={colors.onSurfaceVariant}>
                    {t('share_your_experience')}
                  </Caption>
                </View>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={scale(16)}
                color={colors.onSurfaceVariant}
              />
            </Card.Content>
          </TouchableRipple>
        </Card>

        {/* Delivery Info */}
        <Card
          style={{
            backgroundColor: colors.surface,
            marginBottom: spacing.md,
            elevation: 1,
          }}
        >
          <TouchableRipple onPress={handleViewLocation}>
            <Card.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.md,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: colors.primaryContainer,
                    borderRadius: scale(20),
                    padding: spacing.xs,
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    color={colors.onPrimaryContainer}
                    size={scale(16)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Label color={colors.onSurface} weight="semibold">
                    {t('delivery_info')}
                  </Label>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: spacing.xs,
                      flexWrap: 'wrap',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: spacing.sm,
                      }}
                    >
                      <Ionicons
                        name="time-outline"
                        size={scale(12)}
                        color={colors.primary}
                      />
                      <Caption
                        color={colors.onSurfaceVariant}
                        style={{ marginLeft: spacing.xs }}
                      >
                        {restaurantDetails.estimatedDeliveryTime ||
                          '25-35 mins'}
                      </Caption>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: spacing.sm,
                      }}
                    >
                      <Ionicons
                        name="car-outline"
                        size={scale(12)}
                        color={colors.primary}
                      />
                      <Caption
                        color={colors.onSurfaceVariant}
                        style={{ marginLeft: spacing.xs }}
                      >
                        {restaurantDetails.deliveryPrice || 'N/A'} XAF
                      </Caption>
                    </View>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Ionicons
                        name="location"
                        size={scale(12)}
                        color={colors.primary}
                      />
                      <Caption
                        color={colors.onSurfaceVariant}
                        style={{ marginLeft: spacing.xs }}
                      >
                        {restaurantDetails.distance
                          ? `${restaurantDetails.distance.toFixed(1)} km`
                          : 'N/A km'}
                      </Caption>
                    </View>
                  </View>
                </View>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={scale(16)}
                color={colors.onSurfaceVariant}
              />
            </Card.Content>
          </TouchableRipple>
        </Card>

        {/* Offers Section */}
        <Card
          style={{
            backgroundColor: colors.surface,
            marginBottom: spacing.lg,
            elevation: 1,
          }}
        >
          <TouchableRipple onPress={handleViewOffers}>
            <Card.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.md,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: colors.secondaryContainer,
                    borderRadius: scale(20),
                    padding: spacing.xs,
                    marginRight: spacing.sm,
                  }}
                >
                  <MaterialIcons
                    name="local-offer"
                    color={colors.onSecondaryContainer}
                    size={scale(16)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Label color={colors.onSurface} weight="semibold">
                    {t('special_offers')}
                  </Label>
                  <Caption color={colors.onSurfaceVariant}>
                    {t('tap_to_view_available_deals')}
                  </Caption>
                </View>
                <Chip
                  style={{ backgroundColor: colors.errorContainer }}
                  textStyle={{
                    color: colors.onErrorContainer,
                    fontSize: scale(10),
                  }}
                  compact
                >
                  {t('new')}
                </Chip>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={scale(16)}
                color={colors.onSurfaceVariant}
                style={{ marginLeft: spacing.sm }}
              />
            </Card.Content>
          </TouchableRipple>
        </Card>

      

        {/* Menu Section */}
        <View style={{ marginTop: spacing.xl }}>
          <Heading3
            color={colors.onSurface}
            weight="bold"
            style={{ marginBottom: spacing.md }}
          >
            {t('full_menu')}
          </Heading3>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: spacing.md }}
            contentContainerStyle={{ paddingHorizontal: spacing.xs }}
          >
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {categories.map((category) => (
                <TouchableRipple
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor:
                      selectedCategory === category
                        ? colors.primary
                        : colors.surfaceVariant,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: scale(20),
                    minWidth: scale(80),
                    alignItems: 'center',
                  }}
                >
                  <Label
                    color={
                      selectedCategory === category
                        ? 'white'
                        : colors.onSurfaceVariant
                    }
                    weight={selectedCategory === category ? 'bold' : 'medium'}
                    style={{ fontSize: scale(14) }}
                  >
                    {category}
                  </Label>
                </TouchableRipple>
              ))}
            </View>
          </ScrollView>

          {/* Menu Items or Empty State */}
          {filteredMenuItems && filteredMenuItems.length > 0 ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                  paddingHorizontal: spacing.xs,
                }}
              >
                <Body color={colors.onSurfaceVariant}>
                  {filteredMenuItems.length} {t('items_found')}
                </Body>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="filter-outline"
                    size={scale(16)}
                    color={colors.onSurfaceVariant}
                  />
                  <Caption
                    color={colors.onSurfaceVariant}
                    style={{ marginLeft: spacing.xs }}
                  >
                    {selectedCategory}
                  </Caption>
                </View>
              </View>
              <FlatList
                data={filteredMenuItems}
                renderItem={({ item }) => <MenuItemCard item={item} />}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{ height: spacing.sm }} />
                )}
              />
            </View>
          ) : (
            <View style={{ marginTop: spacing.md }}>
              <ProfessionalErrorDisplay
                type="no_items"
                title={t('no_items_in_category')}
                message={t('no_items_match_your_current_selection')}
                onRefresh={() => setSelectedCategory('All')}
                refreshButtonText={t('view_all_items')}
                containerStyle={{
                  backgroundColor: colors.background,
                  padding: spacing.xl,
                  minHeight: 350,
                }}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default RestaurantDetailScreen;
