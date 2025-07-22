import burger from '@/assets/images/Food Emojies/🍔01.png';
import pizza from '@/assets/images/Food Emojies/🍔02.png';
import noodles from '@/assets/images/Food Emojies/🍔03.png';
import meat from '@/assets/images/Food Emojies/🍔04.png';
import vegetable from '@/assets/images/Food Emojies/🍔05.png';
import desert from '@/assets/images/Food Emojies/🍔06.png';
import drink from '@/assets/images/Food Emojies/🍔07.png';
import bread from '@/assets/images/Food Emojies/🍔08.png';
import croissant from '@/assets/images/Food Emojies/🍔09.png';
import pancakes from '@/assets/images/Food Emojies/🍔10.png';
import cheese from '@/assets/images/Food Emojies/🍔11.png';
import french_fries from '@/assets/images/Food Emojies/🍔12.png';
import sandwich from '@/assets/images/Food Emojies/🍔13.png';
import taco from '@/assets/images/Food Emojies/🍔14.png';
import ice_cream from '@/assets/images/Food Emojies/🍔21.png';
import salad from '@/assets/images/Food Emojies/🍔16.png';
import others from '@/assets/images/Food Emojies/🍔24.png';
import R_logo from '@/assets/images/R-Logo.png';
import deliveryGif from '@/assets/images/Delivery.gif';
import onboarding1 from '@/assets/images/background.png'
import onboarding2 from '@/assets/images/background2.png';
import onboarding3 from '@/assets/images/background3.png'
import appleIcon from '@/assets/images/apple.png';
import customerImg from '@/assets/images/Food Illustrations/Illustrations 04.png';
import restaurantImg from '@/assets/images/Food Illustrations/Illustrations 02.png';

import ApplogoWhite from '@/assets/images/Foodrushlogo.png';
import ApplogoDark from '@/assets/images/foodrush.svg';
import NoOrdersLight from '@/assets/images/Food Illustrations/Clipboard light-1.png';
import NoOrdersDark from '@/assets/images/Food Illustrations/Clipboard light.png';
import ProfilePlogo from '@/assets/images/Food Illustrations/Type=Edit Avatar, Component=Avatar lIGHT.png'
// Icons
import profile from '@/assets/images/Varant=Outline, Type=user.svg';
import profile_bold from '@/assets/images/Varant=Solid, Type=user.svg'
import notification from '@/assets/images/Varant=Outline, Type=bell.svg';
import email_solid from '@/assets/images/Varant=Solid, Type=mail.svg';
import email from '@/assets/images/Varant=Outline, Type=mail.svg'
import show from '@/assets/images/Varant=Outline, Type=eye.svg'
import show_bold from '@/assets/images/Varant=Solid, Type=eye.svg'
import hide from '@/assets/images/Varant=Solid, Type=eye-off.svg'
import hide_bold from '@/assets/images/Varant=Outline, Type=eye-off.svg'
import lock from '@/assets/images/Varant=Outline, Type=lock-closed.svg'
import lock_bold from '@/assets/images/Varant=Solid, Type=lock-closed.svg'
import more from '@/assets/images/Varant=Outline, Type=dots-circle-horizontal.svg'
import back from '@/assets/images/Varant=Outline, Type=arrow-left.svg'
import filter from '@/assets/images/Varant=Outline, Type=adjustments.svg'
import home from '@/assets/images/Varant=Outline, Type=home.svg'
import cancel from '@/assets/images/Varant=Outline, Type=x.svg'
import search from '@/assets/images/Varant=Outline, Type=search.svg'
import security from '@/assets/images/Varant=Outline, Type=shield-check.svg'
import star from '@/assets/images/Varant=Outline, Type=sparkles.svg'
import card from '@/assets/images/Varant=Outline, Type=credit-card.svg'
import gift from '@/assets/images/Varant=Outline, Type=gift.svg'
import calendar from '@/assets/images/Varant=Outline, Type=calendar.svg'
import order from '@/assets/images/Varant=Outline, Type=clipboard-list.svg'
import not_found from '@/assets/images/Food Illustrations/Not found darck.png'

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
    not_found



}

export const icons = {
    appleIcon,
    R_logo,
    ProfilePlogo,
    order,
    calendar,
    cancel,
    card, gift, profile, profile_bold, notification, show, show_bold, star, search, security, home, filter, more, lock, lock_bold,back, email, email_solid, hide_bold, hide
}

export const FoodCategory = {
    appleIcon,
    bread,
    pizza,
    croissant,
    vegetable,
    drink,
    desert,
    taco,
    sandwich,
    burger,
    ice_cream,
    noodles,
    meat,
    salad,
    french_fries,
    others,
    pancakes,
    cheese

}

export interface FoodCategoryProps {
    image: any;
    title: string;
    id: number;
}

export const CategoryFilters = [
    {
        id: 1,
        image: FoodCategory.burger,
        title: 'Burger'
    },
    {
        id: 2,
        image: FoodCategory.vegetable,
        title: 'Vegetable'

    },
    {
        id: 3,
        image: FoodCategory.pizza,
        title: 'Pizza'
    },

    {
        id: 4,
        image: FoodCategory.desert,
        title: 'desert'
    },
    {
        id: 5,
        image: FoodCategory.meat,
        title: 'Meat'
    },
    {
        id: 6,
        image: FoodCategory.drink,
        title: 'Drinks'

    },
    {
        id: 7,
        image: FoodCategory.noodles,
        title: 'Noodles'
    },
    {
        id: 8,
        image: FoodCategory.others,
        title: 'More'
    },








]

