import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { PaperProvider, Button, Card, Title, Paragraph, Chip, IconButton, FAB } from 'react-native-paper';

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
    location: { coordinates: [100.5018, 13.7563] },
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
    location: { coordinates: [100.5200, 13.7307] },
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
        preparationTime: 10,
      },
      {
        id: '2',
        name: 'Tom Yum Soup',
        description: 'Spicy and sour Thai soup with shrimp, mushrooms, and herbs',
        price: 150,
        dietary: ['gluten-free'],
        spicy: 3,
        preparationTime: 15,
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
        preparationTime: 20,
      },
      {
        id: '4',
        name: 'Green Curry',
        description: 'Spicy green curry with chicken, eggplant, and Thai basil',
        price: 200,
        dietary: ['gluten-free'],
        spicy: 4,
        preparationTime: 25,
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
        preparationTime: 5,
      },
    ],
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({ restaurants: [], menuItems: [] });
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const renderSpicyLevel = (level: number) => {
    return '🌶️'.repeat(level);
  };

  const renderDietaryInfo = (dietary: string[]) => {
    return dietary.map((diet, index) => (
      <Chip key={index} compact style={styles.dietaryTag}>
        {diet}
      </Chip>
    ));
  };

  const calculateDistance = (restaurant: any) => {
    if (!userLocation || !restaurant.location?.coordinates) return null;
    
    // Simple distance calculation (not accurate, just for demo)
    const lat1 = userLocation.latitude;
    const lon1 = userLocation.longitude;
    const lat2 = restaurant.location.coordinates[1];
    const lon2 = restaurant.location.coordinates[0];
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    
    // Simulate getting location
    setTimeout(() => {
      setUserLocation({
        latitude: 13.7563,
        longitude: 100.5018,
        accuracy: 10,
      });
      setLocationLoading(false);
      Alert.alert('Location Found', 'Your location has been updated! Now you can see distances to restaurants.');
    }, 2000);
  };

  const handleAddToFavorites = (type: 'restaurant' | 'menuItem', item: any) => {
    setFavorites(prev => ({
      ...prev,
      [type === 'restaurant' ? 'restaurants' : 'menuItems']: [
        ...prev[type === 'restaurant' ? 'restaurants' : 'menuItems'],
        { ...item, addedAt: new Date().toISOString() }
      ]
    }));
    Alert.alert('Added to Favorites!', `${item.name} has been added to your favorites.`);
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Title style={styles.title}>🍽️ TouristMenuQR</Title>
          <Paragraph style={styles.subtitle}>
            Discover restaurants and menus with QR codes
          </Paragraph>
        </View>
        
        <View style={styles.headerActions}>
          <IconButton
            icon="heart"
            iconColor="#fff"
            size={24}
            onPress={() => setCurrentScreen('favorites')}
            style={styles.headerButton}
          />
          {(favorites.restaurants.length > 0 || favorites.menuItems.length > 0) && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {favorites.restaurants.length + favorites.menuItems.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Card style={styles.scanCard}>
        <Card.Content>
          <Title>📱 Scan QR Code</Title>
          <Paragraph>
            Point your camera at a restaurant's QR code to view their menu instantly
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => {
              Alert.alert(
                'QR Scanner',
                '📷 QR Scanner Features:\n\n✅ Flash control\n✅ Multiple barcode formats\n✅ Camera permissions\n✅ Web link support\n✅ Restaurant QR codes\n\nFor demo: Try clicking on a restaurant below!',
                [{ text: 'OK' }]
              );
            }}
            style={styles.scanButton}
            icon="qrcode-scan"
          >
            Scan QR Code
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.locationCard}>
        <Card.Content>
          <View style={styles.locationHeader}>
            <Title>📍 Find Nearby Restaurants</Title>
            {userLocation && (
              <Chip icon="map-marker" compact>
                Location Found
              </Chip>
            )}
          </View>
          <Paragraph>
            Get your current location to find restaurants near you
          </Paragraph>
          <Button
            mode="outlined"
            onPress={handleGetLocation}
            style={styles.locationButton}
            icon="crosshairs-gps"
            loading={locationLoading}
            disabled={locationLoading}
          >
            {userLocation ? 'Update Location' : 'Get My Location'}
          </Button>
          
          {userLocation && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                📍 Lat: {userLocation.latitude.toFixed(6)}, Lng: {userLocation.longitude.toFixed(6)}
              </Text>
              <Text style={styles.accuracyText}>
                Accuracy: ±{userLocation.accuracy}m
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>
            {userLocation ? '🏪 Nearby Restaurants' : '🏪 Featured Restaurants'}
          </Title>
          {userLocation && (
            <Chip icon="map-marker-radius" compact>
              Within 5km
            </Chip>
          )}
        </View>
        
        {demoRestaurants.map((restaurant) => {
          const distance = calculateDistance(restaurant);
          
          return (
            <Card
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => {
                setSelectedRestaurant(restaurant);
                setCurrentScreen('restaurant');
              }}
            >
              <Card.Content>
                <View style={styles.restaurantHeader}>
                  <View style={styles.restaurantInfo}>
                    <Title>{restaurant.name}</Title>
                    <Paragraph numberOfLines={2}>{restaurant.description}</Paragraph>
                    <Text style={styles.address}>{restaurant.address}</Text>
                  </View>
                  
                  {distance && (
                    <Chip icon="map-marker-distance" compact style={styles.distanceChip}>
                      {distance}
                    </Chip>
                  )}
                </View>
                
                <View style={styles.restaurantMeta}>
                  <Chip icon="star" compact style={styles.ratingChip}>
                    {restaurant.rating.toFixed(1)}
                  </Chip>
                  
                  <View style={styles.cuisineTypes}>
                    {restaurant.cuisineTypes.slice(0, 2).map((cuisine, index) => (
                      <Chip key={index} compact style={styles.cuisineChip}>
                        {cuisine}
                      </Chip>
                    ))}
                    {restaurant.cuisineTypes.length > 2 && (
                      <Text style={styles.moreText}>
                        +{restaurant.cuisineTypes.length - 2} more
                      </Text>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        })}
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
        <Title style={styles.title}>{selectedRestaurant?.name}</Title>
        
        <IconButton
          icon="heart"
          iconColor="#fff"
          size={24}
          onPress={() => handleAddToFavorites('restaurant', selectedRestaurant)}
          style={styles.headerButton}
        />
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
        <Title style={styles.title}>Menu - {selectedRestaurant?.name}</Title>
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
                  `${item.description}\n\nPrice: ฿${item.price}\nPreparation time: ${item.preparationTime} min\n${
                    item.spicy > 0 ? `Spicy Level: ${renderSpicyLevel(item.spicy)}\n` : ''
                  }Dietary: ${item.dietary.join(', ')}`,
                  [
                    { text: 'Close', style: 'cancel' },
                    { 
                      text: 'Add to Favorites', 
                      onPress: () => handleAddToFavorites('menuItem', {
                        ...item,
                        restaurant: { name: selectedRestaurant?.name },
                        category: { name: category.category }
                      })
                    },
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
                <Chip icon="clock-outline" compact style={styles.timeChip}>
                  {item.preparationTime} min
                </Chip>
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

  const renderFavoritesScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Title style={styles.title}>❤️ Favorites</Title>
      </View>

      <View style={styles.favoritesSection}>
        <Title style={styles.sectionTitle}>
          🏪 Favorite Restaurants ({favorites.restaurants.length})
        </Title>
        {favorites.restaurants.length > 0 ? (
          favorites.restaurants.map((restaurant, index) => (
            <Card key={index} style={styles.favoriteCard}>
              <Card.Content>
                <Title>{restaurant.name}</Title>
                <Paragraph>{restaurant.description}</Paragraph>
                <Text style={styles.addedDate}>
                  Added {new Date(restaurant.addedAt).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>No favorite restaurants yet</Text>
        )}
      </View>

      <View style={styles.favoritesSection}>
        <Title style={styles.sectionTitle}>
          🍽️ Favorite Menu Items ({favorites.menuItems.length})
        </Title>
        {favorites.menuItems.length > 0 ? (
          favorites.menuItems.map((item, index) => (
            <Card key={index} style={styles.favoriteCard}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>{item.description}</Paragraph>
                <Text style={styles.itemPrice}>฿{item.price}</Text>
                <Text style={styles.restaurantInfo}>
                  From {item.restaurant?.name} • {item.category?.name}
                </Text>
                <Text style={styles.addedDate}>
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>No favorite menu items yet</Text>
        )}
      </View>

      {favorites.restaurants.length === 0 && favorites.menuItems.length === 0 && (
        <View style={styles.emptyFavorites}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Title>No Favorites Yet</Title>
          <Paragraph style={styles.emptyDescription}>
            Start exploring restaurants and add them to your favorites!
          </Paragraph>
        </View>
      )}
    </ScrollView>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        {currentScreen === 'home' && renderHomeScreen()}
        {currentScreen === 'restaurant' && renderRestaurantScreen()}
        {currentScreen === 'menu' && renderMenuScreen()}
        {currentScreen === 'favorites' && renderFavoritesScreen()}
        
        {currentScreen === 'home' && (
          <FAB
            icon="qrcode-scan"
            style={styles.fab}
            onPress={() => {
              Alert.alert(
                'QR Scanner Ready!',
                '📷 Enhanced QR Scanner with:\n\n✅ Flash control\n✅ Multiple barcode formats\n✅ Camera permissions\n✅ Web link support\n✅ Restaurant QR codes\n\nWould open camera in real app!'
              );
            }}
            label="Scan QR"
          />
        )}
      </SafeAreaView>
    </PaperProvider>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
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
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  headerActions: {
    position: 'relative',
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scanCard: {
    margin: 16,
    elevation: 4,
  },
  scanButton: {
    marginTop: 16,
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButton: {
    marginTop: 16,
  },
  locationInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  restaurantCard: {
    marginBottom: 12,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 12,
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
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  distanceChip: {
    backgroundColor: '#E3F2FD',
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
  ratingChip: {
    backgroundColor: '#FFF3E0',
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
  cuisineTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cuisineChip: {
    marginRight: 6,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
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
  timeChip: {
    marginRight: 8,
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
  favoritesSection: {
    padding: 16,
  },
  favoriteCard: {
    marginBottom: 12,
    elevation: 2,
  },
  addedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  restaurantInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyFavorites: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyDescription: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});