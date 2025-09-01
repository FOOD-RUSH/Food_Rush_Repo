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
    title: 'category_burger',
  },
  {
    id: 2,
    image: FoodCategory.vegetable,
    title: 'category_vegetable',
  },
  {
    id: 3,
    image: FoodCategory.pizza,
    title: 'category_pizza',
  },

  {
    id: 4,
    image: FoodCategory.desert,
    title: 'category_desert',
  },
  {
    id: 5,
    image: FoodCategory.meat,
    title: 'category_meat',
  },
  {
    id: 6,
    image: FoodCategory.drink,
    title: 'category_drinks',
  },
  {
    id: 7,
    image: FoodCategory.noodles,
    title: 'category_noodles',
  },
  {
    id: 8,
    image: FoodCategory.others,
    title: 'category_more',
  },
];
