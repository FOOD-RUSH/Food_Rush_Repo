import { apiClient } from '../apiClient';
import { AddressData } from '@/src/components/customer/AddressEditModal';

// Enhanced address data structure with geolocation
export interface Address extends AddressData {
  id: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Geocoding response structure
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

// Reverse geocoding request
export interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

// Address creation request
export interface CreateAddressRequest {
  label: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  city?: string;
  country?: string;
  postalCode?: string;
}

// Address update request
export interface UpdateAddressRequest {
  label?: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  city?: string;
  country?: string;
  postalCode?: string;
}

export const addressApi = {
  // Get all addresses for a user
  getAllAddresses: () => {
    return apiClient.get<Address[]>('/addresses');
  },

  // Get a specific address by ID
  getAddressById: (id: string) => {
    return apiClient.get<Address>(`/addresses/${id}`);
  },

  // Create a new address
  createAddress: (addressData: CreateAddressRequest) => {
    return apiClient.post<Address>('/addresses', addressData);
  },

  // Update an existing address
  updateAddress: (id: string, addressData: UpdateAddressRequest) => {
    return apiClient.put<Address>(`/addresses/${id}`, addressData);
  },

  // Delete an address
  deleteAddress: (id: string) => {
    return apiClient.delete<void>(`/addresses/${id}`);
  },

  // Set an address as default
  setDefaultAddress: (id: string) => {
    return apiClient.patch<Address>(`/addresses/${id}/set-default`, {});
  },

  // Geocode an address (convert text to coordinates)
  geocodeAddress: (address: string) => {
    return apiClient.get<GeocodeResult>(`/geocode?address=${encodeURIComponent(address)}`);
  },

  // Reverse geocode (convert coordinates to address)
  reverseGeocode: (data: ReverseGeocodeRequest) => {
    return apiClient.get<GeocodeResult>(
      `/reverse-geocode?lat=${data.latitude}&lng=${data.longitude}`
    );
  },

  // Get nearby addresses
  getNearbyAddresses: (latitude: number, longitude: number, radius: number = 5) => {
    return apiClient.get<Address[]>(
      `/addresses/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
  },
};