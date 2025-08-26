```typescript
// hooks/useLocation.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAddressStore } from '../store/addressStore';
import { useRestaurantStore } from '../store/restaurantStore';
import LocationService from '../services/locationService';
import ApiService from '../services/apiService';
import { Coordinates, AddressData } from '../types/location';

export const useLocation = () => {
  const {
    currentLocation,
    isLoadingLocation,
    locationError,
    addresses,
    selectedAddress,
    setCurrentLocation,
    setLocationLoading,
    setLocationError,
    addAddress,
    setSelectedAddress,
    getCurrentCoordinatesForServer,
  } = useAddressStore();

  const {
    fetchRestaurantsWithDistances,
    updateRestaurantDistances,
  } = useRestaurantStore();

  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // Request permission on hook initialization
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Update restaurant distances when location changes
  useEffect(() => {
    const coordinates = getCurrentCoordinatesForServer();
    if (coordinates) {
      updateRestaurantDistances(coordinates);
      
      // Optional: Update user location on server
      ApiService.updateUserLocation(coordinates).catch(console.error);
    }
  }, [currentLocation, selectedAddress]);

  const requestLocationPermission = async () => {
    try {
      const granted = await LocationService.requestLocationPermission();
      setHasLocationPermission(granted);
      
      if (!granted) {
        setLocationError('Location permission is required for delivery');
      }
    } catch (error) {
      setLocationError('Failed to request location permission');
    }
  };

  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const location = await LocationService.getCurrentLocation();
      
      if (location) {
        // Check if within delivery zone
        if (!LocationService.isWithinYaoundeDeliveryZone(location)) {
          Alert.alert(
            'Outside Delivery Zone',
            'Your location appears to be outside our Yaoundé delivery area. You can still add addresses within the city.',
            [{ text: 'OK' }]
          );
        }
        
        setCurrentLocation(location);
        
        // Automatically fetch restaurants with distances
        fetchRestaurantsWithDistances(location);
        
        return location;
      } else {
        throw new Error('Could not get your location');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationError(errorMessage);
      Alert.alert('Location Error', errorMessage);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const createAddressFromCurrentLocation = async (
    label: string = 'Current Location',
    landmark?: string
  ): Promise<AddressData | null> => {
    try {
      const location = currentLocation || await getCurrentLocation();
      if (!location) return null;

      const geocodingResult = await LocationService.reverseGeocode(location);
      if (!geocodingResult) {
        throw new Error('Could not determine address details');
      }

      const newAddress: Omit<AddressData, 'id' | 'createdAt' | 'updatedAt'> = {
        label,
        streetAddress: geocodingResult.addressComponents.streetAddress || '',
        neighborhood: geocodingResult.addressComponents.neighborhood || '',
        city: geocodingResult.addressComponents.city || 'Yaoundé',
        region: geocodingResult.addressComponents.region || 'Centre',
        country: geocodingResult.addressComponents.country || 'Cameroon',
        landmark,
        coordinates: location,
        isDefault: addresses.length === 0, // First address is default
      };

      addAddress(newAddress);
      
      // Find and return the newly created address
      const createdAddress = useAddressStore.getState().addresses.find(
        addr => addr.label === label && addr.coordinates?.latitude === location.latitude
      );
      
      return createdAddress || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create address';
      setLocationError(errorMessage);
      Alert.alert('Error', errorMessage);
      return null;
    }
  };

  const geocodeAndCreateAddress = async (
    addressText: string,
    label: string,
    landmark?: string
  ): Promise<AddressData | null> => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const geocodingResult = await LocationService.geocodeAddress(addressText);
      
      if (!geocodingResult) {
        throw new Error('Could not find this address. Please check and try again.');
      }

      // Check if within delivery zone
      if (!LocationService.isWithinYaoundeDeliveryZone(geocodingResult.coordinates)) {
        Alert.alert(
          'Outside Delivery Zone',
          'This address appears to be outside our Yaoundé delivery area.',
          [{ text: 'OK' }]
        );
      }

      const newAddress: Omit<AddressData, 'id' | 'createdAt' | 'updatedAt'> = {
        label,
        streetAddress: geocodingResult.addressComponents.streetAddress || addressText,
        neighborhood: geocodingResult.addressComponents.neighborhood || '',
        city: geocodingResult.addressComponents.city || 'Yaoundé',
        region: geocodingResult.addressComponents.region || 'Centre',
        country: geocodingResult.addressComponents.country || 'Cameroon',
        landmark,
        coordinates: geocodingResult.coordinates,
        isDefault: addresses.length === 0,
      };

      addAddress(newAddress);
      
      // Find and return the newly created address
      const createdAddress = useAddressStore.getState().addresses.find(
        addr => addr.label === label && addr.coordinates?.latitude === geocodingResult.coordinates.latitude
      );
      
      return createdAddress || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create address';
      setLocationError(errorMessage);
      Alert.alert('Error', errorMessage);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const refreshRestaurantDistances = async () => {
    const coordinates = getCurrentCoordinatesForServer();
    if (coordinates) {
      await fetchRestaurantsWithDistances(coordinates);
    }
  };

  const getCoordinatesForServer = (): Coordinates | null => {
    return getCurrentCoordinatesForServer();
  };

  return {
    // State
    currentLocation,
    isLoadingLocation,
    locationError,
    hasLocationPermission,
    addresses,
    selectedAddress,
    
    // Actions
    requestLocationPermission,
    getCurrentLocation,
    createAddressFromCurrentLocation,
    geocodeAndCreateAddress,
    refreshRestaurantDistances,
    
    // Utils
    getCoordinatesForServer,
    isWithinDeliveryZone: (coords: Coordinates) => 
      LocationService.isWithinYaoundeDeliveryZone(coords),
  };
};
```# Location Setup for Cameroon Food Delivery MVP

## Installation Dependencies

```bash
# Core location dependencies
npm install expo-location @react-native-async-storage/async-storage zustand

# For HTTP requests to server
npm install axios

# For maps (optional - can be added later)
npm install react-native-maps
```

## 1. Types and Interfaces

```typescript
// types/location.ts
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressData {
  id: string;
  label: string;
  streetAddress: string;
  neighborhood: string; // Quarter in Cameroon
  city: string;
  region: string;
  country: string;
  landmark?: string; // Important for Cameroon addresses
  coordinates?: Coordinates;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  coordinates: Coordinates;
  distance?: number; // Distance in km (calculated by server)
  deliveryTime?: string; // e.g., "20-30 min"
  deliveryFee?: number; // Delivery fee in FCFA
}

export interface LocationState {
  addresses: AddressData[];
  currentLocation: Coordinates | null;
  selectedAddress: AddressData | null;
  isLoadingLocation: boolean;
  locationError: string | null;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  formattedAddress: string;
  addressComponents: {
    streetAddress?: string;
    neighborhood?: string;
    city?: string;
    region?: string;
    country?: string;
  };
}
```

## 2. Zustand Address Store

```typescript
// store/addressStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddressData, LocationState, Coordinates } from '../types/location';

// Simple ID generator (no external dependency)
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

interface AddressStore extends LocationState {
  // Actions
  addAddress: (address: Omit<AddressData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAddress: (id: string, updates: Partial<AddressData>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setSelectedAddress: (address: AddressData | null) => void;
  setCurrentLocation: (location: Coordinates | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  loadAddresses: () => Promise<void>;
  clearAllAddresses: () => void;
  
  // New methods for server communication
  getCurrentCoordinatesForServer: () => Coordinates | null;
  getSelectedAddressCoordinates: () => Coordinates | null;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      addresses: [],
      currentLocation: null,
      selectedAddress: null,
      isLoadingLocation: false,
      locationError: null,

      // Actions
      addAddress: (addressData) => {
        const newAddress: AddressData = {
          ...addressData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // If this is the first address or marked as default, make it default
        const { addresses } = get();
        if (addresses.length === 0 || newAddress.isDefault) {
          // Remove default from other addresses
          const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: false,
          }));
          
          set({
            addresses: [...updatedAddresses, { ...newAddress, isDefault: true }],
            selectedAddress: newAddress,
          });
        } else {
          set({
            addresses: [...addresses, newAddress],
          });
        }
      },

      updateAddress: (id, updates) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id
              ? { ...addr, ...updates, updatedAt: new Date() }
              : addr
          ),
        }));

        // Update selected address if it's the one being updated
        const { selectedAddress } = get();
        if (selectedAddress?.id === id) {
          set({
            selectedAddress: { ...selectedAddress, ...updates, updatedAt: new Date() },
          });
        }
      },

      deleteAddress: (id) => {
        const { addresses, selectedAddress } = get();
        const addressToDelete = addresses.find(addr => addr.id === id);
        
        if (!addressToDelete) return;

        // Can't delete default address if it's the only one
        if (addressToDelete.isDefault && addresses.length === 1) {
          set({ locationError: 'Cannot delete the only address' });
          return;
        }

        const remainingAddresses = addresses.filter(addr => addr.id !== id);

        // If deleted address was default, make the first remaining address default
        if (addressToDelete.isDefault && remainingAddresses.length > 0) {
          remainingAddresses[0].isDefault = true;
          set({
            addresses: remainingAddresses,
            selectedAddress: remainingAddresses[0],
          });
        } else {
          set({
            addresses: remainingAddresses,
            selectedAddress: selectedAddress?.id === id ? null : selectedAddress,
          });
        }
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      setSelectedAddress: (address) => {
        set({ selectedAddress: address });
      },

      setCurrentLocation: (location) => {
        set({ currentLocation: location });
      },

      setLocationLoading: (loading) => {
        set({ isLoadingLocation: loading });
      },

      setLocationError: (error) => {
        set({ locationError: error });
      },

      loadAddresses: async () => {
        // This is handled by the persist middleware
        // Additional loading logic can be added here if needed
      },

      clearAllAddresses: () => {
        set({
          addresses: [],
          selectedAddress: null,
          locationError: null,
        });
      },

      // New methods for server communication
      getCurrentCoordinatesForServer: () => {
        const { currentLocation, selectedAddress } = get();
        
        // Priority: selected address coordinates > current location
        if (selectedAddress?.coordinates) {
          return selectedAddress.coordinates;
        }
        
        return currentLocation;
      },

      getSelectedAddressCoordinates: () => {
        const { selectedAddress } = get();
        return selectedAddress?.coordinates || null;
      },
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        addresses: state.addresses,
        selectedAddress: state.selectedAddress,
      }),
    }
  )
);
```

## 3. API Service for Server Communication

```typescript
// services/apiService.ts
import axios from 'axios';
import { Coordinates, Restaurant } from '../types/location';

const API_BASE_URL = 'https://your-api.com/api'; // Replace with your actual API URL

class ApiService {
  private static instance: ApiService;
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include coordinates
    this.axiosInstance.interceptors.request.use((config) => {
      // You can add auth tokens here if needed
      // config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Fetch restaurants with distances calculated by server
   */
  async getRestaurantsWithDistances(userCoordinates: Coordinates): Promise<Restaurant[]> {
    try {
      const response = await this.axiosInstance.post('/restaurants/nearby', {
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      });

      return response.data.restaurants || [];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw new Error('Failed to load restaurants');
    }
  }

  /**
   * Get delivery estimate for a specific restaurant
   */
  async getDeliveryEstimate(
    restaurantId: string, 
    userCoordinates: Coordinates
  ): Promise<{
    distance: number;
    deliveryTime: string;
    deliveryFee: number;
  }> {
    try {
      const response = await this.axiosInstance.post('/restaurants/delivery-estimate', {
        restaurantId,
        userLatitude: userCoordinates.latitude,
        userLongitude: userCoordinates.longitude,
      });

      return response.data;
    } catch (error) {
      console.error('Error getting delivery estimate:', error);
      throw new Error('Failed to calculate delivery estimate');
    }
  }

  /**
   * Update user's location on the server (optional)
   */
  async updateUserLocation(coordinates: Coordinates, userId?: string): Promise<void> {
    try {
      await this.axiosInstance.post('/user/location', {
        userId,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user location:', error);
      // Don't throw error for location updates - it's not critical
    }
  }
}

export default ApiService.getInstance();
```

## 4. Location Services (Updated)

```typescript
// services/locationService.ts
import * as Location from 'expo-location';
import { Coordinates, GeocodingResult } from '../types/location';

class LocationService {
  private static instance: LocationService;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions from the user
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Get current location coordinates
   */
  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(coordinates: Coordinates): Promise<GeocodingResult | null> {
    try {
      const results = await Location.reverseGeocodeAsync(coordinates);
      
      if (results.length === 0) {
        return null;
      }

      const result = results[0];
      
      // Format address components for Cameroon
      const addressComponents = {
        streetAddress: result.streetNumber 
          ? `${result.streetNumber} ${result.street}` 
          : result.street || '',
        neighborhood: result.subregion || result.district || '',
        city: result.city || 'Yaoundé', // Default to Yaoundé
        region: result.region || 'Centre',
        country: result.country || 'Cameroon',
      };

      // Create formatted address
      const addressParts = [
        addressComponents.streetAddress,
        addressComponents.neighborhood,
        addressComponents.city,
        addressComponents.region,
      ].filter(Boolean);

      return {
        coordinates,
        formattedAddress: addressParts.join(', '),
        addressComponents,
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Forward geocode address text to coordinates
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      // Append Cameroon context for better results
      const searchAddress = `${address}, Cameroon`;
      const results = await Location.geocodeAsync(searchAddress);
      
      if (results.length === 0) {
        return null;
      }

      const result = results[0];
      const coordinates = {
        latitude: result.latitude,
        longitude: result.longitude,
      };

      // Get detailed address info via reverse geocoding
      const detailedInfo = await this.reverseGeocode(coordinates);
      
      return detailedInfo || {
        coordinates,
        formattedAddress: address,
        addressComponents: {
          streetAddress: address,
          city: 'Yaoundé',
          region: 'Centre',
          country: 'Cameroon',
        },
      };
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) *
        Math.cos(this.toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Check if coordinates are within Yaoundé bounds (approximate)
   */
  isWithinYaoundeDeliveryZone(coordinates: Coordinates): boolean {
    // Approximate bounds for Yaoundé
    const bounds = {
      north: 3.95,
      south: 3.75,
      east: 11.60,
      west: 11.40,
    };

    return (
      coordinates.latitude >= bounds.south &&
      coordinates.latitude <= bounds.north &&
      coordinates.longitude >= bounds.west &&
      coordinates.longitude <= bounds.east
    );
  }
}

export default LocationService.getInstance();
```

## 5. Restaurant Store with Distance Management

```typescript
// store/restaurantStore.ts
import { create } from 'zustand';
import { Restaurant, Coordinates } from '../types/location';
import ApiService from '../services/apiService';

interface RestaurantState {
  restaurants: Restaurant[];
  isLoadingRestaurants: boolean;
  restaurantError: string | null;
  lastLocationUpdate: Coordinates | null;
}

interface RestaurantStore extends RestaurantState {
  // Actions
  fetchRestaurantsWithDistances: (userCoordinates: Coordinates) => Promise<void>;
  updateRestaurantDistances: (userCoordinates: Coordinates) => Promise<void>;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setLoadingRestaurants: (loading: boolean) => void;
  setRestaurantError: (error: string | null) => void;
  clearRestaurants: () => void;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  // Initial state
  restaurants: [],
  isLoadingRestaurants: false,
  restaurantError: null,
  lastLocationUpdate: null,

  // Actions
  fetchRestaurantsWithDistances: async (userCoordinates: Coordinates) => {
    set({ isLoadingRestaurants: true, restaurantError: null });

    try {
      const restaurants = await ApiService.getRestaurantsWithDistances(userCoordinates);
      
      set({
        restaurants,
        lastLocationUpdate: userCoordinates,
        isLoadingRestaurants: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load restaurants';
      set({
        restaurantError: errorMessage,
        isLoadingRestaurants: false,
      });
    }
  },

  updateRestaurantDistances: async (userCoordinates: Coordinates) => {
    // Don't refetch if location hasn't changed significantly (>100m)
    const { lastLocationUpdate } = get();
    if (lastLocationUpdate) {
      const distance = calculateDistance(lastLocationUpdate, userCoordinates);
      if (distance < 0.1) return; // Less than 100m difference
    }

    await get().fetchRestaurantsWithDistances(userCoordinates);
  },

  setRestaurants: (restaurants: Restaurant[]) => {
    set({ restaurants });
  },

  setLoadingRestaurants: (loading: boolean) => {
    set({ isLoadingRestaurants: loading });
  },

  setRestaurantError: (error: string | null) => {
    set({ restaurantError: error });
  },

  clearRestaurants: () => {
    set({
      restaurants: [],
      restaurantError: null,
      lastLocationUpdate: null,
    });
  },
}));

// Helper function for distance calculation
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
```

## 6. Location Hook (Updated for Server Integration)

## 7. Restaurant Card Component with Distance Display

```typescript
// components/RestaurantCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Restaurant } from '../types/location';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Distance unavailable';
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const formatDeliveryTime = (deliveryTime?: string): string => {
    return deliveryTime || 'Time unavailable';
  };

  const formatDeliveryFee = (fee?: number): string => {
    if (!fee) return 'Free delivery';
    if (fee === 0) return 'Free delivery';
    return `${fee} FCFA delivery`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {restaurant.description}
        </Text>
        
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryItem}>
            <Text style={styles.deliveryLabel}>Distance</Text>
            <Text style={styles.deliveryValue}>
              {formatDistance(restaurant.distance)}
            </Text>
          </View>
          
          <View style={styles.deliveryItem}>
            <Text style={styles.deliveryLabel}>Time</Text>
            <Text style={styles.deliveryValue}>
              {formatDeliveryTime(restaurant.deliveryTime)}
            </Text>
          </View>
          
          <View style={styles.deliveryItem}>
            <Text style={styles.deliveryLabel}>Fee</Text>
            <Text style={[
              styles.deliveryValue,
              restaurant.deliveryFee === 0 && styles.freeDelivery
            ]}>
              {formatDeliveryFee(restaurant.deliveryFee)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deliveryItem: {
    flex: 1,
    alignItems: 'center',
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  freeDelivery: {
    color: '#4CAF50',
  },
});
```

## 8. Restaurant List Component

```typescript
// components/RestaurantList.tsx
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { RestaurantCard } from './RestaurantCard';
import { useRestaurantStore } from '../store/restaurantStore';
import { useLocation } from '../hooks/useLocation';
import { Restaurant } from '../types/location';

interface RestaurantListProps {
  onRestaurantPress: (restaurant: Restaurant) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ onRestaurantPress }) => {
  const {
    restaurants,
    isLoadingRestaurants,
    restaurantError,
    fetchRestaurantsWithDistances,
  } = useRestaurantStore();

  const { getCoordinatesForServer } = useLocation();

  useEffect(() => {
    // Initial load
    const coordinates = getCoordinatesForServer();
    if (coordinates) {
      fetchRestaurantsWithDistances(coordinates);
    }
  }, []);

  const onRefresh = async () => {
    const coordinates = getCoordinatesForServer();
    if (coordinates) {
      await fetchRestaurantsWithDistances(coordinates);
    }
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => onRestaurantPress(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No restaurants found</Text>
      <Text style={styles.emptySubtitle}>
        {restaurantError || 'Pull to refresh or check your location settings'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Restaurants Near You</Text>
      {restaurants.length > 0 && (
        <Text style={styles.headerSubtitle}>
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} available
        </Text>
      )}
    </View>
  );

  if (isLoadingRestaurants && restaurants.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Finding restaurants near you...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={restaurants}
      renderItem={renderRestaurant}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingRestaurants}
          onRefresh={onRefresh}
          colors={['#FF6B35']}
          tintColor="#FF6B35"
        />
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
```

## 9. Location Header Component

```typescript
// components/LocationHeader.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useAddressStore } from '../store/addressStore';
import { useLocation } from '../hooks/useLocation';

interface LocationHeaderProps {
  onLocationPress: () => void;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({ onLocationPress }) => {
  const { selectedAddress, currentLocation } = useAddressStore();
  const { isLoadingLocation, refreshRestaurantDistances } = useLocation();

  const getDisplayLocation = () => {
    if (selectedAddress) {
      return {
        label: selectedAddress.label,
        address: selectedAddress.neighborhood 
          ? `${selectedAddress.neighborhood}, ${selectedAddress.city}`
          : selectedAddress.city,
      };
    }

    if (currentLocation) {
      return {
        label: 'Current Location',
        address: 'Yaoundé, Centre',
      };
    }

    return {
      label: 'Add Location',
      address: 'Tap to set your delivery address',
    };
  };

  const location = getDisplayLocation();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onLocationPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.locationInfo}>
          <Text style={styles.label}>Deliver to</Text>
          <Text style={styles.address} numberOfLines={1}>
            {location.label}
          </Text>
          <Text style={styles.subAddress} numberOfLines={1}>
            {location.address}
          </Text>
        </View>
        
        {isLoadingLocation ? (
          <ActivityIndicator size="small" color="#FF6B35" />
        ) : (
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>▼</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 2,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subAddress: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 12,
    color: '#666',
  },
});
```

## 10. Usage Examples

### Main App Screen with Restaurant List
```typescript
// screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LocationHeader } from '../components/LocationHeader';
import { RestaurantList } from '../components/RestaurantList';
import { Restaurant } from '../types/location';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleLocationPress = () => {
    navigation.navigate('AddressSelection');
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { 
      restaurantId: restaurant.id,
      restaurant 
    });
  };

  return (
    <View style={styles.container}>
      <LocationHeader onLocationPress={handleLocationPress} />
      <RestaurantList onRestaurantPress={handleRestaurantPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
```

### Server API Expected Format
```typescript
// Expected API responses for your backend team

// POST /api/restaurants/nearby
// Request body:
{
  "latitude": 3.8480,
  "longitude": 11.5021
}

// Response:
{
  "success": true,
  "restaurants": [
    {
      "id": "rest_001",
      "name": "Chez Wou Restaurant",
      "description": "Authentic Cameroonian cuisine with modern twist",
      "image": "https://your-cdn.com/images/chez-wou.jpg",
      "rating": 4.5,
      "coordinates": {
        "latitude": 3.8456,
        "longitude": 11.5034
      },
      "distance": 1.2, // calculated by server in km
      "deliveryTime": "25-35 min",
      "deliveryFee": 500 // in FCFA
    }
  ]
}

// POST /api/restaurants/delivery-estimate
// Request body:
{
  "restaurantId": "rest_001",
  "userLatitude": 3.8480,
  "userLongitude": 11.5021
}

// Response:
{
  "success": true,
  "distance": 1.2,
  "deliveryTime": "25-35 min",
  "deliveryFee": 500
}
```

## 11. Integration in App.tsx

```typescript
// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAddressStore } from './store/addressStore';
import { useLocation } from './hooks/useLocation';

export default function App() {
  const { loadAddresses } = useAddressStore();
  const { getCurrentLocation } = useLocation();

  useEffect(() => {
    const initializeApp = async () => {
      // Load persisted addresses
      await loadAddresses();
      
      // Get current location for immediate restaurant loading
      await getCurrentLocation();
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      {/* Your navigation setup */}
    </NavigationContainer>
  );
}
```

This implementation provides:

✅ **Server-side distance calculation** - Sends coordinates to your backend
✅ **Automatic restaurant updates** - Fetches when location changes  
✅ **Distance display on cards** - Shows calculated distance, time, and fee
✅ **Real-time updates** - Updates when user changes address
✅ **Optimized API calls** - Only refetches when location changes significantly
✅ **Error handling** - Graceful handling of API failures
✅ **Loading states** - Shows loading indicators during API calls
✅ **Cameroon-optimized** - Designed for Yaoundé delivery market

The system automatically sends user coordinates to your server and displays the returned distance calculations on each restaurant card, exactly as requested!

export const useLocation = () => {
  const {
    currentLocation,
    isLoadingLocation,
    locationError,
    addresses,
    selectedAddress,
    setCurrentLocation,
    setLocationLoading,
    setLocationError,
    addAddress,
    setSelectedAddress,
  } = useAddressStore();

  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // Request permission on hook initialization
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await LocationService.requestLocationPermission();
      setHasLocationPermission(granted);
      
      if (!granted) {
        setLocationError('Location permission is required for delivery');
      }
    } catch (error) {
      setLocationError('Failed to request location permission');
    }
  };

  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const location = await LocationService.getCurrentLocation();
      
      if (location) {
        // Check if within delivery zone
        if (!LocationService.isWithinYaoundeDeliveryZone(location)) {
          Alert.alert(
            'Outside Delivery Zone',
            'Your location appears to be outside our Yaoundé delivery area. You can still add addresses within the city.',
            [{ text: 'OK' }]
          );
        }
        
        setCurrentLocation(location);
        return location;
      } else {
        throw new Error('Could not get your location');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationError(errorMessage);
      Alert.alert('Location Error', errorMessage);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const createAddressFromCurrentLocation = async (
    label: string = 'Current Location',
    landmark?: string
  ): Promise<AddressData | null> => {
    try {
      const location = currentLocation || await getCurrentLocation();
      if (!location) return null;

      const geocodingResult = await LocationService.reverseGeocode(location);
      if (!geocodingResult) {
        throw new Error('Could not determine address details');
      }

      const newAddress: Omit<AddressData, 'id' | 'createdAt' | 'updatedAt'> = {
        label,
        streetAddress: geocodingResult.addressComponents.streetAddress || '',
        neighborhood: geocodingResult.addressComponents.neighborhood || '',
        city: geocodingResult.addressComponents.city || 'Yaoundé',
        region: geocodingResult.addressComponents.region || 'Centre',
        country: geocodingResult.addressComponents.country || 'Cameroon',
        landmark,
        coordinates: location,
        isDefault: addresses.length === 0, // First address is default
      };

      addAddress(newAddress);
      
      // Find and return the newly created address
      const createdAddress = useAddressStore.getState().addresses.find(
        addr => addr.label === label && addr.coordinates?.latitude === location.latitude
      );
      
      return createdAddress || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create address';
      setLocationError(errorMessage);
      Alert.alert('Error', errorMessage);
      return null;
    }
  };

  const geocodeAndCreateAddress = async (
    addressText: string,
    label: string,
    landmark?: string
  ): Promise<AddressData | null> => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const geocodingResult = await LocationService.geocodeAddress(addressText);
      
      if (!geocodingResult) {
        throw new Error('Could not find this address. Please check and try again.');
      }

      // Check if within delivery zone
      if (!LocationService.isWithinYaoundeDeliveryZone(geocodingResult.coordinates)) {
        Alert.alert(
          'Outside Delivery Zone',
          'This address appears to be outside our Yaoundé delivery area.',
          [{ text: 'OK' }]
        );
      }

      const newAddress: Omit<AddressData, 'id' | 'createdAt' | 'updatedAt'> = {
        label,
        streetAddress: geocodingResult.addressComponents.streetAddress || addressText,
        neighborhood: geocodingResult.addressComponents.neighborhood || '',
        city: geocodingResult.addressComponents.city || 'Yaoundé',
        region: geocodingResult.addressComponents.region || 'Centre',
        country: geocodingResult.addressComponents.country || 'Cameroon',
        landmark,
        coordinates: geocodingResult.coordinates,
        isDefault: addresses.length === 0,
      };

      addAddress(newAddress);
      
      // Find and return the newly created address
      const createdAddress = useAddressStore.getState().addresses.find(
        addr => addr.label === label && addr.coordinates?.latitude === geocodingResult.coordinates.latitude
      );
      
      return createdAddress || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create address';
      setLocationError(errorMessage);
      Alert.alert('Error', errorMessage);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const getDistanceToAddress = (address: AddressData): number | null => {
    if (!currentLocation || !address.coordinates) return null;
    return LocationService.calculateDistance(currentLocation, address.coordinates);
  };

  const selectNearestAddress = async () => {
    if (addresses.length === 0) return;

    const location = currentLocation || await getCurrentLocation();
    if (!location) return;

    let nearestAddress = addresses[0];
    let minDistance = address.coordinates 
      ? LocationService.calculateDistance(location, address.coordinates)
      : Infinity;

    for (const address of addresses) {
      if (address.coordinates) {
        const distance = LocationService.calculateDistance(location, address.coordinates);
        if (distance < minDistance) {
          minDistance = distance;
          nearestAddress = address;
        }
      }
    }

    setSelectedAddress(nearestAddress);
  };

  return {
    // State
    currentLocation,
    isLoadingLocation,
    locationError,
    hasLocationPermission,
    addresses,
    selectedAddress,
    
    // Actions
    requestLocationPermission,
    getCurrentLocation,
    createAddressFromCurrentLocation,
    geocodeAndCreateAddress,
    getDistanceToAddress,
    selectNearestAddress,
    
    // Utils
    isWithinDeliveryZone: (coords: Coordinates) => 
      LocationService.isWithinYaoundeDeliveryZone(coords),
    calculateDistance: LocationService.calculateDistance,
  };
};
```

## 5. Usage Examples

### Quick Setup Component
```typescript
// components/LocationSetup.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocation } from '../hooks/useLocation';

export const LocationSetup: React.FC = () => {
  const {
    currentLocation,
    isLoadingLocation,
    hasLocationPermission,
    getCurrentLocation,
    createAddressFromCurrentLocation,
  } = useLocation();

  const handleQuickSetup = async () => {
    if (!hasLocationPermission) {
      Alert.alert(
        'Permission Required',
        'We need location permission to provide delivery services.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: () => requestLocationPermission() },
        ]
      );
      return;
    }

    const location = await getCurrentLocation();
    if (location) {
      const address = await createAddressFromCurrentLocation('Home');
      if (address) {
        Alert.alert('Success', 'Your location has been saved as your home address!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Delivery Location</Text>
      <Text style={styles.description}>
        We'll use your current location to find nearby restaurants and calculate delivery times.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleQuickSetup}
        disabled={isLoadingLocation}
      >
        <Text style={styles.buttonText}>
          {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### Address Display Component
```typescript
// components/AddressDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAddressStore } from '../store/addressStore';
import { useLocation } from '../hooks/useLocation';

export const AddressDisplay: React.FC = () => {
  const { selectedAddress } = useAddressStore();
  const { getDistanceToAddress } = useLocation();

  if (!selectedAddress) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAddress}>No delivery address selected</Text>
      </View>
    );
  }

  const distance = getDistanceToAddress(selectedAddress);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{selectedAddress.label}</Text>
      <Text style={styles.address}>
        {selectedAddress.streetAddress}
        {selectedAddress.neighborhood && `, ${selectedAddress.neighborhood}`}
      </Text>
      {selectedAddress.landmark && (
        <Text style={styles.landmark}>Near: {selectedAddress.landmark}</Text>
      )}
      {distance && (
        <Text style={styles.distance}>{distance.toFixed(1)} km away</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  landmark: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  distance: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  noAddress: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
```

## 6. Integration in App.tsx

```typescript
// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAddressStore } from './store/addressStore';

export default function App() {
  const { loadAddresses } = useAddressStore();

  useEffect(() => {
    // Load persisted addresses when app starts
    loadAddresses();
  }, []);

  return (
    <NavigationContainer>
      {/* Your navigation setup */}
    </NavigationContainer>
  );
}
```

This implementation provides:

✅ **Robust location handling** with proper error management
✅ **Cameroon-specific address structure** with neighborhoods/quarters
✅ **Zustand store** with persistence via AsyncStorage  
✅ **Geocoding** for both forward and reverse address lookups
✅ **Delivery zone validation** for Yaoundé
✅ **Distance calculations** between locations
✅ **Permission handling** with user-friendly prompts
✅ **Offline-first** approach with local storage
✅ **TypeScript** for better development experience

The system is designed to be simple to implement while being production-ready for a Cameroon food delivery MVP.