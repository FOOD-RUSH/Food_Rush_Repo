import { FoodCategory } from '@/assets/images';

export interface FoodCategoryProps {
  image: any;
  title: string;
  id: number;
}

export const CategoryFilters = [
  {
    id: 1,
    image: FoodCategory.burger,
    title: 'burger',
  },
  {
    id: 2,
    image: FoodCategory.vegetable,
    title: 'vegetable',
  },
  {
    id: 3,
    image: FoodCategory.pizza,
    title: 'pizza',
  },

  {
    id: 4,
    image: FoodCategory.desert,
    title: 'desert',
  },
  {
    id: 5,
    image: FoodCategory.meat,
    title: 'meat',
  },
  {
    id: 6,
    image: FoodCategory.drink,
    title: 'drinks',
  },
  {
    id: 7,
    image: FoodCategory.noodles,
    title: 'noodles',
  },
  {
    id: 8,
    image: FoodCategory.bread,
    title: 'local_dish',
  },
  {
    id: 9,
    image: FoodCategory.pancakes,
    title: 'breakfast',
  },
  {
    id: 10,
    image: FoodCategory.french_fries,
    title: 'fastfood',
  },
  {
    id: 11,
    image: FoodCategory.others,
    title: 'more',
  },
];
