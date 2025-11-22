import { MenuItem } from './types';

export const CATEGORIES = [
  "All",
  "Breakfast",
  "Dosa",
  "Kottu",
  "Main Course",
  "Biryani",
  "Curry",
  "Appetizer",
  "Rice Dish"
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Idli (4 pcs)',
    price: 399,
    category: 'Breakfast',
    description: 'Steamed rice cakes served with sambar and chutney',
    image: 'https://picsum.photos/200/200?random=1',
    isVegetarian: true
  },
  {
    id: '2',
    name: 'Ghee Dosa',
    price: 599,
    category: 'Dosa',
    description: '3 pcs crispy crepe with ghee, sambar & chutney',
    image: 'https://picsum.photos/200/200?random=2',
    isVegetarian: true
  },
  {
    id: '3',
    name: 'Onion Ghee Podi Dosa',
    price: 450,
    category: 'Dosa',
    description: '2 pcs spiced onion dosa',
    image: 'https://picsum.photos/200/200?random=3',
    isVegetarian: true
  },
  {
    id: '4',
    name: 'Egg Ghee Dosa',
    price: 450,
    category: 'Dosa',
    description: '2 pcs dosa topped with egg and ghee',
    image: 'https://picsum.photos/200/200?random=4',
    isVegetarian: false
  },
  {
    id: '5',
    name: 'Spicy Idli Kottu',
    price: 599,
    category: 'Kottu',
    description: '5 pcs chopped idli stir-fried with spices',
    image: 'https://picsum.photos/200/200?random=5',
    isVegetarian: true
  },
  {
    id: '6',
    name: 'String Hoppers',
    price: 350,
    category: 'Breakfast',
    description: '2 pcs steamed rice noodles with pol sambol & sambar',
    image: 'https://picsum.photos/200/200?random=6',
    isVegetarian: true
  },
  {
    id: '7',
    name: 'Rice & Curry (Veg)',
    price: 500,
    category: 'Main Course',
    description: 'Traditional Sri Lankan vegetarian rice and curry',
    image: 'https://picsum.photos/200/200?random=7',
    isVegetarian: true
  },
  {
    id: '8',
    name: 'Rice & Curry (Chicken)',
    price: 850,
    category: 'Main Course',
    description: 'Spicy chicken curry with rice and sides',
    image: 'https://picsum.photos/200/200?random=8',
    isVegetarian: false
  },
  {
    id: '9',
    name: 'Medu Vada (2 pcs)',
    price: 250,
    category: 'Appetizer',
    description: 'Crispy lentil donuts',
    image: 'https://picsum.photos/200/200?random=9',
    isVegetarian: true,
    isVegan: true
  },
  {
    id: '10',
    name: 'Pongal',
    price: 300,
    category: 'Rice Dish',
    description: 'Small bowl of savory rice and lentil dish',
    image: 'https://picsum.photos/200/200?random=10',
    isVegetarian: true
  },
  {
    id: '11',
    name: 'Chicken Biryani',
    price: 1000,
    category: 'Biryani',
    description: 'Aromatic basmati rice cooked with chicken and spices',
    image: 'https://picsum.photos/200/200?random=11',
    isVegetarian: false
  },
  {
    id: '12',
    name: 'Mutton Biryani',
    price: 1200,
    category: 'Biryani',
    description: 'Rich and flavorful mutton biryani plate',
    image: 'https://picsum.photos/200/200?random=12',
    isVegetarian: false
  },
  {
    id: '13',
    name: 'Fish Curry',
    price: 900,
    category: 'Curry',
    description: 'Spicy fish curry plate',
    image: 'https://picsum.photos/200/200?random=13',
    isVegetarian: false
  }
];