import {
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { TextInput, Checkbox, RadioButton, Button } from 'react-native-paper';
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
import {
  RootStackScreenProps,
} from '@/src/navigation/types';

const SearchScreen: React.FC<RootStackScreenProps<'SearchScreen'>> = ({
  navigation,
  route,
}) => {
  const { type, category, categoryId } = route.params;
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
    useState([]);
  const [selectedPromoFilters, setSelectedPromoFilters] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  // Static data - memoized for performance
  const cuisineTypes = [
    { id: 'african', name: 'African', icon: '🍲' },
    { id: 'cameroon', name: 'Cameroon Traditional', icon: '🇨🇲' },
    { id: 'fastfood', name: 'Fast Food', icon: '🍔' },
    { id: 'bakery', name: 'Bakery & Pastries', icon: '🥐' },
  ];
  const priceRanges = [
    { id: 'budget', label: 'Budget (< 2,000 XAF)', value: '0-2000' },
    {
      id: 'moderate',
      label: 'Moderate (2,000 - 5,000 XAF)',
      value: '2000-5000',
    },
    {
      id: 'premium',
      label: 'Premium (5,000 - 10,000 XAF)',
      value: '5000-10000',
    },
    { id: 'luxury', label: 'Luxury (> 10,000 XAF)', value: '10000+' },
  ];

  const promoOptions = [
    { id: 'discount', name: 'Discounts Available', icon: '💰' },
    { id: 'buy-one-get-one', name: 'Buy 1 Get 1', icon: '🎁' },
    { id: 'new-customer', name: 'New Customer Offers', icon: '✨' },
  ];

  const sortOptions = [
    { id: 'delivery-time', label: 'Fastest Delivery' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'distance', label: 'Nearest First' },
  ];

  // Optimized toggle functions
 

  const togglePromoFilter = useCallback((id: string) => {
    setSelectedPromoFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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

  // Reusable section component
  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => (
    <View className="bg-white mb-2 mx-3 p-4 rounded-xl border-gray-200 border-solid">
      <Text className="text-lg font-semibold mb-3 text-gray-800">{title}</Text>
      <View className="h-[1px] bg-gray-200 flex mx-2 mb-3" />
      {children}
    </View>
  );

  // Filter Modal
  const FilterModal = () => (
    <Modal
      visible={filterVisible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => setFilterVisible(false)}
            className="p-2"
          >
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Filters</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text className="text-primaryColor font-semibold">Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Cuisine Types */}
          <FilterSection title="Cuisine Type">
            <RadioButton.Group
              onValueChange={setSelectedCuisine}
              value={selectedCuisine}
            >
              {cuisineTypes.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine.id}
                  onPress={() => setSelectedCuisine(cuisine.id)}
                  className="flex-row items-center justify-between px-3 py-3 rounded-lg mb-1 "
                >
                  <View className="flex-row items-center space-x-2">
                    <Text className="mr-1">{cuisine.icon}</Text>
                    <Text className="text-sm ">{cuisine.name}</Text>
                  </View>
                  <RadioButton value={cuisine.id} color="#077aff" />
                </TouchableOpacity>
              ))}
            </RadioButton.Group>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <RadioButton.Group
              onValueChange={setSelectedPriceRange}
              value={selectedPriceRange}
            >
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  onPress={() => setSelectedPriceRange(range.value)}
                  className="flex-row items-center justify-between px-3 py-3 rounded-lg mb-1 "
                >
                  <Text>{range.label}</Text>
                  <RadioButton value={range.value} color="#077aff" />
                </TouchableOpacity>
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
  );

  // Sort Modal
  const SortModal = () => (
    <Modal
      visible={sortVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => setSortVisible(false)}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Sort By</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          <RadioButton.Group onValueChange={setSortBy} value={sortBy}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSortBy(option.id)}
                className={`flex-row items-center justify-between px-3 py-4 rounded-lg mb-1 `}
              >
                <Text className={`text-base `}>{option.label}</Text>
                <RadioButton value={option.id} color="#077aff" />
              </TouchableOpacity>
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
  );

  // Promo Modal
  const PromoModal = () => (
    <Modal
      visible={promoVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => setPromoVisible(false)}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Promotions</Text>
          <TouchableOpacity onPress={() => setSelectedPromoFilters([])}>
            <Text className="text-primaryColor font-semibold">Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <Text className="text-gray-600 mb-4">
            Select the types of promotions you&apos;re interested in:
          </Text>

          {promoOptions.map((promo) => (
            <TouchableOpacity
              key={promo.id}
              onPress={() => togglePromoFilter(promo.id)}
              className={`flex-row items-center justify-between px-3 py-4 rounded-lg mb-1 `}
            >
              <View className="flex-row items-center space-x-2">
                <Text className="mr-2 text-lg">{promo.icon}</Text>
                <Text className={`text-base `}>{promo.name}</Text>
              </View>
              <Checkbox
                status={
                  selectedPromoFilters.includes(promo.id)
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => togglePromoFilter(promo.id)}
                color="#077aff"
              />
            </TouchableOpacity>
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
  );
  // Search Header
  const SearchHeader = () => (
    <View className="flex-row px-2 items-center py-3 bg-white">
      <TouchableOpacity
        onPress={goBack}
        className="bg-primaryColor rounded-full p-2"
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
            backgroundColor: 'rgb(202, 221, 240)',
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
  );
  // Category Header
  const CategoryHeader = ({ title }: { title?: string }) => {
    return (
      <View className="flex-row items-center  px-4 py-2 bg-white   mb-4">
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
        <Text className="text-[20px] font-semibold text-gray-800 flex-1 text-center">{title}</Text>
      </View>
    );
  };

  return (
    <CommonView>
      {/* Header with Search */}
      {type === 'category' ? (
        <CategoryHeader title={category} />
      ) : (
        <SearchHeader />
      )}
      {/* Filter Buttons */}
      <View className="flex-row justify-around items-center my-3 space-x-1 px-2">
        <TouchableOpacity
          className={`flex-row items-center border-[2px] border-solid border-primaryColor p-2 shadow-sm rounded-full ${
            hasActiveFilters ? 'bg-primaryColor' : 'bg-white'
          }`}
          onPress={() => setFilterVisible(true)}
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
          className={`border-[2px] border-solid border-primaryColor p-2 shadow-sm rounded-full ${
            sortBy !== 'relevance' ? 'bg-primaryColor' : 'bg-white'
          }`}
          onPress={() => setSortVisible(true)}
        >
          <Text
            className={`${sortBy !== 'relevance' ? 'text-white' : 'text-primaryColor'}`}
          >
            Sort By
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`border-[2px] border-solid border-primaryColor p-2 shadow-sm rounded-full ${
            selectedPromoFilters.length > 0 ? 'bg-primaryColor' : 'bg-white'
          }`}
          onPress={() => setPromoVisible(true)}
        >
          <Text
            className={`${selectedPromoFilters.length > 0 ? 'text-white' : 'text-primaryColor'}`}
          >
            Promo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Placeholder */}
      <View className="flex-1 items-center justify-center">
        <MaterialCommunityIcons name="food-variant" size={80} color="#ccc" />
        <Text className="text-gray-500 text-lg mt-4">
          Start typing to search for food
        </Text>
        <Text className="text-gray-400 text-sm mt-2">
          Try &quot;Ndolé&quot;, &quot;Pizza&quot;, or &quot;Poulet DG&quot;
        </Text>
      </View>

      <FilterModal />
      <SortModal />
      <PromoModal />
    </CommonView>
  );
};

export default SearchScreen;
