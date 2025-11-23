import { MenuItem } from './types';

export const SHOP_NAME = "Saapttu kada";
export const SHOP_PHONE = "+94 77 123 4567";
export const SHOP_ADDRESS = "123, Main Street, Jaffna";
export const SHOP_LOGO = "https://cdn-icons-png.flaticon.com/512/3448/3448609.png";

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
    image: 'https://flyingidlis.com/houston/wp-content/uploads/2019/04/breakfast-2408818_1920.jpg',
    isVegetarian: true,
    available: true
  },
  {
    id: '2',
    name: 'Ghee Dosa',
    price: 599,
    category: 'Dosa',
    description: 'Crispy crepe with ghee, sambar & chutney',
    image: 'https://annapoornauae.com/storage/2024/07/Garlic-Podi-Dosa.jpg',
    isVegetarian: true,
    available: true
  },
  {
    id: '3',
    name: 'Onion Ghee Podi Dosa',
    price: 450,
    category: 'Dosa',
    description: 'Spiced onion dosa with aromatic podi',
    image: 'https://nestle-fitterfly-assets.s3.ap-south-1.amazonaws.com/1ln196gq433laqey2ziu9m8wp5jz?response-content-disposition=inline%3B%20filename%3D%2219534_Podi_Masala_Crispy_Dosa.webp%22%3B%20filename%2A%3DUTF-8%27%2719534_Podi_Masala_Crispy_Dosa.webp&response-content-type=image%2Fwebp&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ7MERELBQLB5OXMS%2F20251123%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20251123T084637Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=f75f4d78f50c334a0a6b3757e78302f3009e818071c701a8a1b010010885987d',
    isVegetarian: true,
    available: true
  },
  {
    id: '4',
    name: 'Egg Dosa',
    price: 450,
    category: 'Dosa',
    description: 'Dosa topped with beaten egg and spices',
    image: 'https://www.yellowthyme.com/wp-content/uploads/2024/07/Egg-Dosa.jpg',
    isVegetarian: false,
    available: true
  },
  {
    id: '5',
    name: 'Chicken Kottu',
    price: 899,
    category: 'Kottu',
    description: 'Chopped roti stir-fried with chicken and vegetables',
    image: 'https://www.licious.in/blog/wp-content/uploads/2020/06/KUTTU-PORATTA.jpg',
    isVegetarian: false,
    available: true
  },
  {
    id: '6',
    name: 'String Hoppers',
    price: 350,
    category: 'Breakfast',
    description: 'Steamed rice noodles with pol sambol & kiri hodhi',
    image: 'https://14179767.cdn6.editmysite.com/uploads/1/4/1/7/14179767/KF23X4SBYITGE76ASG4LOKKV.jpeg',
    isVegetarian: true,
    available: true
  },
  {
    id: '7',
    name: 'Rice & Curry (Veg)',
    price: 500,
    category: 'Main Course',
    description: 'Traditional Sri Lankan vegetarian rice and curry',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    available: true
  },
  {
    id: '8',
    name: 'Rice & Curry (Chicken)',
    price: 850,
    category: 'Main Course',
    description: 'Spicy chicken curry with rice and sides',
    image: 'https://vismaifood.com/storage/app/uploads/public/105/fc7/89f/thumb__700_0_0_0_auto.jpg',
    isVegetarian: false,
    available: true
  },
  {
    id: '9',
    name: 'Medu Vada (2 pcs)',
    price: 250,
    category: 'Appetizer',
    description: 'Crispy lentil donuts',
    image: 'http://jaybhavani.com.au/brisbane/wp-content/uploads/2025/05/Meduvada-with-Sambhar-scaled.jpg',
    isVegetarian: true,
    isVegan: true,
    available: true
  },
  {
    id: '10',
    name: 'Pongal',
    price: 300,
    category: 'Rice Dish',
    description: 'Savory rice and lentil dish seasoned with cumin',
    image: 'https://www.indianveggiedelight.com/wp-content/uploads/2021/11/ven-pongal-featured.jpg',
    isVegetarian: true,
    available: true
  },
  {
    id: '11',
    name: 'Chicken Biryani',
    price: 1000,
    category: 'Biryani',
    description: 'Aromatic basmati rice cooked with chicken and spices',
    image: 'https://www.thespruceeats.com/thmb/XDBL9gA6A6nYWUdsRZ3QwH084rk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SES-chicken-biryani-recipe-7367850-hero-A-ed211926bb0e4ca1be510695c15ce111.jpg',
    isVegetarian: false,
    available: true
  },
  {
    id: '12',
    name: 'Mutton Biryani',
    price: 1200,
    category: 'Biryani',
    description: 'Rich and flavorful mutton biryani plate',
    image: 'https://www.andy-cooks.com/cdn/shop/articles/20231014063236-andy-20cooks-20-20mutton-20biryani-20lamb.jpg?v=1697355344',
    isVegetarian: false,
    available: true
  },
  {
    id: '13',
    name: 'Fish Curry',
    price: 900,
    category: 'Curry',
    description: 'Spicy fish curry plate (Thalapath)',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/061/060/638/small/spicy-fish-curry-bold-red-sauce-south-indian-seafood-dish-in-traditional-gourmet-high-res-photo.jpg',
    isVegetarian: false,
    available: true
  }
];