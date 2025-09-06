import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';
import { RESTAURANT_COLORS } from '@/src/config/restaurantTheme';

// Type for props
// This screen is registered as 'RestaurantSettings' in RestaurantProfileStackParamList
// So use RestaurantProfileStackScreenProps<'RestaurantSettings'>
type Props = RestaurantProfileStackScreenProps<'RestaurantSettings'>;

const RestaurantSettingsScreen = ({ navigation }: Props) => {
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const [restaurantName, setRestaurantName] = useState('The Great Eatery');
  const [address, setAddress] = useState('123 Food Street, City');
  const [cuisine, setCuisine] = useState('Italian, American');
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [showOnMap, setShowOnMap] = useState(true);

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

  return (
    <View style={styles.container}>
      {/* Animated Gradient Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerAnim }],
        }}
      >
        <LinearGradient
          colors={[RESTAURANT_COLORS.GRADIENT_START, RESTAURANT_COLORS.GRADIENT_END]}
          style={styles.header}
          start={[0, 0]}
          end={[1, 1]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restaurant Settings</Text>
          <MaterialCommunityIcons name="store-cog-outline" size={32} color="#fff" style={{ marginLeft: 10 }} />
        </LinearGradient>
      </Animated.View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View style={{ opacity: contentAnim, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Restaurant Info</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder="Restaurant Name"
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cuisine</Text>
            <TextInput
              style={styles.input}
              value={cuisine}
              onChangeText={setCuisine}
              placeholder="Cuisine"
              placeholderTextColor="#aaa"
            />
          </View>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Accepting Orders</Text>
            <Switch
              value={acceptingOrders}
              onValueChange={setAcceptingOrders}
              trackColor={{ false: '#ccc', true: RESTAURANT_COLORS.PRIMARY }}
              thumbColor={acceptingOrders ? RESTAURANT_COLORS.PRIMARY : '#fff'}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Show on Map</Text>
            <Switch
              value={showOnMap}
              onValueChange={setShowOnMap}
              trackColor={{ false: '#ccc', true: RESTAURANT_COLORS.PRIMARY }}
              thumbColor={showOnMap ? RESTAURANT_COLORS.PRIMARY : '#fff'}
            />
          </View>
          <TouchableOpacity style={styles.saveBtn}>
            <Ionicons name="save-outline" size={22} color="#fff" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RESTAURANT_COLORS.BACKGROUND_LIGHT,
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
    color: '#fff',
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
  inputGroup: {
    marginBottom: 18,
    marginHorizontal: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: RESTAURANT_COLORS.PRIMARY,
    marginBottom: 4,
  },
  input: {
    backgroundColor: RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1.2,
    borderColor: RESTAURANT_COLORS.BORDER_LIGHT,
    color: RESTAURANT_COLORS.TEXT_LIGHT,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RESTAURANT_COLORS.SURFACE_LIGHT,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: RESTAURANT_COLORS.BORDER_LIGHT,
  },
  switchLabel: {
    fontSize: 15,
    color: RESTAURANT_COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RESTAURANT_COLORS.PRIMARY,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    marginHorizontal: 20,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: RESTAURANT_COLORS.PRIMARY,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default RestaurantSettingsScreen;