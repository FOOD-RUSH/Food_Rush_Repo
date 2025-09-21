import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationState, Location, SavedAddress } from './types';
import { generateTimestampId } from '@/src/utils/idGenerator';

interface LocationActions {
  // Core actions
  setLocation: (location: Location) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPermission: (hasPermission: boolean) => void;
  setServicesEnabled: (enabled: boolean) => void;
  setPermissionRequested: (requested: boolean) => void;

  // Address actions
  setSavedAddresses: (addresses: SavedAddress[]) => void;
  addSavedAddress: (
    address: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  updateSavedAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Helper actions
  clearError: () => void;
  reset: () => void;
}

export interface LocationStore extends LocationState, LocationActions {}

const initialState: LocationState = {
  location: null,
  savedAddresses: [
    {
      id: 'default-address',
      label: 'Home',
      fullAddress: 'Djoungolo II, Yaoundé, Cameroun',
      latitude: 3.8667,
      longitude: 11.5167,
      isDefault: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  defaultAddressId: 'default-address',
  isLoading: false,
  error: null,
  hasPermission: false,
  permissionRequested: false,
  servicesEnabled: true,
  lastPermissionRequest: 0,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Core actions
      setLocation: (location) => {
        set({
          location,
          error: null,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({
          error,
          isLoading: false,
        });
      },

      setPermission: (hasPermission) => {
        set({
          hasPermission,
          permissionRequested: true,
          lastPermissionRequest: hasPermission
            ? Date.now()
            : get().lastPermissionRequest,
        });
      },

      setServicesEnabled: (servicesEnabled) => {
        set({ servicesEnabled });
      },

      setPermissionRequested: (permissionRequested) => {
        set({ permissionRequested });
      },

      // Address actions
      setSavedAddresses: (savedAddresses) => {
        set({ savedAddresses });
      },

      addSavedAddress: (addressData) => {
        const newAddress: SavedAddress = {
          id: generateTimestampId(),
          ...addressData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => {
          const shouldBeDefault =
            addressData.isDefault || state.savedAddresses.length === 0;

          return {
            savedAddresses: [...state.savedAddresses, newAddress],
            defaultAddressId: shouldBeDefault
              ? newAddress.id
              : state.defaultAddressId,
          };
        });
      },

      updateSavedAddress: (id, addressUpdates) => {
        set((state) => ({
          savedAddresses: state.savedAddresses.map((addr) =>
            addr.id === id
              ? { ...addr, ...addressUpdates, updatedAt: Date.now() }
              : addr,
          ),
        }));
      },

      deleteSavedAddress: (id) => {
        set((state) => {
          const newAddresses = state.savedAddresses.filter(
            (addr) => addr.id !== id,
          );

          const newDefaultId =
            state.defaultAddressId === id
              ? newAddresses.length > 0
                ? newAddresses[0].id
                : null
              : state.defaultAddressId;

          return {
            savedAddresses: newAddresses,
            defaultAddressId: newDefaultId,
          };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          savedAddresses: state.savedAddresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
          defaultAddressId: id,
        }));
      },

      // Helper actions
      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        location: state.location,
        hasPermission: state.hasPermission,
        savedAddresses: state.savedAddresses,
        defaultAddressId: state.defaultAddressId,
        permissionRequested: state.permissionRequested,
        lastPermissionRequest: state.lastPermissionRequest,
      }),
    },
  ),
);

// Selectors
export const useLocationData = () =>
  useLocationStore((state) => state.location);

export const useLocationLoading = () =>
  useLocationStore((state) => state.isLoading);

export const useLocationError = () => useLocationStore((state) => state.error);

export const useLocationPermission = () =>
  useLocationStore((state) => state.hasPermission);

export const useSavedAddresses = () =>
  useLocationStore((state) => state.savedAddresses);

export const useDefaultAddressId = () =>
  useLocationStore((state) => state.defaultAddressId);

export const useDefaultAddress = () =>
  useLocationStore((state) => {
    const addresses = state.savedAddresses;
    const defaultId = state.defaultAddressId;
    return (
      addresses.find((addr) => addr.id === defaultId) || addresses[0] || null
    );
  });

export const useLocationActions = () => {
  const {
    setLocation,
    setLoading,
    setError,
    setPermission,
    setServicesEnabled,
    setPermissionRequested,
    clearError,
    reset,
    setSavedAddresses,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
  } = useLocationStore();

  return {
    setLocation,
    setLoading,
    setError,
    setPermission,
    setServicesEnabled,
    setPermissionRequested,
    clearError,
    reset,
    setSavedAddresses,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
  };
};
