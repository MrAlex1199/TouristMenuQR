import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant, MenuItem } from '../types';

const FAVORITES_KEY = 'favorites';
const FAVORITE_RESTAURANTS_KEY = 'favorite_restaurants';
const FAVORITE_MENU_ITEMS_KEY = 'favorite_menu_items';

export interface FavoriteRestaurant {
  restaurant: Restaurant;
  addedAt: string;
}

export interface FavoriteMenuItem {
  item: MenuItem;
  restaurant: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  addedAt: string;
}

class FavoritesService {
  // Restaurant Favorites
  async getFavoriteRestaurants(): Promise<FavoriteRestaurant[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITE_RESTAURANTS_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorite restaurants:', error);
      return [];
    }
  }

  async addFavoriteRestaurant(restaurant: Restaurant): Promise<void> {
    try {
      const favorites = await this.getFavoriteRestaurants();
      const exists = favorites.find(fav => fav.restaurant._id === restaurant._id);
      
      if (!exists) {
        const newFavorite: FavoriteRestaurant = {
          restaurant,
          addedAt: new Date().toISOString(),
        };
        favorites.push(newFavorite);
        await AsyncStorage.setItem(FAVORITE_RESTAURANTS_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite restaurant:', error);
      throw error;
    }
  }

  async removeFavoriteRestaurant(restaurantId: string): Promise<void> {
    try {
      const favorites = await this.getFavoriteRestaurants();
      const filtered = favorites.filter(fav => fav.restaurant._id !== restaurantId);
      await AsyncStorage.setItem(FAVORITE_RESTAURANTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite restaurant:', error);
      throw error;
    }
  }

  async isRestaurantFavorite(restaurantId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavoriteRestaurants();
      return favorites.some(fav => fav.restaurant._id === restaurantId);
    } catch (error) {
      console.error('Error checking restaurant favorite:', error);
      return false;
    }
  }

  // Menu Item Favorites
  async getFavoriteMenuItems(): Promise<FavoriteMenuItem[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITE_MENU_ITEMS_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorite menu items:', error);
      return [];
    }
  }

  async addFavoriteMenuItem(
    item: MenuItem,
    restaurant: { id: string; name: string },
    category: { id: string; name: string }
  ): Promise<void> {
    try {
      const favorites = await this.getFavoriteMenuItems();
      const exists = favorites.find(fav => fav.item._id === item._id);
      
      if (!exists) {
        const newFavorite: FavoriteMenuItem = {
          item,
          restaurant,
          category,
          addedAt: new Date().toISOString(),
        };
        favorites.push(newFavorite);
        await AsyncStorage.setItem(FAVORITE_MENU_ITEMS_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite menu item:', error);
      throw error;
    }
  }

  async removeFavoriteMenuItem(itemId: string): Promise<void> {
    try {
      const favorites = await this.getFavoriteMenuItems();
      const filtered = favorites.filter(fav => fav.item._id !== itemId);
      await AsyncStorage.setItem(FAVORITE_MENU_ITEMS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite menu item:', error);
      throw error;
    }
  }

  async isMenuItemFavorite(itemId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavoriteMenuItems();
      return favorites.some(fav => fav.item._id === itemId);
    } catch (error) {
      console.error('Error checking menu item favorite:', error);
      return false;
    }
  }

  // Clear all favorites
  async clearAllFavorites(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([FAVORITE_RESTAURANTS_KEY, FAVORITE_MENU_ITEMS_KEY]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }

  // Get favorites count
  async getFavoritesCount(): Promise<{ restaurants: number; menuItems: number }> {
    try {
      const [restaurants, menuItems] = await Promise.all([
        this.getFavoriteRestaurants(),
        this.getFavoriteMenuItems(),
      ]);
      
      return {
        restaurants: restaurants.length,
        menuItems: menuItems.length,
      };
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return { restaurants: 0, menuItems: 0 };
    }
  }

  // Search favorites
  async searchFavoriteRestaurants(query: string): Promise<FavoriteRestaurant[]> {
    try {
      const favorites = await this.getFavoriteRestaurants();
      if (!query.trim()) return favorites;
      
      const lowercaseQuery = query.toLowerCase();
      return favorites.filter(fav => 
        fav.restaurant.name.toLowerCase().includes(lowercaseQuery) ||
        fav.restaurant.description.toLowerCase().includes(lowercaseQuery) ||
        fav.restaurant.cuisineTypes?.some(cuisine => 
          cuisine.toLowerCase().includes(lowercaseQuery)
        )
      );
    } catch (error) {
      console.error('Error searching favorite restaurants:', error);
      return [];
    }
  }

  async searchFavoriteMenuItems(query: string): Promise<FavoriteMenuItem[]> {
    try {
      const favorites = await this.getFavoriteMenuItems();
      if (!query.trim()) return favorites;
      
      const lowercaseQuery = query.toLowerCase();
      return favorites.filter(fav => 
        fav.item.name.toLowerCase().includes(lowercaseQuery) ||
        fav.item.description.toLowerCase().includes(lowercaseQuery) ||
        fav.restaurant.name.toLowerCase().includes(lowercaseQuery) ||
        fav.category.name.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching favorite menu items:', error);
      return [];
    }
  }
}

export const favoritesService = new FavoritesService();