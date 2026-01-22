// Demo data for testing when backend is not available
export const demoRestaurants = [
  {
    _id: 'demo-restaurant-1',
    name: 'Bangkok Street Food',
    description: 'Authentic Thai street food experience in the heart of Bangkok',
    address: '123 Sukhumvit Road, Bangkok 10110',
    phoneNumber: '+66-2-123-4567',
    email: 'info@bangkokstreetfood.com',
    website: 'https://bangkokstreetfood.com',
    cuisineTypes: ['Thai', 'Street Food', 'Asian'],
    averageRating: 4.5,
    totalReviews: 128,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    location: {
      type: 'Point',
      coordinates: [100.5018, 13.7563]
    },
    openingHours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '23:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    },
    isActive: true,
    createdAt: '2026-01-22T00:00:00.000Z',
    updatedAt: '2026-01-22T00:00:00.000Z'
  },
  {
    _id: 'demo-restaurant-2',
    name: 'Italian Corner',
    description: 'Traditional Italian cuisine with modern twist',
    address: '456 Silom Road, Bangkok 10500',
    phoneNumber: '+66-2-987-6543',
    email: 'hello@italiancorner.co.th',
    cuisineTypes: ['Italian', 'European', 'Pizza'],
    averageRating: 4.2,
    totalReviews: 89,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    location: {
      type: 'Point',
      coordinates: [100.5200, 13.7307]
    },
    isActive: true,
    createdAt: '2026-01-22T00:00:00.000Z',
    updatedAt: '2026-01-22T00:00:00.000Z'
  }
];

export const demoMenus = [
  {
    _id: 'demo-menu-1',
    restaurant: 'demo-restaurant-1',
    name: 'Main Menu',
    description: 'Our signature Thai dishes',
    categories: [
      {
        _id: 'demo-category-1',
        name: 'Appetizers',
        description: 'Start your meal with these delicious appetizers',
        sortOrder: 1,
        isActive: true,
        items: [
          {
            _id: 'demo-item-1',
            name: 'Spring Rolls',
            description: 'Fresh vegetables wrapped in rice paper, served with sweet chili sauce',
            price: 120,
            image: 'https://via.placeholder.com/300x200?text=Spring+Rolls',
            allergens: ['soy'],
            dietaryInfo: ['vegetarian', 'vegan'],
            isAvailable: true,
            preparationTime: 10,
            spicyLevel: 1,
            calories: 180,
            orderCount: 45
          },
          {
            _id: 'demo-item-2',
            name: 'Tom Yum Soup',
            description: 'Spicy and sour Thai soup with shrimp, mushrooms, and herbs',
            price: 150,
            image: 'https://via.placeholder.com/300x200?text=Tom+Yum+Soup',
            allergens: ['shellfish'],
            dietaryInfo: ['gluten-free'],
            isAvailable: true,
            preparationTime: 15,
            spicyLevel: 3,
            calories: 120,
            orderCount: 67
          }
        ]
      },
      {
        _id: 'demo-category-2',
        name: 'Main Dishes',
        description: 'Our signature main courses',
        sortOrder: 2,
        isActive: true,
        items: [
          {
            _id: 'demo-item-3',
            name: 'Pad Thai',
            description: 'Traditional Thai stir-fried noodles with shrimp, tofu, and peanuts',
            price: 180,
            image: 'https://via.placeholder.com/300x200?text=Pad+Thai',
            allergens: ['peanuts', 'shellfish', 'eggs'],
            dietaryInfo: ['gluten-free'],
            isAvailable: true,
            preparationTime: 20,
            spicyLevel: 2,
            calories: 450,
            orderCount: 123
          },
          {
            _id: 'demo-item-4',
            name: 'Green Curry',
            description: 'Spicy green curry with chicken, eggplant, and Thai basil',
            price: 200,
            image: 'https://via.placeholder.com/300x200?text=Green+Curry',
            allergens: ['coconut'],
            dietaryInfo: ['gluten-free'],
            isAvailable: true,
            preparationTime: 25,
            spicyLevel: 4,
            calories: 380,
            orderCount: 89
          }
        ]
      },
      {
        _id: 'demo-category-3',
        name: 'Desserts',
        description: 'Sweet endings to your meal',
        sortOrder: 3,
        isActive: true,
        items: [
          {
            _id: 'demo-item-5',
            name: 'Mango Sticky Rice',
            description: 'Sweet sticky rice with fresh mango and coconut milk',
            price: 100,
            image: 'https://via.placeholder.com/300x200?text=Mango+Sticky+Rice',
            allergens: ['coconut'],
            dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
            isAvailable: true,
            preparationTime: 5,
            spicyLevel: 0,
            calories: 320,
            orderCount: 78
          }
        ]
      }
    ],
    isActive: true,
    currency: 'THB',
    createdAt: '2026-01-22T00:00:00.000Z',
    updatedAt: '2026-01-22T00:00:00.000Z'
  }
];

export const getPopularItems = (restaurantId: string) => {
  const menu = demoMenus.find(m => m.restaurant === restaurantId);
  if (!menu) return [];

  const allItems = menu.categories.flatMap(category => 
    category.items.map(item => ({
      menuId: menu._id,
      menuName: menu.name,
      categoryId: category._id,
      categoryName: category.name,
      item: item
    }))
  );

  return allItems
    .sort((a, b) => (b.item.orderCount || 0) - (a.item.orderCount || 0))
    .slice(0, 5);
};