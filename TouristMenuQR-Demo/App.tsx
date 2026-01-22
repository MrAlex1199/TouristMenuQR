import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';

// Demo data
const demoRestaurants = [
  {
    id: '1',
    name: 'Bangkok Street Food',
    description: 'Authentic Thai street food experience in the heart of Bangkok',
    address: '123 Sukhumvit Road, Bangkok 10110',
    phone: '+66-2-123-4567',
    cuisineTypes: ['Thai', 'Street Food', 'Asian'],
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Italian Corner',
    description: 'Traditional Italian cuisine with modern twist',
    address: '456 Silom Road, Bangkok 10500',
    phone: '+66-2-987-6543',
    cuisineTypes: ['Italian', 'European', 'Pizza'],
    rating: 4.2,
    reviews: 89,
  },
];

const demoMenu = [
  {
    category: 'Appetizers',
    items: [
      {
        id: '1',
        name: 'Spring Rolls',
        description: 'Fresh vegetables wrapped in rice paper, served with sweet chili sauce',
        price: 120,
        dietary: ['vegetarian', 'vegan'],
        spicy: 1,
      },
      {
        id: '2',
        name: 'Tom Yum Soup',
        description: 'Spicy and sour Thai soup with shrimp, mushrooms, and herbs',
        price: 150,
        dietary: ['gluten-free'],
        spicy: 3,
      },
    ],
  },
  {
    category: 'Main Dishes',
    items: [
      {
        id: '3',
        name: 'Pad Thai',
        description: 'Traditional Thai stir-fried noodles with shrimp, tofu, and peanuts',
        price: 180,
        dietary: ['gluten-free'],
        spicy: 2,
      },
      {
        id: '4',
        name: 'Green Curry',
        description: 'Spicy green curry with chicken, eggplant, and Thai basil',
        price: 200,
        dietary: ['gluten-free'],
        spicy: 4,
      },
    ],
  },
  {
    category: 'Desserts',
    items: [
      {
        id: '5',
        name: 'Mango Sticky Rice',
        description: 'Sweet sticky rice with fresh mango and coconut milk',
        price: 100,
        dietary: ['vegetarian', 'vegan', 'gluten-free'],
        spicy: 0,
      },
    ],
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const renderSpicyLevel = (level: number) => {
    return '🌶️'.repeat(level);
  };

  const renderDietaryInfo = (dietary: string[]) => {
    return dietary.map((diet, index) => (
      <Text key={index} style={styles.dietaryTag}>
        {diet}
      </Text>
    ));
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ TouristMenuQR</Text>
        <Text style={styles.subtitle}>Discover restaurants and menus with QR codes</Text>
      </View>

      <View style={styles.scanSection}>
        <Text style={styles.sectionTitle}>📱 Scan QR Code</Text>
        <Text style={styles.description}>
          Point your camera at a restaurant's QR code to view their menu instantly
        </Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {
            Alert.alert(
              'QR Scanner',
              'QR Scanner would open camera here!\n\nFor demo: Try clicking on a restaurant below to see the menu.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.scanButtonText}>📷 Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏪 Nearby Restaurants</Text>
        {demoRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => {
              setSelectedRestaurant(restaurant);
              setCurrentScreen('restaurant');
            }}
          >
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
            <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
            <View style={styles.restaurantMeta}>
              <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
              <Text style={styles.reviews}>({restaurant.reviews} reviews)</Text>
              <Text style={styles.cuisine}>{restaurant.cuisineTypes.join(', ')}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderRestaurantScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedRestaurant?.name}</Text>
      </View>

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantDescription}>{selectedRestaurant?.description}</Text>
        <Text style={styles.restaurantAddress}>📍 {selectedRestaurant?.address}</Text>
        <Text style={styles.restaurantPhone}>📞 {selectedRestaurant?.phone}</Text>
        <View style={styles.restaurantMeta}>
          <Text style={styles.rating}>⭐ {selectedRestaurant?.rating}</Text>
          <Text style={styles.reviews}>({selectedRestaurant?.reviews} reviews)</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setCurrentScreen('menu')}
      >
        <Text style={styles.menuButtonText}>🍽️ View Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderMenuScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('restaurant')}
        >
          <Text style={styles.backButtonText}>← Back to Restaurant</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Menu - {selectedRestaurant?.name}</Text>
      </View>

      {demoMenu.map((category, categoryIndex) => (
        <View key={categoryIndex} style={styles.menuCategory}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                Alert.alert(
                  item.name,
                  `${item.description}\n\nPrice: ฿${item.price}\n${
                    item.spicy > 0 ? `Spicy Level: ${renderSpicyLevel(item.spicy)}\n` : ''
                  }Dietary: ${item.dietary.join(', ')}`,
                  [
                    { text: 'Close', style: 'cancel' },
                    { text: 'Add to Favorites', onPress: () => Alert.alert('Added to Favorites!') },
                  ]
                );
              }}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>฿{item.price}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemMeta}>
                {item.spicy > 0 && (
                  <Text style={styles.spicyLevel}>{renderSpicyLevel(item.spicy)}</Text>
                )}
                <View style={styles.dietaryInfo}>{renderDietaryInfo(item.dietary)}</View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'restaurant' && renderRestaurantScreen()}
      {currentScreen === 'menu' && renderMenuScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  scanSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  cuisine: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  restaurantInfo: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuCategory: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
    padding: 16,
    color: '#333',
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  spicyLevel: {
    fontSize: 14,
    marginRight: 10,
  },
  dietaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryTag: {
    fontSize: 12,
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
});