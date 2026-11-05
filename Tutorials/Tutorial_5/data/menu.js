const menuItems = [
  // Appetizers
  {
    id: "AR1",
    name: 'Calamari',
    category: 'Appetizers',
    price: 14,
    description: 'Crispy golden fried squid rings served with zesty marinara sauce.',
    image: 'images/calamari.jpg'
  },
  {
    id: "AR2",
    name: 'Truffle Fries',
    category: 'Appetizers',
    price: 11,
    description: 'Hand-cut fries tossed in truffle oil with parmesan and fresh herbs.',
    image: 'images/fries.jpg'
  },
  {
    id: "AR3",
    name: 'Burrata Salad',
    category: 'Appetizers',
    price: 15,
    description: 'Creamy burrata cheese with cherry tomatoes, greens, and balsamic glaze.',
    image: 'images/burrata.jpg'
  },
  {
    id: "AR4",
    name: 'Spicy Tuna Tartare',
    category: 'Appetizers',
    price: 17,
    description: 'Fresh diced tuna with avocado, sesame, and a hint of spice.',
    image: 'images/tuna.jpg'
  },
  {
    id: "AR5",
    name: 'Garlic Hummus',
    category: 'Appetizers',
    price: 10,
    description: 'Silky chickpea hummus blended with roasted garlic and served with warm pita.',
    image: 'images/hummus.jpg'
  },
  {
    id: "AR6",
    name: 'Amuse-Bouche / Palate Cleanser',
    category: 'Appetizers',
    price: 6,
    description: 'A small citrus sorbet served between courses to refresh the palate.',
    image: 'images/amusebouche.jpg'
  },

  // Mains
  {
    id: "MN1",
    name: 'Grilled Salmon',
    category: 'Mains',
    price: 26,
    description: 'Perfectly grilled salmon fillet served with asparagus with lemon butter sauce.',
    image: 'images/salmon.jpg'
  },
  {
    id: "MN2",
    name: 'Roasted Chicken',
    category: 'Mains',
    price: 32,
    description: 'Juicy garlic & herbs whole roasted chicken, with steamed potatoes, carrots and brussel sprouts.',
    image: 'images/chicken.jpg'
  },
  {
    id: "MN3",
    name: 'Braised Short Rib',
    category: 'Mains',
    price: 28,
    description: 'Slow-braised beef ribs in a rich red wine sauce, served with mashed potatoes.',
    image: 'images/ribs.jpg'
  },
  {
    id: "MN4",
    name: 'Mushroom Risotto',
    category: 'Mains',
    price: 21,
    description: 'Creamy arborio rice with sautéed mushrooms and parmesan cheese.',
    image: 'images/risotto.jpg'
  },
  {
    id: "MN5",
    name: '100% Angus Beef Cheeseburger',
    category: 'Mains',
    price: 19,
    description: 'Classic Angus beef burger with cheddar, lettuce, tomato, and fries on the side.',
    image: 'images/cheeseburger.jpg'
  },
{
    id: "MN6",
    name: 'Fish & Chips',
    category: 'Mains',
    price: 20,
    description: 'Flaky, golden-battered haddock with crisp hand-cut chips and a lemon-tartar sauce.',
    image: 'images/fishchips.jpg'
  },

  // Desserts
  {
    id: "DT1",
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 9,
    description: 'Warm chocolate cake with a gooey molten center.',
    image: 'images/lavacake.jpg'
  },
  {
    id: "DT2",
    name: 'Cheesecake',
    category: 'Desserts',
    price: 8,
    description: 'Creamy classic cheesecake with a buttery graham cracker crust.',
    image: 'images/cheesecake.jpg'
  },
  {
    id: "DT3",
    name: 'Crème Brûlée',
    category: 'Desserts',
    price: 10,
    description: 'Silky custard with a caramelized sugar top.',
    image: 'images/brulee.jpg'
  },
  {
    id: "DT4",
    name: 'Tiramisu',
    category: 'Desserts',
    price: 9,
    description: 'Layers of espresso-soaked ladyfingers and mascarpone cream.',
    image: 'images/tiramisu.jpg'
  },
  {
    id: "DT5",
    name: 'Salted Caramel Ice Cream',
    category: 'Desserts',
    price: 7,
    description: 'Rich ice cream with swirls of salted caramel.',
    image: 'images/icecream.jpg'
  },

  // Drinks
  {
    id: "DK1",
    name: 'Lemonade',
    category: 'Drinks',
    price: 4,
    description: 'Refreshing homemade lemonade with a hint of mint.',
    image: 'images/lemonade.jpg'
  },
  {
    id: "DK2",
    name: 'Iced Tea',
    category: 'Drinks',
    price: 4,
    description: 'Cold brewed tea served with lemon and sugar.',
    image: 'images/icetea.jpg'
  },
  {
    id: "DK3",
    name: 'Sparkling Water',
    category: 'Drinks',
    price: 5,
    description: 'Chilled sparkling water with a slice of lime.',
    image: 'images/water.jpg'
  },
  {
    id: "DK4",
    name: 'Soft Drink',
    category: 'Drinks',
    price: 3,
    description: 'Classic soda in a variety of flavors.',
    image: 'images/softdrink.jpg'
  },
  {
    id: "DK5",
    name: 'Coffee / Espresso',
    category: 'Drinks',
    price: 3,
    description: 'Freshly brewed coffee or a rich espresso shot.',
    image: 'images/coffee.jpg'
  }
];

const categories = [ 'Appetizers', 'Mains', 'Desserts', 'Drinks' ];

//module.exports = { categories, menuItems };

