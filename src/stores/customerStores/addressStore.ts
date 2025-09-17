import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AddressData {
  id: string;
  label: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AddressState {
  addresses: AddressData[];
  isLoading: boolean;
  error: string | null;
}

interface AddressActions {
  // Actions
  addAddress: (address: Omit<AddressData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAddress: (id: string, address: Partial<AddressData>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  error: null,
};

export const useAddressStore = create<AddressState & AddressActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      addAddress: (address) => {
        const newAddress: AddressData = {
          id: Math.random().toString(36).substr(2, 9),
          ...address,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          addresses: [...state.addresses, newAddress],
        }));
      },

      updateAddress: (id, address) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id
              ? { ...addr, ...address, updatedAt: Date.now() }
              : addr
          ),
        }));
      },

      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // No migrations needed yet, but this prevents the warning
        return persistedState;
      },
      partialize: (state) => ({
        addresses: state.addresses,
      }),
    }
  )
);

// Selector hooks for better performance
export const useAddresses = () => useAddressStore((state) => state.addresses);
export const useDefaultAddress = () => 
  useAddressStore((state) => state.addresses.find(addr => addr.isDefault));
export const useAddressLoading = () => useAddressStore((state) => state.isLoading);
export const useAddressError = () => useAddressStore((state) => state.error);
