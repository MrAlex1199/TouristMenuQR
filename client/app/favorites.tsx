import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  Button,
  ActivityIndicator,
  Appbar,
  Surface,
  IconButton,
} from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { favoritesService, FavoriteRestaurant, FavoriteMenuItem } from '../src/services/favoritesService';

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'restaurants' | 'menuItems'>('restaurants');
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<FavoriteRestaurant[]>([]);
  const [favoriteMenuItems, setFavoriteMenuItems] = useState<FavoriteMenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const [restaurants, menuItems] = await Promise.all([
        favoritesService.getFavoriteRestaurants(),
        favoritesService.getFavoriteMenuItems(),
      ]);
      setFavoriteRestaurants(restaurants);
      setFavoriteMenuItems(menuItems);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveRestaurant = async (restaurantId: string) => {
    try {
      await favoritesService.removeFavoriteRestaurant(restaurantId);
      setFavoriteRestaurants(prev => prev.filter(fav => fav.restaurant._id !== restaurantId));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from favorites');
    }
  };

  const handleRemoveMenuItem = async (itemId: string) => {
    try {
      await favoritesService.removeFavoriteMenuItem(itemId);
      setFavoriteMenuItems(prev => prev.filter(fav => fav.item._id !== itemId));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from favorites');
    }
  };

  const handleClearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesService.clearAllFavorites();
              setFavoriteRestaurants([]);
              setFavoriteMenuItems([]);
              Alert.alert('Success', 'All favorites cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  const filteredRestaurants = favoriteRestaurants.filter(fav =>
    !searchQuery ||
    fav.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMenuItems = favoriteMenuItems.filter(fav =>
    !searchQuery ||
    fav.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRestaurantCard = (favorite: FavoriteRestaurant) => (
    <Card key={favorite.restaurant._id} style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Title style={styles.cardTitle}>{favorite.restaurant.name}</Title>
            <Paragraph numberOfLines={2}>{favorite.restaurant.description}</Paragraph>
            <Text style={styles.address}>{favorite.restaurant.address}</Text>
            
            {favorite.restaurant.cuisineTypes && (
              <View style={styles.cuisineTypes}>
                {favorite.restaurant.cuisineTypes.map((cuisine, index) => (
                  <Chip key={index} compact style={styles.cuisineChip}>
                    {cuisine}
                  </Chip>
                ))}
              </View>
            )}
            
            <Text style={styles.addedDate}>
              Added {new Date(favorite.addedAt).toLocaleDateString()}
            </Text>
          </View>
          
          <IconButton
            icon="heart"
            iconColor="#F44336"
            size={24}
            onPress={() => handleRemoveRestaurant(favorite.restaurant._id)}
          />
        </View>
        
        <View style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => router.push(`/restaurant/${favorite.restaurant._id}`)}
            style={styles.actionButton}
          >
            View Restaurant
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderMenuItemCard = (favorite: FavoriteMenuItem) => (
    <Card key={favorite.item._id} style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Title style={styles.cardTitle}>{favorite.item.name}</Title>
            <Paragraph numberOfLines={2}>{favorite.item.description}</Paragraph>
            
            <View style={styles.itemMeta}>
              <Text style={styles.price}>฿{favorite.item.price.toFixed(2)}</Text>
              {favorite.item.preparationTime && (
                <Chip icon="clock-outline" compact style={styles.metaChip}>
                  {favorite.item.preparationTime} min
                </Chip>
              )}
              {favorite.item.spicyLevel && favorite.item.spicyLevel > 0 && (
                <Chip compact style={styles.metaChip}>
                  {'🌶️'.repeat(favorite.item.spicyLevel)}
                </Chip>
              )}
            </View>
            
            <Text style={styles.restaurantInfo}>
              From {favorite.restaurant.name} • {favorite.category.name}
            </Text>
            
            {favorite.item.dietaryInfo && favorite.item.dietaryInfo.length > 0 && (
              <View style={styles.dietaryInfo}>
                {favorite.item.dietaryInfo.map((diet, index) => (
                  <Chip key={index} compact style={styles.dietaryChip}>
                    {diet}
                  </Chip>
                ))}
              </View>
            )}
            
            <Text style={styles.addedDate}>
              Added {new Date(favorite.addedAt).toLocaleDateString()}
            </Text>
          </View>
          
          <IconButton
            icon="heart"
            iconColor="#F44336"
            size={24}
            onPress={() => handleRemoveMenuItem(favorite.item._id)}
          />
        </View>
        
        <View style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => router.push(`/restaurant/${favorite.restaurant.id}`)}
            style={styles.actionButton}
          >
            View Restaurant
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <Surface style={styles.emptyState}>
      <Text style={styles.emptyIcon}>
        {activeTab === 'restaurants' ? '🏪' : '🍽️'}
      </Text>
      <Title style={styles.emptyTitle}>
        No {activeTab === 'restaurants' ? 'Restaurant' : 'Menu Item'} Favorites
      </Title>
      <Paragraph style={styles.emptyText}>
        {activeTab === 'restaurants'
          ? 'Start exploring restaurants and add them to your favorites!'
          : 'Browse menus and save your favorite dishes!'}
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => router.push('/')}
        style={styles.exploreButton}
      >
        Explore Restaurants
      </Button>
    </Surface>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  const hasRestaurants = favoriteRestaurants.length > 0;
  const hasMenuItems = favoriteMenuItems.length > 0;
  const hasFavorites = hasRestaurants || hasMenuItems;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Favorites" />
        {hasFavorites && (
          <Appbar.Action icon="delete-sweep" onPress={handleClearAllFavorites} />
        )}
      </Appbar.Header>

      {hasFavorites && (
        <View style={styles.searchSection}>
          <Searchbar
            placeholder={`Search ${activeTab === 'restaurants' ? 'restaurants' : 'menu items'}...`}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
            Restaurants ({favoriteRestaurants.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'menuItems' && styles.activeTab]}
          onPress={() => setActiveTab('menuItems')}
        >
          <Text style={[styles.tabText, activeTab === 'menuItems' && styles.activeTabText]}>
            Menu Items ({favoriteMenuItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'restaurants' ? (
          filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(renderRestaurantCard)
          ) : (
            renderEmptyState()
          )
        ) : (
          filteredMenuItems.length > 0 ? (
            filteredMenuItems.map(renderMenuItemCard)
          ) : (
            renderEmptyState()
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cuisineTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  cuisineChip: {
    marginRight: 6,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 12,
  },
  metaChip: {
    marginRight: 6,
  },
  restaurantInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dietaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dietaryChip: {
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#E8F5E8',
  },
  addedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    minWidth: 120,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  exploreButton: {
    minWidth: 160,
  },
});