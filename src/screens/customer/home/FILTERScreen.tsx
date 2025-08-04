// import React, { useState, useEffect } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import { TextInput, Appbar } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import CommonView from '@/src/components/common/CommonView';
// import FoodItemCard from '@/src/components/customer/FoodItemCard';
// import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
// import { images } from '@/assets/images';

// const { width } = Dimensions.get('window');

// // Types for the screen params
// type FilteredResultsScreenProps = CustomerHomeStackScreenProps<'FilteredResults'> & {
//   route: {
//     params: {
//       type: 'category' | 'search';
//       categoryName?: string;
//       categoryId?: string;
//       initialSearchQuery?: string;
//     };
//   };
// };

// // Filter options
// const filterOptions = [
//   { id: 'all', title: 'All', isActive: true },
//   { id: 'popular', title: 'Popular', isActive: false },
//   { id: 'nearest', title: 'Nearest', isActive: false },
//   { id: 'rating', title: 'Top Rated', isActive: false },
//   { id: 'price_low', title: 'Price: Low', isActive: false },
//   { id: 'price_high', title: 'Price: High', isActive: false },
//   { id: 'fastest', title: 'Fastest', isActive: false },
// ];

// const FilteredResultsScreen = ({ navigation, route }: FilteredResultsScreenProps) => {
//   const { type, categoryName, categoryId, initialSearchQuery } = route.params;
  
//   // State management
//   const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [isSearchFocused, setIsSearchFocused] = useState(type === 'search');
//   const [filteredResults, setFilteredResults] = useState([]);

//   // Mock data - replace with your actual data
//   const mockFoodItems = [
//     {
//       id: '1',
//       FoodName: 'Chicken Wings',
//       FoodPrice: 12.99,
//       FoodImage: images.onboarding2,
//       RestarantName: 'The Chicken Spot',
//       distanceFromUser: 1.2,
//       DeliveryPrice: 2.5,
//       category: 'chicken',
//       rating: 4.5,
//     },
//     {
//       id: '2',
//       FoodName: 'Beef Burger',
//       FoodPrice: 15.5,
//       FoodImage: images.onboarding2,
//       RestarantName: 'Burger Joint',
//       distanceFromUser: 2.5,
//       DeliveryPrice: 3.0,
//       category: 'burger',
//       rating: 4.2,
//     },
//     // Add more mock data as needed
//   ];

//   // Filter data based on search query and active filter
//   useEffect(() => {
//     let results = mockFoodItems;

//     // Filter by category if coming from category selection
//     if (type === 'category' && categoryId) {
//       results = results.filter(item => item.category === categoryId);
//     }

//     // Filter by search query
//     if (searchQuery.trim()) {
//       results = results.filter(item =>
//         item.FoodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.RestarantName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply additional filters
//     switch (activeFilter) {
//       case 'popular':
//         results = results.sort((a, b) => b.rating - a.rating);
//         break;
//       case 'nearest':
//         results = results.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
//         break;
//       case 'rating':
//         results = results.sort((a, b) => b.rating - a.rating);
//         break;
//       case 'price_low':
//         results = results.sort((a, b) => a.FoodPrice - b.FoodPrice);
//         break;
//       case 'price_high':
//         results = results.sort((a, b) => b.FoodPrice - a.FoodPrice);
//         break;
//       case 'fastest':
//         results = results.sort((a, b) => a.DeliveryPrice - b.DeliveryPrice);
//         break;
//       default:
//         break;
//     }

//     setFilteredResults(results);
//   }, [searchQuery, activeFilter, categoryId, type]);

//   // Render header based on screen type
//   const renderHeader = () => {
//     if (type === 'search' || isSearchFocused) {
//       return (
//         <View className="px-3 py-2 bg-white">
//           <TextInput
//             placeholder="Search your craving"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             onFocus={() => setIsSearchFocused(true)}
//             left={
//               <TextInput.Icon
//                 icon="magnify"
//                 size={24}
//                 color={'black'}
//               />
//             }
//             right={
//               searchQuery ? (
//                 <TextInput.Icon
//                   icon="close"
//                   size={20}
//                   onPress={() => setSearchQuery('')}
//                 />
//               ) : null
//             }
//             mode="outlined"
//             outlineStyle={{
//               borderColor: '#c4def8',
//               borderWidth: 1,
//               borderRadius: 20,
//             }}
//             style={{
//               backgroundColor: 'rgb(202, 221, 240)',
//               paddingVertical: 5,
//               paddingHorizontal: 10,
//             }}
//             placeholderTextColor="#999"
//             autoFocus={type === 'search'}
//           />
//         </View>
//       );
//     }

//     return (
//       <View className="px-4 py-3 bg-white border-b border-gray-100">
//         <View className="flex-row items-center justify-between">
//           <View>
//             <Text className="text-2xl font-bold text-gray-800">
//               {categoryName || 'Category'}
//             </Text>
//             <Text className="text-sm text-gray-500 mt-1">
//               {filteredResults.length} items found
//             </Text>
//           </View>
//           <TouchableOpacity 
//             onPress={() => setIsSearchFocused(true)}
//             className="bg-gray-100 p-2 rounded-full"
//           >
//             <Ionicons name="search" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   // Render filter item
//   const renderFilterItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => setActiveFilter(item.id)}
//       className={`mr-3 px-4 py-2 rounded-full border ${
//         activeFilter === item.id
//           ? 'bg-blue-500 border-blue-500'
//           : 'bg-white border-gray-300'
//       }`}
//       style={{
//         minWidth: 80,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 2,
//       }}
//     >
//       <Text
//         className={`text-sm font-medium ${
//           activeFilter === item.id ? 'text-white' : 'text-gray-700'
//         }`}
//       >
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <CommonView>
//       {/* App Bar */}
//       <Appbar.Header className="bg-white elevation-2">
//         <Appbar.BackAction onPress={() => navigation.goBack()} />
//         <Appbar.Content 
//           title={type === 'search' ? 'Search Results' : categoryName || 'Category'} 
//           titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
//         />
//         {type === 'category' && !isSearchFocused && (
//           <Appbar.Action 
//             icon="tune" 
//             onPress={() => {
//               // Handle additional filters/sorting options
//             }} 
//           />
//         )}
//       </Appbar.Header>

//       <ScrollView 
//         className="flex-1 bg-gray-50"
//         showsVerticalScrollIndicator={false}
//         stickyHeaderIndices={[0]}
//       >
//         {/* Dynamic Header */}
//         <View className="bg-white">
//           {renderHeader()}
//         </View>

//         {/* Horizontal Filters */}
//         <View className="bg-white pb-3">
//           <FlatList
//             data={filterOptions}
//             renderItem={renderFilterItem}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{
//               paddingHorizontal: 16,
//               paddingTop: 8,
//             }}
//           />
//         </View>

//         {/* Results */}
//         <View className="px-3 pt-2">
//           {filteredResults.length > 0 ? (
//             filteredResults.map((item) => (
//               <FoodItemCard
//                 key={item.id}
//                 foodId={item.id}
//                 restarantId={item.id}
//                 FoodName={item.FoodName}
//                 FoodImage={item.FoodImage}
//                 RestarantName={item.RestarantName}
//                 distanceFromUser={item.distanceFromUser}
//                 DeliveryPrice={item.DeliveryPrice}
//                 FoodPrice={item.FoodPrice}
//               />
//             ))
//           ) : (
//             <View className="flex-1 items-center justify-center py-20">
//               <Ionicons name="search-outline" size={64} color="#ccc" />
//               <Text className="text-lg text-gray-500 mt-4">No results found</Text>
//               <Text className="text-sm text-gray-400 mt-2 text-center px-8">
//                 Try adjusting your search or filters to find what you're looking for
//               </Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </CommonView>
//   );
// };

// export default FilteredResultsScreen;


// // 1. First, update your navigation types (types.ts)
// export type CustomerHomeStackParamList = {
//   HomeScreen: undefined;
//   SearchScreen: undefined;
//   FilteredResults: {
//     type: 'category' | 'search';
//     categoryName?: string;
//     categoryId?: string;
//     initialSearchQuery?: string;
//   };
//   FoodDetails: {
//     foodId: string;
//     restaurantId: string;
//   };
//   // ... other screens
// };

// // 2. Usage in CategoryItem component - when category is clicked
// const CategoryItem = ({ image, title, categoryId, onPress }) => {
//   const navigation = useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  
//   const handleCategoryPress = () => {
//     navigation.navigate('FilteredResults', {
//       type: 'category',
//       categoryName: title,
//       categoryId: categoryId,
//     });
//   };

//   return (
//     <TouchableOpacity onPress={handleCategoryPress}>
//       {/* Your category item UI */}
//     </TouchableOpacity>
//   );
// };

// // 3. Usage in HomeScreen - when search bar is clicked
// const HomeScreen = ({ navigation }) => {
//   const handleSearchPress = () => {
//     navigation.navigate('FilteredResults', {
//       type: 'search',
//     });
//   };

//   return (
//     <CommonView>
//       <ScrollView>
//         {/* Other components */}
        
//         <TouchableNativeFeedback onPress={handleSearchPress}>
//           <TextInput
//             placeholder="Search your craving"
//             editable={false} // Make it non-editable since it's just for navigation
//             left={
//               <TextInput.Icon
//                 icon="magnify"
//                 size={30}
//                 color={'black'}
//               />
//             }
//             mode="outlined"
//             // ... your existing styles
//           />
//         </TouchableNativeFeedback>
        
//         {/* Rest of your components */}
//       </ScrollView>
//     </CommonView>
//   );
// };

// // 4. Alternative: Direct search navigation with query
// const handleSearchWithQuery = (searchQuery: string) => {
//   navigation.navigate('FilteredResults', {
//     type: 'search',
//     initialSearchQuery: searchQuery,
//   });
// };

// // 5. If you want to add the screen to your stack navigator
// const CustomerHomeStack = createStackNavigator<CustomerHomeStackParamList>();

// function CustomerHomeStackNavigator() {
//   return (
//     <CustomerHomeStack.Navigator>
//       <CustomerHomeStack.Screen name="HomeScreen" component={HomeScreen} />
//       <CustomerHomeStack.Screen 
//         name="FilteredResults" 
//         component={FilteredResultsScreen}
//         options={{ headerShown: false }} // We handle header in the component
//       />
//       <CustomerHomeStack.Screen name="FoodDetails" component={FoodDetailsScreen} />
//       {/* Other screens */}
//     </CustomerHomeStack.Navigator>
//   );
// }
