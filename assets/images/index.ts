// New food category images with transparent backgrounds
import breakfast from '@/assets/images/breakfast.png';
import dessert from '@/assets/images/dessert.png';
import vegetarian from '@/assets/images/vegetarian.png';
import fastfood from '@/assets/images/fastfood.png';
import drinks from '@/assets/images/dirnks.png';
import localdish from '@/assets/images/localdish.png';
import R_logo from '@/assets/images/R-Logo.png';
import deliveryGif from '@/assets/images/Delivery_static.png';
import onboarding1 from '@/assets/images/background.png';
import onboarding2 from '@/assets/images/background2.png';
import onboarding3 from '@/assets/images/background3.png';
import appleIcon from '@/assets/images/apple.png';
import customerImg from '@/assets/images/Food Illustrations/Illustrations 04.png';
import restaurantImg from '@/assets/images/Food Illustrations/Illustrations 02.png';
import noMenu from '@/assets/images/Food Illustrations/No_menu.png';
import ApplogoWhite from '@/assets/images/Foodrushlogo.png';
import ApplogoDark from '@/assets/images/foodrush.svg';
import NoOrdersLight from '@/assets/images/NoOrdersLight.png';
import NoOrdersDark from '@/assets/images/NoOrdersDark.png';
import ProfilePlogo from '@/assets/images/Food Illustrations/Type=Edit Avatar, Component=Avatar lIGHT.svg';
import Orange_Money from '@/assets/images/Orange_money.png';
import Mobile_Money from '@/assets/images/MTN_mobileMoney.png';
import Loading_reset from '@/assets/images/Food Illustrations/LoadingFood.png';
// Success state images for password reset
import success_1 from '@/assets/images/Food Illustrations/Different Success states 01.png';
import success_2 from '@/assets/images/Food Illustrations/Different Success states 02.png';
import success_3 from '@/assets/images/Food Illustrations/Different Success states 03.png';
// Icons
import not_found from '@/assets/images/Food Illustrations/Not found darck.svg';

export const images = {
  deliveryGif,
  onboarding1,
  onboarding2,
  onboarding3,
  ApplogoDark,
  ApplogoWhite,
  NoOrdersDark,
  NoOrdersLight,
  customerImg,
  restaurantImg,
  not_found,
  Orange_Money,
  Mobile_Money,
  Loading_reset,
  success_1,
  success_2,
  success_3,
  noMenu,
};

export const icons = {
  appleIcon,
  R_logo,
  ProfilePlogo,
};

export const FoodCategory = {
  breakfast,
  dessert,
  vegetarian,
  fastfood,
  drinks,
  localdish,
};

export interface FoodCategoryProps {
  image: any;
  title: string;
  description: string;
  id: number;
}

export const CategoryFilters = [
  {
    id: 1,
    image: FoodCategory.localdish,
    title: 'Local Dishes',
    description: 'Traditional local cuisine',
  },
  {
    id: 2,
    image: FoodCategory.breakfast,
    title: 'Breakfast',
    description: 'Morning meals and breakfast items',
  },
  {
    id: 3,
    image: FoodCategory.fastfood,
    title: 'Fast Food',
    description: 'Quick service meals',
  },
  {
    id: 4,
    image: FoodCategory.vegetarian,
    title: 'Vegetarian',
    description: 'Plant-based dishes',
  },
  {
    id: 5,
    image: FoodCategory.dessert,
    title: 'Desserts',
    description: 'Sweet treats and desserts',
  },
  {
    id: 6,
    image: FoodCategory.drinks,
    title: 'Drinks',
    description: 'Beverages and refreshments',
  },
];
