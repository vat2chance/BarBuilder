export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  ingredients: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isSignature?: boolean;
  preparationTime: number; // in minutes
  calories?: number;
  alcoholContent?: number; // ABV percentage
  imageUrl?: string;
  customizations?: {
    name: string;
    options: string[];
    priceModifier?: number;
  }[];
  pairings?: string[];
  tags: string[];
  availability: 'always' | 'seasonal' | 'weekends' | 'special';
  cost: number; // cost to make
  profitMargin: number; // calculated profit margin
}

export const menuData: MenuItem[] = [
  // Signature Cocktails
  {
    id: 'cocktail-signature-mule',
    name: 'Barrel Aged Moscow Mule',
    category: 'Signature Cocktails',
    description: 'Our signature take on the classic Moscow Mule, aged in bourbon barrels for 6 weeks with premium vodka, house-made ginger beer, and fresh lime.',
    price: 16.00,
    ingredients: ['Barrel-aged vodka', 'House ginger beer', 'Fresh lime juice', 'Candied ginger'],
    preparationTime: 3,
    alcoholContent: 12,
    isSignature: true,
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Spice Level',
        options: ['Mild', 'Medium', 'Spicy'],
        priceModifier: 0
      },
      {
        name: 'Garnish',
        options: ['Lime wheel', 'Candied ginger', 'Mint sprig'],
        priceModifier: 0
      }
    ],
    pairings: ['Smoked wings', 'Charcuterie board'],
    tags: ['Aged', 'Spicy', 'Craft'],
    availability: 'always',
    cost: 4.50,
    profitMargin: 11.50
  },
  {
    id: 'cocktail-signature-old-fashioned',
    name: 'Smoke & Mirrors Old Fashioned',
    category: 'Signature Cocktails',
    description: 'A theatrical presentation of the classic Old Fashioned, served under a glass dome filled with applewood smoke.',
    price: 18.00,
    ingredients: ['Bourbon whiskey', 'Maple syrup', 'Angostura bitters', 'Orange peel', 'Applewood smoke'],
    preparationTime: 5,
    alcoholContent: 32,
    isSignature: true,
    isPopular: true,
    customizations: [
      {
        name: 'Whiskey Type',
        options: ['Bourbon', 'Rye', 'Japanese whisky'],
        priceModifier: 3
      },
      {
        name: 'Sweetener',
        options: ['Maple syrup', 'Simple syrup', 'Demerara sugar'],
        priceModifier: 0
      }
    ],
    pairings: ['Beef tenderloin', 'Dark chocolate dessert'],
    tags: ['Smoky', 'Classic', 'Theatrical'],
    availability: 'always',
    cost: 5.25,
    profitMargin: 12.75
  },
  {
    id: 'cocktail-signature-garden-gimlet',
    name: 'Secret Garden Gimlet',
    category: 'Signature Cocktails',
    description: 'A botanical masterpiece featuring cucumber-infused gin, elderflower liqueur, fresh herbs, and house-made tonic.',
    price: 15.00,
    ingredients: ['Cucumber gin', 'Elderflower liqueur', 'Fresh basil', 'Lime juice', 'House tonic'],
    preparationTime: 4,
    alcoholContent: 18,
    isSignature: true,
    isVegetarian: true,
    isVegan: true,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Herb Selection',
        options: ['Basil', 'Mint', 'Thyme'],
        priceModifier: 0
      },
      {
        name: 'Garnish Style',
        options: ['Cucumber ribbon', 'Herb bouquet', 'Edible flowers'],
        priceModifier: 1
      }
    ],
    pairings: ['Burrata', 'Grilled vegetables'],
    tags: ['Botanical', 'Fresh', 'Herbal'],
    availability: 'always',
    cost: 4.00,
    profitMargin: 11.00
  },

  // Classic Cocktails
  {
    id: 'cocktail-classic-martini',
    name: 'Classic Martini',
    category: 'Classic Cocktails',
    description: 'The timeless classic with premium gin or vodka, dry vermouth, and your choice of garnish.',
    price: 14.00,
    ingredients: ['Premium gin/vodka', 'Dry vermouth', 'Lemon twist or olives'],
    preparationTime: 2,
    alcoholContent: 28,
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Spirit Base',
        options: ['Gin', 'Vodka'],
        priceModifier: 0
      },
      {
        name: 'Dryness',
        options: ['Extra dry', 'Dry', 'Perfect'],
        priceModifier: 0
      },
      {
        name: 'Garnish',
        options: ['Lemon twist', 'Olives', 'Cocktail onion'],
        priceModifier: 0
      },
      {
        name: 'Temperature',
        options: ['Shaken', 'Stirred'],
        priceModifier: 0
      }
    ],
    pairings: ['Oysters', 'Caviar service'],
    tags: ['Classic', 'Elegant', 'Strong'],
    availability: 'always',
    cost: 3.50,
    profitMargin: 10.50
  },
  {
    id: 'cocktail-classic-manhattan',
    name: 'Manhattan',
    category: 'Classic Cocktails',
    description: 'A sophisticated blend of whiskey, sweet vermouth, and bitters, garnished with a cherry.',
    price: 15.00,
    ingredients: ['Rye whiskey', 'Sweet vermouth', 'Angostura bitters', 'Maraschino cherry'],
    preparationTime: 3,
    alcoholContent: 30,
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Whiskey Type',
        options: ['Rye', 'Bourbon', 'Canadian'],
        priceModifier: 0
      },
      {
        name: 'Style',
        options: ['Sweet', 'Dry', 'Perfect'],
        priceModifier: 0
      }
    ],
    pairings: ['Steak', 'Aged cheese'],
    tags: ['Classic', 'Sophisticated', 'Whiskey'],
    availability: 'always',
    cost: 3.75,
    profitMargin: 11.25
  },
  {
    id: 'cocktail-classic-margarita',
    name: 'Margarita',
    category: 'Classic Cocktails',
    description: 'Fresh lime juice, premium tequila, and triple sec, served with or without salt.',
    price: 12.00,
    ingredients: ['Silver tequila', 'Triple sec', 'Fresh lime juice', 'Salt rim'],
    preparationTime: 2,
    alcoholContent: 20,
    isPopular: true,
    customizations: [
      {
        name: 'Tequila Type',
        options: ['Silver', 'Reposado', 'Añejo'],
        priceModifier: 2
      },
      {
        name: 'Style',
        options: ['On the rocks', 'Frozen', 'Straight up'],
        priceModifier: 0
      },
      {
        name: 'Rim',
        options: ['Salt', 'Chili salt', 'No rim'],
        priceModifier: 0
      }
    ],
    pairings: ['Tacos', 'Ceviche'],
    tags: ['Classic', 'Citrus', 'Mexican'],
    availability: 'always',
    cost: 2.75,
    profitMargin: 9.25
  },

  // Craft Beer
  {
    id: 'beer-ipa',
    name: 'Local IPA',
    category: 'Craft Beer',
    description: 'A hoppy and citrusy IPA from our local brewery partner, featuring Citra and Mosaic hops.',
    price: 8.00,
    ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Yeast'],
    preparationTime: 1,
    alcoholContent: 6.5,
    isPopular: true,
    calories: 210,
    customizations: [
      {
        name: 'Serving Style',
        options: ['Draft', 'Bottle'],
        priceModifier: 0
      }
    ],
    pairings: ['Spicy wings', 'Burger'],
    tags: ['Hoppy', 'Citrus', 'Local'],
    availability: 'always',
    cost: 3.20,
    profitMargin: 4.80
  },
  {
    id: 'beer-porter',
    name: 'Chocolate Porter',
    category: 'Craft Beer',
    description: 'Rich and smooth porter with hints of chocolate and coffee, perfect for cooler evenings.',
    price: 9.00,
    ingredients: ['Dark malts', 'Chocolate malt', 'Coffee beans', 'English hops'],
    preparationTime: 1,
    alcoholContent: 5.8,
    calories: 190,
    customizations: [
      {
        name: 'Temperature',
        options: ['Cellar temp', 'Cold'],
        priceModifier: 0
      }
    ],
    pairings: ['Chocolate dessert', 'Grilled meats'],
    tags: ['Dark', 'Rich', 'Chocolate'],
    availability: 'seasonal',
    cost: 3.60,
    profitMargin: 5.40
  },

  // Wine Selection
  {
    id: 'wine-red-cab',
    name: 'Napa Valley Cabernet',
    category: 'Wine',
    description: 'Full-bodied Cabernet Sauvignon with rich tannins and notes of blackberry and oak.',
    price: 16.00,
    ingredients: ['Cabernet Sauvignon grapes', 'Oak aging'],
    preparationTime: 1,
    alcoholContent: 14.5,
    calories: 125,
    customizations: [
      {
        name: 'Serving Size',
        options: ['5oz glass', '9oz glass', 'Bottle'],
        priceModifier: 0
      }
    ],
    pairings: ['Ribeye steak', 'Lamb chops'],
    tags: ['Full-bodied', 'Red', 'Aged'],
    availability: 'always',
    cost: 6.00,
    profitMargin: 10.00
  },
  {
    id: 'wine-white-chard',
    name: 'Sonoma Chardonnay',
    category: 'Wine',
    description: 'Crisp and buttery Chardonnay with hints of vanilla and tropical fruit.',
    price: 14.00,
    ingredients: ['Chardonnay grapes', 'French oak'],
    preparationTime: 1,
    alcoholContent: 13.5,
    calories: 120,
    customizations: [
      {
        name: 'Serving Size',
        options: ['5oz glass', '9oz glass', 'Bottle'],
        priceModifier: 0
      }
    ],
    pairings: ['Grilled salmon', 'Chicken'],
    tags: ['Crisp', 'White', 'Oaked'],
    availability: 'always',
    cost: 5.25,
    profitMargin: 8.75
  },

  // Appetizers
  {
    id: 'food-wings',
    name: 'Signature Wings',
    category: 'Appetizers',
    description: 'Crispy wings tossed in your choice of our house-made sauces, served with celery and blue cheese.',
    price: 16.00,
    ingredients: ['Chicken wings', 'House sauce', 'Celery', 'Blue cheese dressing'],
    preparationTime: 15,
    calories: 480,
    isPopular: true,
    isGlutenFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Sauce',
        options: ['Buffalo', 'BBQ', 'Honey garlic', 'Dry rub', 'Korean BBQ'],
        priceModifier: 0
      },
      {
        name: 'Spice Level',
        options: ['Mild', 'Medium', 'Hot', 'Atomic'],
        priceModifier: 0
      },
      {
        name: 'Quantity',
        options: ['6 wings', '12 wings', '18 wings'],
        priceModifier: 8
      }
    ],
    pairings: ['IPA', 'Lager'],
    tags: ['Spicy', 'Crispy', 'Shareable'],
    availability: 'always',
    cost: 6.50,
    profitMargin: 9.50
  },
  {
    id: 'food-nachos',
    name: 'Loaded Nachos',
    category: 'Appetizers',
    description: 'House-made tortilla chips topped with melted cheese, jalapeños, sour cream, and guacamole.',
    price: 14.00,
    ingredients: ['Tortilla chips', 'Cheddar cheese', 'Jalapeños', 'Sour cream', 'Guacamole'],
    preparationTime: 10,
    calories: 620,
    isVegetarian: true,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Protein',
        options: ['None', 'Chicken', 'Beef', 'Pulled pork'],
        priceModifier: 4
      },
      {
        name: 'Spice Level',
        options: ['Mild', 'Medium', 'Hot'],
        priceModifier: 0
      }
    ],
    pairings: ['Margarita', 'Mexican beer'],
    tags: ['Cheesy', 'Shareable', 'Mexican'],
    availability: 'always',
    cost: 5.25,
    profitMargin: 8.75
  },
  {
    id: 'food-calamari',
    name: 'Crispy Calamari',
    category: 'Appetizers',
    description: 'Golden fried calamari rings served with marinara sauce and lemon aioli.',
    price: 15.00,
    ingredients: ['Calamari rings', 'Flour coating', 'Marinara sauce', 'Lemon aioli'],
    preparationTime: 12,
    calories: 380,
    customizations: [
      {
        name: 'Sauce',
        options: ['Marinara', 'Spicy marinara', 'Lemon aioli', 'Both'],
        priceModifier: 0
      }
    ],
    pairings: ['Pinot Grigio', 'Sauvignon Blanc'],
    tags: ['Crispy', 'Seafood', 'Italian'],
    availability: 'always',
    cost: 6.00,
    profitMargin: 9.00
  },

  // Main Courses
  {
    id: 'food-burger',
    name: 'Craft Burger',
    category: 'Main Courses',
    description: 'House-ground beef patty with lettuce, tomato, onion, and our signature sauce on a brioche bun.',
    price: 18.00,
    ingredients: ['Ground beef', 'Brioche bun', 'Lettuce', 'Tomato', 'Onion', 'Signature sauce'],
    preparationTime: 20,
    calories: 680,
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Cooking Temperature',
        options: ['Medium-rare', 'Medium', 'Medium-well', 'Well-done'],
        priceModifier: 0
      },
      {
        name: 'Cheese',
        options: ['None', 'Cheddar', 'Swiss', 'Blue cheese', 'Goat cheese'],
        priceModifier: 2
      },
      {
        name: 'Additions',
        options: ['Bacon', 'Mushrooms', 'Avocado', 'Fried egg'],
        priceModifier: 3
      }
    ],
    pairings: ['IPA', 'Red wine'],
    tags: ['Beef', 'Grilled', 'American'],
    availability: 'always',
    cost: 7.50,
    profitMargin: 10.50
  },
  {
    id: 'food-salmon',
    name: 'Grilled Salmon',
    category: 'Main Courses',
    description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter.',
    price: 26.00,
    ingredients: ['Atlantic salmon', 'Seasonal vegetables', 'Lemon butter', 'Herbs'],
    preparationTime: 18,
    calories: 420,
    isGlutenFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Preparation',
        options: ['Grilled', 'Pan-seared', 'Blackened'],
        priceModifier: 0
      },
      {
        name: 'Sauce',
        options: ['Lemon butter', 'Hollandaise', 'Teriyaki glaze'],
        priceModifier: 0
      }
    ],
    pairings: ['Chardonnay', 'Pinot Noir'],
    tags: ['Seafood', 'Healthy', 'Grilled'],
    availability: 'always',
    cost: 12.00,
    profitMargin: 14.00
  },
  {
    id: 'food-pasta',
    name: 'Truffle Pasta',
    category: 'Main Courses',
    description: 'House-made fettuccine with truffle cream sauce, wild mushrooms, and parmesan.',
    price: 22.00,
    ingredients: ['Fresh fettuccine', 'Truffle cream sauce', 'Wild mushrooms', 'Parmesan'],
    preparationTime: 15,
    calories: 540,
    isVegetarian: true,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=400&fit=crop',
    customizations: [
      {
        name: 'Protein',
        options: ['None', 'Chicken', 'Shrimp', 'Scallops'],
        priceModifier: 6
      },
      {
        name: 'Pasta Type',
        options: ['Fettuccine', 'Penne', 'Linguine'],
        priceModifier: 0
      }
    ],
    pairings: ['Chardonnay', 'Pinot Grigio'],
    tags: ['Pasta', 'Truffle', 'Italian'],
    availability: 'always',
    cost: 8.50,
    profitMargin: 13.50
  },

  // Desserts
  {
    id: 'dessert-chocolate',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    price: 12.00,
    ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Vanilla ice cream'],
    preparationTime: 8,
    calories: 480,
    isVegetarian: true,
    customizations: [
      {
        name: 'Ice Cream',
        options: ['Vanilla', 'Chocolate', 'Strawberry', 'None'],
        priceModifier: 0
      }
    ],
    pairings: ['Port wine', 'Espresso'],
    tags: ['Chocolate', 'Warm', 'Indulgent'],
    availability: 'always',
    cost: 3.50,
    profitMargin: 8.50
  },
  {
    id: 'dessert-cheesecake',
    name: 'New York Cheesecake',
    category: 'Desserts',
    description: 'Classic cheesecake with graham cracker crust and berry compote.',
    price: 10.00,
    ingredients: ['Cream cheese', 'Graham crackers', 'Berry compote', 'Whipped cream'],
    preparationTime: 5,
    calories: 380,
    isVegetarian: true,
    customizations: [
      {
        name: 'Topping',
        options: ['Berry compote', 'Chocolate sauce', 'Caramel sauce', 'Plain'],
        priceModifier: 0
      }
    ],
    pairings: ['Dessert wine', 'Coffee'],
    tags: ['Creamy', 'Classic', 'Sweet'],
    availability: 'always',
    cost: 3.00,
    profitMargin: 7.00
  },

  // Non-Alcoholic
  {
    id: 'mocktail-virgin-mojito',
    name: 'Virgin Mojito',
    category: 'Non-Alcoholic',
    description: 'Fresh mint, lime juice, and club soda for a refreshing alcohol-free experience.',
    price: 8.00,
    ingredients: ['Fresh mint', 'Lime juice', 'Simple syrup', 'Club soda'],
    preparationTime: 3,
    calories: 60,
    isVegetarian: true,
    isVegan: true,
    customizations: [
      {
        name: 'Flavor',
        options: ['Classic', 'Strawberry', 'Mango', 'Cucumber'],
        priceModifier: 1
      }
    ],
    pairings: ['Light appetizers', 'Seafood'],
    tags: ['Fresh', 'Mint', 'Citrus'],
    availability: 'always',
    cost: 2.25,
    profitMargin: 5.75
  },
  {
    id: 'coffee-espresso',
    name: 'Espresso',
    category: 'Non-Alcoholic',
    description: 'Rich and bold espresso shot made from our signature blend.',
    price: 4.00,
    ingredients: ['Espresso beans', 'Water'],
    preparationTime: 2,
    calories: 5,
    isVegetarian: true,
    isVegan: true,
    customizations: [
      {
        name: 'Size',
        options: ['Single shot', 'Double shot'],
        priceModifier: 2
      },
      {
        name: 'Style',
        options: ['Regular', 'Decaf'],
        priceModifier: 0
      }
    ],
    pairings: ['Desserts', 'Dark chocolate'],
    tags: ['Coffee', 'Strong', 'Italian'],
    availability: 'always',
    cost: 1.20,
    profitMargin: 2.80
  }
];

export const getMenuByCategory = (category?: string) => {
  if (!category || category === 'All') return menuData;
  return menuData.filter(item => item.category === category);
};

export const getMenuCategories = () => {
  const categories = [...new Set(menuData.map(item => item.category))];
  return categories.sort();
};

export const getPopularItems = () => {
  return menuData.filter(item => item.isPopular);
};

export const getSignatureItems = () => {
  return menuData.filter(item => item.isSignature);
};

export const getVegetarianItems = () => {
  return menuData.filter(item => item.isVegetarian);
};

export const getVeganItems = () => {
  return menuData.filter(item => item.isVegan);
};

export const getGlutenFreeItems = () => {
  return menuData.filter(item => item.isGlutenFree);
};

export const getMenuItemById = (id: string) => {
  return menuData.find(item => item.id === id);
};

export const getTotalMenuRevenue = () => {
  return menuData.reduce((total, item) => total + item.profitMargin, 0);
};

export const getAveragePrice = () => {
  const totalPrice = menuData.reduce((total, item) => total + item.price, 0);
  return totalPrice / menuData.length;
};