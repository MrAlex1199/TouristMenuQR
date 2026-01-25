import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  Switch,
  Appearance,
} from 'react-native';

// Enhanced Demo data with more details like Wongnai
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
    image: '🍜',
    priceRange: '฿฿',
    openTime: '10:00 - 22:00',
    isOpen: true,
    deliveryTime: '25-35 min',
    promotions: ['Free delivery', '20% off'],
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
    image: '🍕',
    priceRange: '฿฿฿',
    openTime: '11:00 - 23:00',
    isOpen: true,
    deliveryTime: '30-40 min',
    promotions: ['Buy 1 Get 1'],
  },
  {
    id: '3',
    name: 'Sushi Zen',
    description: 'Fresh sushi and Japanese cuisine by experienced chefs',
    address: '789 Thonglor Road, Bangkok 10110',
    phone: '+66-2-555-0123',
    cuisineTypes: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.7,
    reviews: 256,
    image: '🍣',
    priceRange: '฿฿฿฿',
    openTime: '17:00 - 24:00',
    isOpen: false,
    deliveryTime: '35-45 min',
    promotions: [],
  },
  {
    id: '4',
    name: 'Burger House',
    description: 'Gourmet burgers made with premium ingredients',
    address: '321 Ekkamai Road, Bangkok 10110',
    phone: '+66-2-777-8888',
    cuisineTypes: ['American', 'Burger', 'Fast Food'],
    rating: 4.3,
    reviews: 167,
    image: '🍔',
    priceRange: '฿฿',
    openTime: '11:00 - 22:00',
    isOpen: true,
    deliveryTime: '20-30 min',
    promotions: ['Student discount 15%'],
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
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [favorites, setFavorites] = useState({ restaurants: [], menuItems: [] });
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [authMode, setAuthMode] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Thai', 'Italian', 'Japanese', 'American', 'Asian'];

  const renderSpicyLevel = (level) => {
    return '🌶️'.repeat(level);
  };

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('❌ Error', 'Please fill in all fields');
      return;
    }

    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Tourist User',
        email: loginForm.email,
        joinedAt: new Date().toISOString(),
        preferences: {
          darkMode: isDarkMode,
          language: 'th',
        }
      });
      setCurrentScreen('home');
      Alert.alert('✅ Welcome!', `Logged in as ${loginForm.email}`);
    }, 1000);
  };

  const handleRegister = () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      Alert.alert('❌ Error', 'Please fill in all fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert('❌ Error', 'Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      Alert.alert('❌ Error', 'Password must be at least 6 characters');
      return;
    }

    setTimeout(() => {
      setUser({
        id: '1',
        name: registerForm.name,
        email: registerForm.email,
        joinedAt: new Date().toISOString(),
        preferences: {
          darkMode: isDarkMode,
          language: 'th',
        }
      });
      setCurrentScreen('home');
      Alert.alert('🎉 Success!', `Welcome ${registerForm.name}! Your account has been created.`);
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      '👋 Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            setUser(null);
            setCurrentScreen('auth');
            setLoginForm({ email: '', password: '' });
            setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
          }
        }
      ]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (user) {
      setUser(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          darkMode: !isDarkMode
        }
      }));
    }
  };

  const getStyles = () => {
    return isDarkMode ? darkStyles : lightStyles;
  };

  const filteredRestaurants = demoRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisineTypes.some(cuisine => 
                           cuisine.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'All' || 
                           restaurant.cuisineTypes.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleGetLocation = () => {
    setLocationLoading(true);
    
    setTimeout(() => {
      setUserLocation({
        latitude: 13.7563,
        longitude: 100.5018,
        accuracy: 10,
      });
      setLocationLoading(false);
      Alert.alert('📍 Location Found!', 'Your location has been updated! Now you can see distances to restaurants.');
    }, 2000);
  };

  const handleAddToFavorites = (type, item) => {
    if (!user) {
      Alert.alert(
        '🔑 Login Required',
        'Please login to save your favorite restaurants and menu items.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => setCurrentScreen('auth') }
        ]
      );
      return;
    }

    setFavorites(prev => ({
      ...prev,
      [type === 'restaurant' ? 'restaurants' : 'menuItems']: [
        ...prev[type === 'restaurant' ? 'restaurants' : 'menuItems'],
        { ...item, addedAt: new Date().toISOString() }
      ]
    }));
    Alert.alert('❤️ Added to Favorites!', `${item.name} has been added to your favorites.`);
  };

  const calculateDistance = (restaurant) => {
    if (!userLocation || !restaurant.location?.coordinates) return null;
    
    const distances = ['0.8km', '1.2km', '2.1km', '3.5km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Modern Wongnai-style Home Screen
  const renderHomeScreen = () => {
    const styles = getStyles();
    
    return (
      <View style={styles.container}>
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerTop}>
            <View style={styles.locationSection}>
              <Text style={styles.locationLabel}>
                {user ? '📍 Deliver to' : '👻 Guest Mode'}
              </Text>
              <Text style={styles.locationText}>
                {user 
                  ? (userLocation ? 'Current Location' : 'Set Location')
                  : 'Limited features available'
                }
              </Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={toggleDarkMode}
              >
                <Text style={styles.headerButtonText}>{isDarkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
              
              {user ? (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setCurrentScreen('profile')}
                >
                  <Text style={styles.headerButtonText}>👤</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setCurrentScreen('auth')}
                >
                  <Text style={styles.headerButtonText}>🔑</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.headerButton, styles.favoritesHeaderButton]}
                onPress={() => setCurrentScreen('favorites')}
              >
                <Text style={styles.headerButtonText}>❤️</Text>
                {(favorites.restaurants.length > 0 || favorites.menuItems.length > 0) && (
                  <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>
                      {favorites.restaurants.length + favorites.menuItems.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search restaurants, cuisines..."
                placeholderTextColor={isDarkMode ? '#6c757d' : '#adb5bd'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => {
                Alert.alert(
                  '📷 QR Scanner',
                  'Enhanced QR Scanner Features:\n\n✅ Flash control\n✅ Multiple barcode formats\n✅ Camera permissions\n✅ Web link support\n✅ Restaurant QR codes\n\nWould open camera in real app!'
                );
              }}
            >
              <Text style={styles.qrButtonText}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleGetLocation}
              disabled={locationLoading}
            >
              <Text style={styles.quickActionIcon}>📍</Text>
              <Text style={styles.quickActionTitle}>
                {locationLoading ? 'Finding...' : userLocation ? 'Update Location' : 'Find Nearby'}
              </Text>
              <Text style={styles.quickActionSubtitle}>
                {userLocation ? 'Location found' : 'Get restaurants near you'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => setCurrentScreen('favorites')}
            >
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={styles.quickActionTitle}>Favorites</Text>
              <Text style={styles.quickActionSubtitle}>
                {favorites.restaurants.length + favorites.menuItems.length} items
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => {
                Alert.alert('🎯 Coming Soon', 'Promotions feature will be available soon!');
              }}
            >
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionTitle}>Promotions</Text>
              <Text style={styles.quickActionSubtitle}>Special offers</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          <View style={styles.categorySection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Restaurant List */}
          <View style={styles.restaurantSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {userLocation ? '🏪 Nearby Restaurants' : '🏪 Popular Restaurants'}
              </Text>
              <Text style={styles.resultCount}>
                {filteredRestaurants.length} found
              </Text>
            </View>

            {filteredRestaurants.map((restaurant) => {
              const distance = userLocation ? calculateDistance(restaurant) : null;
              const isFavorite = favorites.restaurants.some(fav => fav.id === restaurant.id);
              
              return (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.modernRestaurantCard}
                  onPress={() => {
                    setSelectedRestaurant(restaurant);
                    setCurrentScreen('restaurant');
                  }}
                >
                  {/* Restaurant Image */}
                  <View style={styles.restaurantImageContainer}>
                    <Text style={styles.restaurantImage}>{restaurant.image}</Text>
                    {restaurant.promotions.length > 0 && (
                      <View style={styles.promotionBadge}>
                        <Text style={styles.promotionBadgeText}>PROMO</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => handleAddToFavorites('restaurant', restaurant)}
                    >
                      <Text style={styles.favoriteButtonText}>
                        {isFavorite ? '❤️' : '🤍'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Restaurant Info */}
                  <View style={styles.restaurantContent}>
                    <View style={styles.restaurantHeader}>
                      <Text style={styles.modernRestaurantName}>{restaurant.name}</Text>
                      <View style={styles.statusContainer}>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: restaurant.isOpen ? '#28a745' : '#dc3545' }
                        ]} />
                        <Text style={styles.statusText}>
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.modernRestaurantDescription} numberOfLines={2}>
                      {restaurant.description}
                    </Text>

                    {/* Rating and Info */}
                    <View style={styles.restaurantMeta}>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
                        <Text style={styles.reviewText}>({restaurant.reviews})</Text>
                      </View>
                      
                      <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
                      
                      {distance && (
                        <View style={styles.distanceContainer}>
                          <Text style={styles.distanceText}>{distance}</Text>
                        </View>
                      )}
                    </View>

                    {/* Delivery Info */}
                    <View style={styles.deliveryInfo}>
                      <Text style={styles.deliveryTime}>🚚 {restaurant.deliveryTime}</Text>
                      <Text style={styles.openTime}>🕒 {restaurant.openTime}</Text>
                    </View>

                    {/* Promotions */}
                    {restaurant.promotions.length > 0 && (
                      <View style={styles.promotionsContainer}>
                        {restaurant.promotions.slice(0, 2).map((promo, index) => (
                          <View key={index} style={styles.promoTag}>
                            <Text style={styles.promoTagText}>{promo}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Cuisine Types */}
                    <View style={styles.cuisineContainer}>
                      {restaurant.cuisineTypes.slice(0, 3).map((cuisine, index) => (
                        <View key={index} style={styles.cuisineTag}>
                          <Text style={styles.cuisineTagText}>{cuisine}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredRestaurants.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>No restaurants found</Text>
                <Text style={styles.emptyStateDescription}>
                  Try adjusting your search or category filter
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  // Keep other render functions the same but update styles
  const renderRestaurantScreen = () => {
    const styles = getStyles();
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.modernHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedRestaurant?.name}</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => handleAddToFavorites('restaurant', selectedRestaurant)}
          >
            <Text style={styles.headerButtonText}>❤️</Text>
          </TouchableOpacity>
        </View>

        {!user && (
          <View style={styles.guestNotice}>
            <Text style={styles.guestNoticeText}>
              👻 Guest Mode - Login to save favorites and access full features
            </Text>
            <TouchableOpacity
              style={styles.guestLoginButton}
              onPress={() => setCurrentScreen('auth')}
            >
              <Text style={styles.guestLoginButtonText}>🔑 Login</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.restaurantDetailCard}>
          <View style={styles.restaurantImageHeader}>
            <Text style={styles.restaurantDetailImage}>{selectedRestaurant?.image}</Text>
            <View style={styles.restaurantDetailInfo}>
              <Text style={styles.restaurantDetailName}>{selectedRestaurant?.name}</Text>
              <Text style={styles.restaurantDetailDescription}>{selectedRestaurant?.description}</Text>
              <Text style={styles.restaurantDetailAddress}>📍 {selectedRestaurant?.address}</Text>
              <Text style={styles.restaurantDetailPhone}>📞 {selectedRestaurant?.phone}</Text>
            </View>
          </View>
          
          <View style={styles.restaurantDetailMeta}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {selectedRestaurant?.rating}</Text>
              <Text style={styles.reviewText}>({selectedRestaurant?.reviews} reviews)</Text>
            </View>
            <Text style={styles.priceRange}>{selectedRestaurant?.priceRange}</Text>
            <Text style={styles.openTime}>🕒 {selectedRestaurant?.openTime}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.modernMenuButton}
          onPress={() => setCurrentScreen('menu')}
        >
          <Text style={styles.modernMenuButtonText}>🍽️ View Full Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // Auth screen and other screens remain similar but with updated styles
  const renderAuthScreen = () => {
    const styles = getStyles();
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authHeader}>
            <Text style={styles.authTitle}>🍽️ TouristMenuQR</Text>
            <Text style={styles.authSubtitle}>
              {authMode === 'login' ? 'Welcome back!' : 'Create your account'}
            </Text>
            
            <TouchableOpacity
              style={styles.themeButton}
              onPress={toggleDarkMode}
            >
              <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.authForm}>
            {authMode === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDarkMode ? '#6c757d' : '#adb5bd'}
                  value={registerForm.name}
                  onChangeText={(text) => setRegisterForm(prev => ({ ...prev, name: text }))}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📧 Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? '#6c757d' : '#adb5bd'}
                value={authMode === 'login' ? loginForm.email : registerForm.email}
                onChangeText={(text) => {
                  if (authMode === 'login') {
                    setLoginForm(prev => ({ ...prev, email: text }));
                  } else {
                    setRegisterForm(prev => ({ ...prev, email: text }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔒 Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={isDarkMode ? '#6c757d' : '#adb5bd'}
                value={authMode === 'login' ? loginForm.password : registerForm.password}
                onChangeText={(text) => {
                  if (authMode === 'login') {
                    setLoginForm(prev => ({ ...prev, password: text }));
                  } else {
                    setRegisterForm(prev => ({ ...prev, password: text }));
                  }
                }}
                secureTextEntry
              />
            </View>

            {authMode === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🔒 Confirm Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={isDarkMode ? '#6c757d' : '#adb5bd'}
                  value={registerForm.confirmPassword}
                  onChangeText={(text) => setRegisterForm(prev => ({ ...prev, confirmPassword: text }))}
                  secureTextEntry
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.authButton}
              onPress={authMode === 'login' ? handleLogin : handleRegister}
            >
              <Text style={styles.authButtonText}>
                {authMode === 'login' ? '🚀 Login' : '🎉 Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setLoginForm({ email: '', password: '' });
                setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
              }}
            >
              <Text style={styles.switchAuthText}>
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Login'
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setCurrentScreen('home')}
            >
              <Text style={styles.guestButtonText}>👻 Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderMenuScreen = () => {
    const styles = getStyles();
    
    return (
      <View style={styles.container}>
        <View style={styles.modernHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('restaurant')}
          >
            <Text style={styles.backButtonText}>← Back to Restaurant</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu - {selectedRestaurant?.name}</Text>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {demoMenu.map((category, categoryIndex) => (
            <View key={categoryIndex} style={styles.menuCategory}>
              <Text style={styles.menuCategoryTitle}>{category.category}</Text>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modernMenuItem}
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
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>฿{item.price}</Text>
                  </View>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  <View style={styles.menuItemMeta}>
                    <View style={styles.timeChip}>
                      <Text style={styles.chipText}>⏱️ {item.preparationTime} min</Text>
                    </View>
                    {item.spicy > 0 && (
                      <Text style={styles.spicyLevel}>{renderSpicyLevel(item.spicy)}</Text>
                    )}
                    <View style={styles.dietaryInfo}>
                      {item.dietary.map((diet, index) => (
                        <View key={index} style={styles.dietaryTag}>
                          <Text style={styles.dietaryTagText}>{diet}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFavoritesScreen = () => {
    const styles = getStyles();
    
    return (
      <View style={styles.container}>
        <View style={styles.modernHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>❤️ Favorites</Text>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>
              🏪 Favorite Restaurants ({favorites.restaurants.length})
            </Text>
            {favorites.restaurants.length > 0 ? (
              favorites.restaurants.map((restaurant, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modernFavoriteCard}
                  onPress={() => {
                    setSelectedRestaurant(restaurant);
                    setCurrentScreen('restaurant');
                  }}
                >
                  <View style={styles.favoriteImageContainer}>
                    <Text style={styles.favoriteImage}>{restaurant.image || '🍽️'}</Text>
                  </View>
                  <View style={styles.favoriteContent}>
                    <Text style={styles.favoriteTitle}>{restaurant.name}</Text>
                    <Text style={styles.favoriteDescription} numberOfLines={2}>
                      {restaurant.description}
                    </Text>
                    <View style={styles.favoriteMeta}>
                      <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
                      <Text style={styles.priceRange}>{restaurant.priceRange || '฿฿'}</Text>
                    </View>
                    <Text style={styles.addedDate}>
                      Added {new Date(restaurant.addedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🏪</Text>
                <Text style={styles.emptyStateTitle}>No favorite restaurants yet</Text>
                <Text style={styles.emptyStateDescription}>
                  Start exploring and add restaurants to your favorites!
                </Text>
              </View>
            )}
          </View>

          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>
              🍽️ Favorite Menu Items ({favorites.menuItems.length})
            </Text>
            {favorites.menuItems.length > 0 ? (
              favorites.menuItems.map((item, index) => (
                <View key={index} style={styles.modernFavoriteCard}>
                  <View style={styles.favoriteImageContainer}>
                    <Text style={styles.favoriteImage}>🍽️</Text>
                  </View>
                  <View style={styles.favoriteContent}>
                    <Text style={styles.favoriteTitle}>{item.name}</Text>
                    <Text style={styles.favoriteDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.favoriteMeta}>
                      <Text style={styles.menuItemPrice}>฿{item.price}</Text>
                      {item.spicy > 0 && (
                        <Text style={styles.spicyLevel}>{renderSpicyLevel(item.spicy)}</Text>
                      )}
                    </View>
                    <Text style={styles.restaurantInfo}>
                      From {item.restaurant?.name} • {item.category?.name}
                    </Text>
                    <Text style={styles.addedDate}>
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🍽️</Text>
                <Text style={styles.emptyStateTitle}>No favorite menu items yet</Text>
                <Text style={styles.emptyStateDescription}>
                  Browse restaurant menus and add your favorite dishes!
                </Text>
              </View>
            )}
          </View>

          {favorites.restaurants.length === 0 && favorites.menuItems.length === 0 && (
            <View style={styles.emptyFavorites}>
              <Text style={styles.emptyStateIcon}>💔</Text>
              <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
              <Text style={styles.emptyStateDescription}>
                {user 
                  ? 'Start exploring restaurants and add them to your favorites!'
                  : 'Login to save your favorite restaurants and menu items!'
                }
              </Text>
              {user ? (
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => setCurrentScreen('home')}
                >
                  <Text style={styles.exploreButtonText}>🔍 Explore Restaurants</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => setCurrentScreen('auth')}
                >
                  <Text style={styles.exploreButtonText}>🔑 Login to Save Favorites</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderProfileScreen = () => {
    const styles = getStyles();
    
    return (
      <View style={styles.container}>
        <View style={styles.modernHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>👤 Profile</Text>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.joinedDate}>
              Joined {new Date(user?.joinedAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Your Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{favorites.restaurants.length}</Text>
                <Text style={styles.statLabel}>Favorite Restaurants</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{favorites.menuItems.length}</Text>
                <Text style={styles.statLabel}>Favorite Dishes</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>⚙️ Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🌙 Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Switch between light and dark theme
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: '#007bff' }}
                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🌐 Language</Text>
                <Text style={styles.settingDescription}>ไทย (Thai)</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🔔 Notifications</Text>
                <Text style={styles.settingDescription}>Manage your notifications</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>📍 Location</Text>
                <Text style={styles.settingDescription}>
                  {userLocation ? 'Location enabled' : 'Location disabled'}
                </Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>👋 Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={getStyles().safeArea}>
      {!user && currentScreen === 'auth' && renderAuthScreen()}
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'restaurant' && renderRestaurantScreen()}
      {currentScreen === 'menu' && renderMenuScreen()}
      {currentScreen === 'favorites' && renderFavoritesScreen()}
      {user && currentScreen === 'profile' && renderProfileScreen()}
    </SafeAreaView>
  );
}

// Modern Wongnai-inspired styles
const lightStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Modern Header Styles
  modernHeader: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationSection: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  headerButtonText: {
    fontSize: 18,
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#6c757d',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6c757d',
  },
  qrButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButtonText: {
    fontSize: 20,
  },
  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  // Category Section
  categorySection: {
    paddingVertical: 15,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryChipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  // Restaurant Section
  restaurantSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  // Modern Restaurant Card
  modernRestaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  restaurantImage: {
    fontSize: 48,
  },
  promotionBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  promotionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 16,
  },
  restaurantContent: {
    padding: 15,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modernRestaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  modernRestaurantDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 10,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffc107',
    marginRight: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#6c757d',
  },
  priceRange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
    marginRight: 15,
  },
  distanceContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#17a2b8',
    fontWeight: '500',
  },
  openTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  promotionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  promoTag: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  promoTagText: {
    fontSize: 10,
    color: '#856404',
    fontWeight: '500',
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuisineTag: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  cuisineTagText: {
    fontSize: 10,
    color: '#6c757d',
    fontWeight: '500',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  // Restaurant Detail Styles
  restaurantDetailCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImageHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  restaurantDetailImage: {
    fontSize: 60,
    marginRight: 20,
  },
  restaurantDetailInfo: {
    flex: 1,
  },
  restaurantDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  restaurantDetailDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 8,
  },
  restaurantDetailAddress: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  restaurantDetailPhone: {
    fontSize: 14,
    color: '#6c757d',
  },
  restaurantDetailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modernMenuButton: {
    backgroundColor: '#007bff',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modernMenuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Auth Styles
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  themeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
  authForm: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  authButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchAuthButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  switchAuthText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  guestButton: {
    borderWidth: 1,
    borderColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
  // Menu Screen Styles
  menuCategory: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuCategoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  modernMenuItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 10,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeChip: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  spicyLevel: {
    fontSize: 16,
    marginRight: 8,
  },
  dietaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryTag: {
    backgroundColor: '#28a745',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginTop: 2,
  },
  dietaryTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  // Favorites Screen Styles
  favoritesSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modernFavoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    padding: 15,
  },
  favoriteImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  favoriteImage: {
    fontSize: 24,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 18,
    marginBottom: 8,
  },
  favoriteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addedDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  restaurantInfo: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  emptyFavorites: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Profile Screen Styles
  profileHeader: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  joinedDate: {
    fontSize: 14,
    color: '#868e96',
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  settingArrow: {
    fontSize: 20,
    color: '#6c757d',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
});

// Dark theme styles (similar structure with dark colors)
const darkStyles = StyleSheet.create({
  // Copy all light styles and modify colors for dark theme
  ...lightStyles,
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modernHeader: {
    backgroundColor: '#1e1e1e',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
  },
  categoryChip: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#adb5bd',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultCount: {
    fontSize: 14,
    color: '#adb5bd',
  },
  modernRestaurantCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    height: 120,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modernRestaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '500',
  },
  modernRestaurantDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 12,
    color: '#adb5bd',
  },
  distanceContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  openTime: {
    fontSize: 12,
    color: '#adb5bd',
  },
  cuisineTag: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  cuisineTagText: {
    fontSize: 10,
    color: '#adb5bd',
    fontWeight: '500',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  restaurantDetailCard: {
    backgroundColor: '#1e1e1e',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  restaurantDetailDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 20,
    marginBottom: 8,
  },
  restaurantDetailAddress: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 4,
  },
  restaurantDetailPhone: {
    fontSize: 14,
    color: '#adb5bd',
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
  },
  guestButton: {
    borderWidth: 1,
    borderColor: '#adb5bd',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#adb5bd',
    fontSize: 16,
    fontWeight: '500',
  },
  // Menu Screen Styles
  menuCategory: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuCategoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  modernMenuItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 20,
    marginBottom: 10,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeChip: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  spicyLevel: {
    fontSize: 16,
    marginRight: 8,
  },
  dietaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryTag: {
    backgroundColor: '#28a745',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginTop: 2,
  },
  dietaryTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  // Favorites Screen Styles
  favoritesSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modernFavoriteCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    padding: 15,
  },
  favoriteImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  favoriteImage: {
    fontSize: 24,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 18,
    marginBottom: 8,
  },
  favoriteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addedDate: {
    fontSize: 12,
    color: '#adb5bd',
  },
  restaurantInfo: {
    fontSize: 12,
    color: '#adb5bd',
    marginBottom: 4,
  },
  emptyFavorites: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Profile Screen Styles
  profileHeader: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 30,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#adb5bd',
    marginBottom: 8,
  },
  joinedDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  statsSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
  },
  settingsSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#adb5bd',
  },
  settingArrow: {
    fontSize: 20,
    color: '#adb5bd',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
});