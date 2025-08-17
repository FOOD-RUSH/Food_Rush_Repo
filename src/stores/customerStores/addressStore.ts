import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addressApi , Address} from '@/src/services/customer/address.service';

interface AddressState {
  addresses: Address[];
  defaultAddress: Address | null;
  isLoading: boolean;
  error: string | null;
}

interface AddressActions {
  // Fetch all addresses
  fetchAddresses: () => Promise<void>;
  
  // Add a new address
  addAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  // Update an existing address
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  
  // Delete an address
  deleteAddress: (id: string) => Promise<void>;
  
  // Set default address
  setDefaultAddress: (id: string) => Promise<void>;
  
  // Get address by ID
  getAddressById: (id: string) => Address | undefined;
  
  // Clear error
  clearError: () => void;
  
  // Reset store
  reset: () => void;
}

const initialState: AddressState = {
  addresses: [],
  defaultAddress: null,
  isLoading: false,
  error: null,
};

export const useAddressStore = create<AddressState & AddressActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        fetchAddresses: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await addressApi.getAllAddresses();
            const addresses = response.data;
            
            // Find default address
            const defaultAddress = addresses.find(addr => addr.isDefault) || null;
            
            set({ 
              addresses, 
              defaultAddress,
              isLoading: false 
            });
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to fetch addresses',
              isLoading: false 
            });
          }
        },
        
        addAddress: async (addressData) => {
          try {
            set({ isLoading: true, error: null });
            const response = await addressApi.createAddress(addressData);
            const newAddress = response.data;
            
            set(state => ({
              addresses: [...state.addresses, newAddress],
              defaultAddress: addressData.isDefault ? newAddress : state.defaultAddress,
              isLoading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to add address',
              isLoading: false 
            });
            throw error;
          }
        },
        
        updateAddress: async (id, addressData) => {
          try {
            set({ isLoading: true, error: null });
            const response = await addressApi.updateAddress(id, addressData);
            const updatedAddress = response.data;
            
            set(state => ({
              addresses: state.addresses.map(addr => 
                addr.id === id ? { ...addr, ...updatedAddress } : addr
              ),
              defaultAddress: addressData.isDefault ? updatedAddress : 
                (state.defaultAddress?.id === id ? null : state.defaultAddress),
              isLoading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to update address',
              isLoading: false 
            });
            throw error;
          }
        },
        
        deleteAddress: async (id) => {
          try {
            set({ isLoading: true, error: null });
            await addressApi.deleteAddress(id);
            
            set(state => ({
              addresses: state.addresses.filter(addr => addr.id !== id),
              defaultAddress: state.defaultAddress?.id === id ? null : state.defaultAddress,
              isLoading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to delete address',
              isLoading: false 
            });
            throw error;
          }
        },
        
        setDefaultAddress: async (id) => {
          try {
            set({ isLoading: true, error: null });
            const response = await addressApi.setDefaultAddress(id);
            const updatedAddress = response.data;
            
            set(state => ({
              addresses: state.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === id
              })),
              defaultAddress: updatedAddress,
              isLoading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.message || 'Failed to set default address',
              isLoading: false 
            });
            throw error;
          }
        },
        
        getAddressById: (id) => {
          return get().addresses.find(addr => addr.id === id);
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'address-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          addresses: state.addresses,
          defaultAddress: state.defaultAddress,
        }),
        version: 1,
      }
    ),
    { name: 'AddressStore' }
  )
);

// Selector hooks for better performance
export const useAddresses = () => useAddressStore((state) => state.addresses);
export const useDefaultAddress = () => useAddressStore((state) => state.defaultAddress);
export const useAddressLoading = () => useAddressStore((state) => state.isLoading);
export const useAddressError = () => useAddressStore((state) => state.error);