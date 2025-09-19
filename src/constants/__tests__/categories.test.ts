import { mapApiCategoriesToUI, getCategoryIcon } from '../categories';
import { CategoryOption } from '@/src/services/shared/categoriesApi';
import { FoodCategory } from '@/assets/images';

describe('Categories Utils', () => {
  describe('mapApiCategoriesToUI', () => {
    it('should map API categories to UI format with correct icons', () => {
      const apiCategories: CategoryOption[] = [
        { value: 'local-dishes', label: 'Local Dishes' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'fastfood', label: 'Fast Food' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'desserts', label: 'Desserts' },
        { value: 'snacks', label: 'Snacks' },
        { value: 'drinks', label: 'Drinks' },
      ];

      const result = mapApiCategoriesToUI(apiCategories);

      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({
        id: 1,
        value: 'local-dishes',
        title: 'local-dishes',
        displayName: 'Local Dishes',
        image: FoodCategory.bread,
        description: 'Local Dishes items',
      });
      expect(result[1]).toEqual({
        id: 2,
        value: 'breakfast',
        title: 'breakfast',
        displayName: 'Breakfast',
        image: FoodCategory.pancakes,
        description: 'Breakfast items',
      });
    });

    it('should handle empty array', () => {
      const result = mapApiCategoriesToUI([]);
      expect(result).toEqual([]);
    });

    it('should use fallback icon for unknown categories', () => {
      const apiCategories: CategoryOption[] = [
        { value: 'unknown-category', label: 'Unknown Category' },
      ];

      const result = mapApiCategoriesToUI(apiCategories);

      expect(result[0].image).toBe(FoodCategory.others);
    });
  });

  describe('getCategoryIcon', () => {
    it('should return correct icon for known categories', () => {
      expect(getCategoryIcon('local-dishes')).toBe(FoodCategory.bread);
      expect(getCategoryIcon('breakfast')).toBe(FoodCategory.pancakes);
      expect(getCategoryIcon('fastfood')).toBe(FoodCategory.burger);
      expect(getCategoryIcon('fast-food')).toBe(FoodCategory.burger);
      expect(getCategoryIcon('vegetarian')).toBe(FoodCategory.vegetable);
      expect(getCategoryIcon('desserts')).toBe(FoodCategory.desert);
      expect(getCategoryIcon('snacks')).toBe(FoodCategory.french_fries);
      expect(getCategoryIcon('drinks')).toBe(FoodCategory.drink);
    });

    it('should return fallback icon for unknown categories', () => {
      expect(getCategoryIcon('unknown')).toBe(FoodCategory.others);
      expect(getCategoryIcon('')).toBe(FoodCategory.others);
    });
  });
});
