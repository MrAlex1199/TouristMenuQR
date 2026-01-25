import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Restaurant, Menu } from '../types';

const OFFLINE_RESTAURANTS_KEY = 'offline_restaurants';
const OFFLINE_MENUS_KEY = 'offline_menus';
const OFFLINE_SYNC_QUEUE_KEY = 'offline_sync_queue';

export interface OfflineAction {
  id: string;
  type: 'favorite_restaurant' | 'favorite_menu_item' | 'remove_favorite';
  data: any;
  timestamp: number;
}

class OfflineService {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;

  constructor() {
    this.initNetworkListener();
  }

  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came back online, sync pending actions
      if (wasOffline && this.isOnline) {
        this.syncPendingActions();
      }
    });
  }

  async isNetworkAvailable(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  // Cache restaurants for offline access
  async cacheRestaurants(restaurants: Restaurant[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_RESTAURANTS_KEY, JSON.stringify(restaurants));
    } catch (error) {
      console.error('Error caching restaurants:', error);
    }
  }

  async getCachedRestaurants(): Promise<Restaurant[]> {
    try {
      const cached = await AsyncStorage.getItem(OFFLINE_RESTAURANTS_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error getting cached restaurants:', error);
      return [];
    }
  }

  // Cache menus for offline access
  async cacheMenus(restaurantId: string, menus: Menu[]): Promise<void> {
    try {
      const key = `${OFFLINE_MENUS_KEY}_${restaurantId}`;
      await AsyncStorage.setItem(key, JSON.stringify(menus));
    } catch (error) {
      console.error('Error caching menus:', error);
    }
  }

  async getCachedMenus(restaurantId: string): Promise<Menu[]> {
    try {
      const key = `${OFFLINE_MENUS_KEY}_${restaurantId}`;
      const cached = await AsyncStorage.getItem(key);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error getting cached menus:', error);
      return [];
    }
  }
}
  // Queue actions for when we're back online
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const newAction: OfflineAction = {
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      queue.push(newAction);
      await AsyncStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error queuing action:', error);
    }
  }

  private async getSyncQueue(): Promise<OfflineAction[]> {
    try {
      const queue = await AsyncStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  }

  async syncPendingActions(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    try {
      this.syncInProgress = true;
      const queue = await this.getSyncQueue();
      
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} pending actions...`);
      
      // Process each action
      for (const action of queue) {
        try {
          await this.processAction(action);
        } catch (error) {
          console.error('Error processing action:', action, error);
          // Keep failed actions in queue for retry
          continue;
        }
      }

      // Clear successfully processed actions
      await AsyncStorage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
      console.log('Sync completed successfully');
      
    } catch (error) {
      console.error('Error syncing pending actions:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processAction(action: OfflineAction): Promise<void> {
    // Here you would implement the actual API calls
    // For now, we'll just log the actions
    console.log('Processing offline action:', action);
    
    switch (action.type) {
      case 'favorite_restaurant':
        // await apiService.addFavoriteRestaurant(action.data);
        break;
      case 'favorite_menu_item':
        // await apiService.addFavoriteMenuItem(action.data);
        break;
      case 'remove_favorite':
        // await apiService.removeFavorite(action.data);
        break;
    }
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const offlineKeys = keys.filter(key => 
        key.startsWith(OFFLINE_RESTAURANTS_KEY) ||
        key.startsWith(OFFLINE_MENUS_KEY) ||
        key === OFFLINE_SYNC_QUEUE_KEY
      );
      
      if (offlineKeys.length > 0) {
        await AsyncStorage.multiRemove(offlineKeys);
      }
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }

  // Get offline storage info
  async getOfflineStorageInfo(): Promise<{
    restaurantsCount: number;
    menusCount: number;
    pendingActionsCount: number;
  }> {
    try {
      const [restaurants, queue] = await Promise.all([
        this.getCachedRestaurants(),
        this.getSyncQueue(),
      ]);

      // Count cached menus
      const keys = await AsyncStorage.getAllKeys();
      const menuKeys = keys.filter(key => key.startsWith(OFFLINE_MENUS_KEY));

      return {
        restaurantsCount: restaurants.length,
        menusCount: menuKeys.length,
        pendingActionsCount: queue.length,
      };
    } catch (error) {
      console.error('Error getting offline storage info:', error);
      return {
        restaurantsCount: 0,
        menusCount: 0,
        pendingActionsCount: 0,
      };
    }
  }
}

export const offlineService = new OfflineService();