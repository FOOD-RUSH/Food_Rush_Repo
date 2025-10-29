import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RestaurantFavorite {
  id: string;
  name?: string;
  pictureUrl?: string | null;
  address?: string;
}

interface RestaurantFavoritesState {
  favorites: Record<string, RestaurantFavorite>;
}

interface RestaurantFavoritesActions {
  toggleFavorite: (restaurant: { id: string; name?: string; pictureUrl?: string | null; address?: string }) => void;
  like: (restaurant: { id: string; name?: string; pictureUrl?: string | null; address?: string }) => void;
  unlike: (restaurantId: string) => void;
  isLiked: (restaurantId: string) => boolean;
  getAll: () => RestaurantFavorite[];
}

const initialState: RestaurantFavoritesState = {
  favorites: {},
};

export const useRestaurantFavoritesStore = create<RestaurantFavoritesState & RestaurantFavoritesActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        toggleFavorite: (restaurant) => {
          const { favorites } = get();
          const exists = !!favorites[restaurant.id];
          const newFavorites = { ...favorites };
          if (exists) {
            delete newFavorites[restaurant.id];
          } else {
            newFavorites[restaurant.id] = {
              id: restaurant.id,
              name: restaurant.name,
              pictureUrl: restaurant.pictureUrl,
              address: restaurant.address,
            };
          }
          set({ favorites: newFavorites });
        },
        like: (restaurant) => {
          const { favorites } = get();
          if (favorites[restaurant.id]) return; // already liked
          set({
            favorites: {
              ...favorites,
              [restaurant.id]: {
                id: restaurant.id,
                name: restaurant.name,
                pictureUrl: restaurant.pictureUrl,
                address: restaurant.address,
              },
            },
          });
        },
        unlike: (restaurantId) => {
          const { favorites } = get();
          if (!favorites[restaurantId]) return;
          const newFavorites = { ...favorites };
          delete newFavorites[restaurantId];
          set({ favorites: newFavorites });
        },
        isLiked: (restaurantId) => !!get().favorites[restaurantId],
        getAll: () => Object.values(get().favorites),
      }),
      {
        name: 'restaurant-favorites',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ favorites: state.favorites }),
        version: 1,
      },
    ),
    { name: 'RestaurantFavoritesStore' },
  ),
);

// Selectors
export const useIsRestaurantLiked = (id: string) =>
  useRestaurantFavoritesStore((s) => !!s.favorites[id]);
export const useRestaurantFavorites = () =>
  useRestaurantFavoritesStore((s) => Object.values(s.favorites));
