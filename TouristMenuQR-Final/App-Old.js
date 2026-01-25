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
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Thai', 'Italian', 'Japanese', 'American', 'Asian'];
  const filters = ['Open Now', 'Free Delivery', 'Promotions', 'Top Rated'];

  const renderSpicyLevel = (level) => {
    return '🌶️'.repeat(level);
  };

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('❌ Error', 'Please fill in all fields');
      return;
    }

    // Simulate login
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

    // Simulate registration
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
    
    // Simulate getting location
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
    
    // Simple distance calculation for demo
    const distances = ['0.8km', '1.2km', '2.1km', '3.5km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const renderHomeScreen = () => {
    const styles = getStyles();
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🍽️ TouristMenuQR</Text>
            <Text style={styles.subtitle}>
              {user ? `Welcome back, ${user.name}!` : 'Discover restaurants and menus with QR codes'}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.themeButton}
              onPress={toggleDarkMode}
            >
              <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            
            {user && (
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => setCurrentScreen('profile')}
              >
                <Text style={styles.profileIcon}>👤</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.favoritesButton}
              onPress={() => setCurrentScreen('favorites')}
            >
              <Text style={styles.favoritesIcon}>❤️</Text>
              {(favorites.restaurants.length > 0 || favorites.menuItems.length > 0) && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {favorites.restaurants.length + favorites.menuItems.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Enhanced QR Scanner</Text>
        <Text style={styles.cardDescription}>
          Point your camera at a restaurant's QR code to view their menu instantly
        </Text>
        <Text style={styles.features}>
          ✅ Flash control{'\n'}
          ✅ Multiple barcode formats{'\n'}
          ✅ Camera permissions{'\n'}
          ✅ Web link support{'\n'}
          ✅ Restaurant QR codes
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Alert.alert(
              '📷 QR Scanner Ready!',
              'Enhanced QR Scanner Features:\n\n✅ Flash control\n✅ Multiple barcode formats\n✅ Camera permissions\n✅ Web link support\n✅ Restaurant QR codes\n\nWould open camera in real app!',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.buttonText}>📷 Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.locationHeader}>
          <Text style={styles.cardTitle}>📍 Location Services</Text>
          {userLocation && (
            <View style={styles.locationChip}>
              <Text style={styles.chipText}>📍 Found</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDescription}>
          Get your current location to find restaurants near you
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={handleGetLocation}
          disabled={locationLoading}
        >
          <Text style={[styles.buttonText, styles.outlineButtonText]}>
            {locationLoading ? '🔄 Getting Location...' : userLocation ? '🔄 Update Location' : '📍 Get My Location'}
          </Text>
        </TouchableOpacity>
        
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
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {userLocation ? '🏪 Nearby Restaurants' : '🏪 Featured Restaurants'}
          </Text>
          {userLocation && (
            <View style={styles.locationChip}>
              <Text style={styles.chipText}>Within 5km</Text>
            </View>
          )}
        </View>
        
        {demoRestaurants.map((restaurant) => {
          const distance = userLocation ? calculateDistance(restaurant) : null;
          
          return (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => {
                setSelectedRestaurant(restaurant);
                setCurrentScreen('restaurant');
              }}
            >
              <View style={styles.restaurantHeader}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantDescription} numberOfLines={2}>
                    {restaurant.description}
                  </Text>
                  <Text style={styles.address}>{restaurant.address}</Text>
                </View>
                
                {distance && (
                  <View style={styles.distanceChip}>
                    <Text style={styles.chipText}>{distance}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.restaurantMeta}>
                <View style={styles.ratingChip}>
                  <Text style={styles.chipText}>⭐ {restaurant.rating.toFixed(1)}</Text>
                </View>
                
                <View style={styles.cuisineTypes}>
                  {restaurant.cuisineTypes.slice(0, 2).map((cuisine, index) => (
                    <View key={index} style={styles.cuisineChip}>
                      <Text style={styles.chipText}>{cuisine}</Text>
                    </View>
                  ))}
                  {restaurant.cuisineTypes.length > 2 && (
                    <Text style={styles.moreText}>
                      +{restaurant.cuisineTypes.length - 2} more
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            '📷 QR Scanner Ready!',
            'Enhanced QR Scanner with:\n\n✅ Flash control\n✅ Multiple barcode formats\n✅ Camera permissions\n✅ Web link support\n✅ Restaurant QR codes\n\nWould open camera in real app!'
          );
        }}
      >
        <Text style={styles.fabText}>📷</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

  const renderRestaurantScreen = () => {
    const styles = getStyles();
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedRestaurant?.name}</Text>
          
          <TouchableOpacity
            style={styles.favoritesButton}
            onPress={() => handleAddToFavorites('restaurant', selectedRestaurant)}
          >
            <Text style={styles.favoritesIcon}>❤️</Text>
          </TouchableOpacity>
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
  };

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

  const renderProfileScreen = () => {
    const styles = getStyles();
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>👤 Profile</Text>
        </View>

        <View style={styles.profileContainer}>
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

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>👋 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderMenuScreen = () => {
    const styles = getStyles();
    
    return (
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
    );
  };

  const renderFavoritesScreen = () => {
    const styles = getStyles();
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>❤️ Favorites</Text>
        </View>

        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>
            🏪 Favorite Restaurants ({favorites.restaurants.length})
          </Text>
          {favorites.restaurants.length > 0 ? (
            favorites.restaurants.map((restaurant, index) => (
              <View key={index} style={styles.favoriteCard}>
                <Text style={styles.favoriteTitle}>{restaurant.name}</Text>
                <Text style={styles.favoriteDescription}>{restaurant.description}</Text>
                <Text style={styles.addedDate}>
                  Added {new Date(restaurant.addedAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite restaurants yet</Text>
          )}
        </View>

        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>
            🍽️ Favorite Menu Items ({favorites.menuItems.length})
          </Text>
          {favorites.menuItems.length > 0 ? (
            favorites.menuItems.map((item, index) => (
              <View key={index} style={styles.favoriteCard}>
                <Text style={styles.favoriteTitle}>{item.name}</Text>
                <Text style={styles.favoriteDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>฿{item.price}</Text>
                <Text style={styles.restaurantInfo}>
                  From {item.restaurant?.name} • {item.category?.name}
                </Text>
                <Text style={styles.addedDate}>
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite menu items yet</Text>
          )}
        </View>

        {favorites.restaurants.length === 0 && favorites.menuItems.length === 0 && (
          <View style={styles.emptyFavorites}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyDescription}>
              Start exploring restaurants and add them to your favorites!
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={getStyles().safeArea}>
      {!user && (currentScreen === 'auth' || currentScreen === 'home') && renderAuthScreen()}
      {user && currentScreen === 'home' && renderHomeScreen()}
      {user && currentScreen === 'restaurant' && renderRestaurantScreen()}
      {user && currentScreen === 'menu' && renderMenuScreen()}
      {currentScreen === 'favorites' && renderFavoritesScreen()}
      {user && currentScreen === 'profile' && renderProfileScreen()}
    </SafeAreaView>
  );
}

const lightStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  themeButton: {
    padding: 8,
    marginRight: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
  profileButton: {
    padding: 8,
    marginRight: 8,
  },
  profileIcon: {
    fontSize: 24,
  },
  favoritesButton: {
    position: 'relative',
    padding: 8,
  },
  favoritesIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#dc3545',
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
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 15,
  },
  features: {
    fontSize: 14,
    color: '#28a745',
    lineHeight: 22,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  outlineButtonText: {
    color: '#007bff',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationChip: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  locationInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 4,
  },
  section: {
    margin: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 18,
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: '#868e96',
  },
  distanceChip: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingChip: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  cuisineTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  cuisineChip: {
    backgroundColor: '#6f42c1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffc107',
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#6c757d',
  },
  menuButton: {
    backgroundColor: '#28a745',
    margin: 15,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuCategory: {
    margin: 15,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 10,
  },
  itemMeta: {
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
  favoritesSection: {
    margin: 15,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  addedDate: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyFavorites: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Auth Screen Styles
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
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  authButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
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
    borderRadius: 8,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
  // Profile Screen Styles
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
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
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
    borderRadius: 8,
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
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const darkStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 2,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  themeButton: {
    padding: 8,
    marginRight: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
  profileButton: {
    padding: 8,
    marginRight: 8,
  },
  profileIcon: {
    fontSize: 24,
  },
  favoritesButton: {
    position: 'relative',
    padding: 8,
  },
  favoritesIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#dc3545',
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
  card: {
    backgroundColor: '#1e1e1e',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 20,
    marginBottom: 15,
  },
  features: {
    fontSize: 14,
    color: '#28a745',
    lineHeight: 22,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  outlineButtonText: {
    color: '#007bff',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationChip: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  locationInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 11,
    color: '#adb5bd',
    marginTop: 4,
  },
  section: {
    margin: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  restaurantCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 18,
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: '#6c757d',
  },
  distanceChip: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingChip: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  cuisineTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  cuisineChip: {
    backgroundColor: '#6f42c1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#adb5bd',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 4,
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffc107',
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#adb5bd',
  },
  menuButton: {
    backgroundColor: '#28a745',
    margin: 15,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuCategory: {
    margin: 15,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  menuItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  itemDescription: {
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 20,
    marginBottom: 10,
  },
  itemMeta: {
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
  favoritesSection: {
    margin: 15,
  },
  favoriteCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  addedDate: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#adb5bd',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyFavorites: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Auth Screen Styles
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
    color: '#ffffff',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
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
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
  },
  authButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
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
    borderColor: '#adb5bd',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#adb5bd',
    fontSize: 16,
    fontWeight: '500',
  },
  // Profile Screen Styles
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
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
  settingsSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
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
  statsSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
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
    borderRadius: 8,
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
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});