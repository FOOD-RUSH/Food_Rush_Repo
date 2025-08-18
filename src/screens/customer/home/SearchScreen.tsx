import {
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import React, { useState, useCallback, useMemo, ReactNode, memo } from 'react';
import {
  TextInput,
  Checkbox,
  RadioButton,
  Button,
  useTheme,
} from 'react-native-paper';
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { goBack } from '@/src/navigation/navigationHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { lightTheme } from '@/src/config/theme';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useGetAllMenu } from '@/src/hooks/customer';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import FoodItemCard from '@/src/components/customer/FoodItemCard';

// Static data moved outside component to prevent recreation on every render
const CUISINE_TYPES = [
  { id: 'african', name: 'African', icon: '🍲' },
  { id: 'cameroon', name: 'Cameroon Traditional', icon: '🇨🇲' },
  { id: 'fastfood', name: 'Fast Food', icon: '🍔' },
  { id: 'bakery', name: 'Bakery & Pastries', icon: '🥐' },
] as const;

const PRICE_RANGES = [
  { id: 'budget', label: 'Budget (< 2,000 XAF)', value: '0-2000' },
  { id: 'moderate', label: 'Moderate (2,000 - 5,000 XAF)', value: '2000-5000' },
  { id: 'premium', label: 'Premium (5,000 - 10,000 XAF)', value: '5000-10000' },
  { id: 'luxury', label: 'Luxury (> 10,000 XAF)', value: '10000+' },
] as const;

const PROMO_OPTIONS = [
  { id: 'discount', name: 'Discounts Available', icon: '💰' },
  { id: 'buy-one-get-one', name: 'Buy 1 Get 1', icon: '🎁' },
  { id: 'new-customer', name: 'New Customer Offers', icon: '✨' },
] as const;

const SORT_OPTIONS = [
  { id: 'delivery-time', label: 'Fastest Delivery' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'distance', label: 'Nearest First' },
] as const;

// Memoized FilterSection component
const FilterSection = memo(
  ({ title, children }: { title: string; children: ReactNode }) => (
    <View className="bg-white mb-2 mx-3 p-4 rounded-xl border-gray-200 border-solid">
      <Text className="text-lg font-semibold mb-3 text-gray-800">{title}</Text>
      <View className="h-[1px] bg-gray-200 flex mx-2 mb-3" />
      {children}
    </View>
  ),
);
FilterSection.displayName = 'FilterSection';

// Memoized RadioButtonItem component
const RadioButtonItem = memo(
  ({
    item,
    selectedValue,
    onSelect,
    renderLabel,
  }: {
    item: { id: string; [key: string]: any };
    selectedValue: string;
    onSelect: (value: string) => void;
    renderLabel: (item: any) => ReactNode;
  }) => {
    const handlePress = useCallback(() => {
      onSelect(item.id);
    }, [item.id, onSelect]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center justify-between px-3 py-3 rounded-lg mb-1"
      >
        {renderLabel(item)}
        <RadioButton value={item.id} color="#077aff" />
      </TouchableOpacity>
    );
  },
);
RadioButtonItem.displayName = 'RadioButtonItem';

// Memoized CheckboxItem component
const CheckboxItem = memo(
  ({
    item,
    isSelected,
    onToggle,
  }: {
    item: { id: string; name: string; icon: string };
    isSelected: boolean;
    onToggle: (id: string) => void;
  }) => {
    const handlePress = useCallback(() => {
      onToggle(item.id);
    }, [item.id, onToggle]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center justify-between px-3 py-4 rounded-lg mb-1"
      >
        <View className="flex-row items-center space-x-2">
          <Text className="mr-2 text-lg">{item.icon}</Text>
          <Text className="text-base">{item.name}</Text>
        </View>
        <Checkbox
          status={isSelected ? 'checked' : 'unchecked'}
          onPress={handlePress}
          color="#077aff"
        />
      </TouchableOpacity>
    );
  },
);
CheckboxItem.displayName = 'CheckboxItem';

const SearchScreen: React.FC<RootStackScreenProps<'SearchScreen'>> = ({
  navigation,
  route,
}) => {
  const { type, category } = route.params;

  // Modal visibility states
  const [filterVisible, setFilterVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState<string[]>([]);
  const [selectedPromoFilters, setSelectedPromoFilters] = useState<string[]>(
    [],
  );
  const [sortBy, setSortBy] = useState('relevance');

  // Optimized callbacks
  const togglePromoFilter = useCallback((id: string) => {
    setSelectedPromoFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const handleCuisineSelect = useCallback((cuisine: string) => {
    setSelectedCuisine(cuisine);
  }, []);

  const handlePriceRangeSelect = useCallback((range: string) => {
    setSelectedPriceRange(range);
  }, []);

  const handleSortSelect = useCallback((sort: string) => {
    setSortBy(sort);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      selectedCuisine ||
      selectedPriceRange ||
      selectedDeliveryTime ||
      selectedRating ||
      selectedDietaryRestrictions.length > 0
    );
  }, [
    selectedCuisine,
    selectedPriceRange,
    selectedDeliveryTime,
    selectedRating,
    selectedDietaryRestrictions,
  ]);

  const clearAllFilters = useCallback(() => {
    setSelectedCuisine('');
    setSelectedPriceRange('');
    setSelectedDeliveryTime('');
    setSelectedRating('');
    setSelectedDietaryRestrictions([]);
    setSelectedPromoFilters([]);
    setSortBy('relevance');
  }, []);

  const clearPromoFilters = useCallback(() => {
    setSelectedPromoFilters([]);
  }, []);

  const applyFilters = useCallback(() => {
    Alert.alert(
      'Filters Applied',
      'Search results updated with your preferences!',
    );
    setFilterVisible(false);
    setSortVisible(false);
    setPromoVisible(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    Keyboard.dismiss();
  }, []);

  const closeFilterModal = useCallback(() => setFilterVisible(false), []);
  const closeSortModal = useCallback(() => setSortVisible(false), []);
  const closePromoModal = useCallback(() => setPromoVisible(false), []);

  const openFilterModal = useCallback(() => setFilterVisible(true), []);
  const openSortModal = useCallback(() => setSortVisible(true), []);
  const openPromoModal = useCallback(() => setPromoVisible(true), []);

  // Memoized render functions
  const renderCuisineLabel = useCallback(
    (cuisine: (typeof CUISINE_TYPES)[0]) => (
      <View className="flex-row items-center space-x-2">
        <Text className="mr-1">{cuisine.icon}</Text>
        <Text className="text-sm">{cuisine.name}</Text>
      </View>
    ),
    [],
  );

  const renderPriceLabel = useCallback(
    (range: (typeof PRICE_RANGES)[0]) => <Text>{range.label}</Text>,
    [],
  );

  const renderSortLabel = useCallback(
    (option: (typeof SORT_OPTIONS)[0]) => (
      <Text className="text-base">{option.label}</Text>
    ),
    [],
  );

  // Memoized components
  const FilterModal = useMemo(
    () => (
      <Modal
        visible={filterVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={closeFilterModal} className="p-2">
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Filters</Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text className="text-primaryColor font-semibold">Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <FilterSection title="Cuisine Type">
              <RadioButton.Group
                onValueChange={handleCuisineSelect}
                value={selectedCuisine}
              >
                {CUISINE_TYPES.map((cuisine) => (
                  <RadioButtonItem
                    key={cuisine.id}
                    item={cuisine}
                    selectedValue={selectedCuisine}
                    onSelect={handleCuisineSelect}
                    renderLabel={renderCuisineLabel}
                  />
                ))}
              </RadioButton.Group>
            </FilterSection>

            <FilterSection title="Price Range">
              <RadioButton.Group
                onValueChange={handlePriceRangeSelect}
                value={selectedPriceRange}
              >
                {PRICE_RANGES.map((range) => (
                  <RadioButtonItem
                    key={range.id}
                    item={range}
                    selectedValue={selectedPriceRange}
                    onSelect={handlePriceRangeSelect}
                    renderLabel={renderPriceLabel}
                  />
                ))}
              </RadioButton.Group>
            </FilterSection>
          </ScrollView>

          <View className="p-4 bg-white border-t border-gray-200">
            <Button
              mode="contained"
              onPress={applyFilters}
              buttonColor="#077aff"
              className="py-1"
            >
              Apply Filters
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    ),
    [
      filterVisible,
      selectedCuisine,
      selectedPriceRange,
      closeFilterModal,
      clearAllFilters,
      applyFilters,
      handleCuisineSelect,
      handlePriceRangeSelect,
      renderCuisineLabel,
      renderPriceLabel,
    ],
  );

  const SortModal = useMemo(
    () => (
      <Modal
        visible={sortVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={closeSortModal}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">Sort By</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView className="flex-1 p-4">
            <RadioButton.Group onValueChange={handleSortSelect} value={sortBy}>
              {SORT_OPTIONS.map((option) => (
                <RadioButtonItem
                  key={option.id}
                  item={option}
                  selectedValue={sortBy}
                  onSelect={handleSortSelect}
                  renderLabel={renderSortLabel}
                />
              ))}
            </RadioButton.Group>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <Button
              mode="contained"
              onPress={applyFilters}
              buttonColor="#077aff"
              className="py-1"
            >
              Apply Sort
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    ),
    [
      sortVisible,
      sortBy,
      closeSortModal,
      applyFilters,
      handleSortSelect,
      renderSortLabel,
    ],
  );

  const PromoModal = useMemo(
    () => (
      <Modal
        visible={promoVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={closePromoModal}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">Promotions</Text>
            <TouchableOpacity onPress={clearPromoFilters}>
              <Text className="text-primaryColor font-semibold">Clear</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Text className="text-gray-600 mb-4">
              Select the types of promotions you&apos;re interested in:
            </Text>

            {PROMO_OPTIONS.map((promo) => (
              <CheckboxItem
                key={promo.id}
                item={promo}
                isSelected={selectedPromoFilters.includes(promo.id)}
                onToggle={togglePromoFilter}
              />
            ))}
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <Button
              mode="contained"
              onPress={applyFilters}
              buttonColor="#077aff"
              className="py-1"
            >
              Show Promotions
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    ),
    [
      promoVisible,
      selectedPromoFilters,
      closePromoModal,
      clearPromoFilters,
      applyFilters,
      togglePromoFilter,
    ],
  );

  // Memoized SearchHeader
  const SearchHeader = useMemo(
    () => (
      <View className="flex-row px-2 items-center py-3 " >
        <TouchableOpacity
          onPress={goBack}
          className="bg-primary rounded-full p-2"
        >
          <MaterialIcons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <KeyboardAvoidingView
          className="flex-1 ml-3"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TextInput
            placeholder="Search for your cravings.."
            mode="outlined"
            value={searchQuery}
            onChangeText={setSearchQuery}
            outlineStyle={{
              borderColor: '#c4def8',
              borderWidth: 1,
              borderRadius: 20,
            }}
            style={{
              backgroundColor: 'rgb(202, 221, 247)',
              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 10,
              paddingLeft: 10,
            }}
            placeholderTextColor="#999"
            left={
              <TextInput.Icon
                icon="magnify"
                size={30}
                color="black"
                background="rgb(202, 221, 240)"
                className="pt-3"
              />
            }
            right={
              searchQuery ? (
                <TextInput.Icon
                  icon="close"
                  onPress={clearSearch}
                  className="items-center pt-2"
                />
              ) : null
            }
            className="flex-1"
            autoFocus={true}
            contentStyle={{ marginRight: -10, marginLeft: 45 }}
          />
        </KeyboardAvoidingView>
      </View>
    ),
    [searchQuery, clearSearch],
  );

  // Memoized CategoryHeader
  const CategoryHeader = useMemo(() => {
    if (type !== 'category') return null;

    return (
      <View className="flex-row items-center px-4 py-2 bg-white mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          className="active:bg-gray-100 p-2 rounded-full"
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={21}
            color={lightTheme.colors.primary}
          />
        </TouchableOpacity>
        <Text className="text-[20px] font-semibold text-gray-800 flex-1 text-center">
          {category}
        </Text>
      </View>
    );
  }, [type, category, navigation]);

  // Memoized filter buttons
  const filterButtons = useMemo(
    () => (
      <View className="flex-row justify-around items-center my-3 space-x-1 px-2">
        <TouchableOpacity
          className={`flex-row items-center border-[2px] border-solid border-primary p-2 shadow-sm rounded-full ${
            hasActiveFilters ? 'bg-primary' : 'bg-white'
          }`}
          onPress={openFilterModal}
        >
          <Feather
            name="sliders"
            size={18}
            color={hasActiveFilters ? '#fff' : '#077aff'}
          />
          <Text
            className={`ml-1 ${hasActiveFilters ? 'text-white' : 'text-primaryColor'}`}
          >
            Filter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`border-[2px] border-solid border-primary p-2 shadow-sm rounded-full ${
            sortBy !== 'relevance' ? 'bg-primary' : 'bg-white'
          }`}
          onPress={openSortModal}
        >
          <Text
            className={`${sortBy !== 'relevance' ? 'text-white' : 'text-primary'}`}
          >
            Sort By
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`border-[2px] border-solid border-primary p-2 shadow-sm rounded-full ${
            selectedPromoFilters.length > 0 ? 'bg-primary' : 'bg-white'
          }`}
          onPress={openPromoModal}
        >
          <Text
            className={`${selectedPromoFilters.length > 0 ? 'text-white' : 'text-primary'}`}
          >
            Promo
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [
      hasActiveFilters,
      sortBy,
      selectedPromoFilters.length,
      openFilterModal,
      openSortModal,
      openPromoModal,
    ],
  );

  const { data: MenuItems, isLoading, error } = useGetAllMenu();
  const { colors } = useTheme();
  if (error) {
    return (
      <CommonView>
        <View
          className="flex-1 px-1 py-3 h-full justify-center items-center"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-3xl font-semibold text-red-400">
            {error.message}
            {/* image to be added */}
          </Text>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      {type === 'category' ? CategoryHeader : SearchHeader}

      {filterButtons}

      {/* Search Results */}
      {isLoading ? (
        <LoadingScreen />
      ) : MenuItems && MenuItems.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 flex-row flex-wrap justify-between px-2">
            <FlatList
              data={MenuItems}
              renderItem={({ item }) => (
                <FoodItemCard
                  key={item.id}
                  foodId={item.id}
                  restarantId={item.restaurantID}
                  FoodName={item.name}
                  FoodPrice={item.price!}
                  FoodImage={item.image}
                  RestarantName={''}
                  distanceFromUser={item.distance!}
                  DeliveryPrice={4000}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <MaterialCommunityIcons name="food-off" size={80} color="#ccc" />
          <Text className="text-gray-500 text-lg mt-4">No results found</Text>
          <Text className="text-gray-400 text-sm mt-2">
            Try a different search term or adjust your filters.
          </Text>
        </View>
      )}

      {FilterModal}
      {SortModal}
      {PromoModal}
    </CommonView>
  );
};

export default SearchScreen;
