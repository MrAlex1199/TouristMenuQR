import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { demoRestaurants, demoMenus, getPopularItems } from '../data/demoData';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'auth_token';
const USE_DEMO_DATA = process.env.EXPO_PUBLIC_USE_DEMO_DATA === 'true' || true; // Enable demo data by default

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.api.interceptors.request.use(
      async (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        
        // Add auth token if available
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
      },
      async (error) => {
        console.error('API Response Error:', error.response?.status, error.message);
        
        // Handle unauthorized - clear token
        if (error.response?.status === 401) {
          await this.clearAuthToken();
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth token management
  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async setAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  // Helper method to handle demo data fallback
  private async apiCallWithFallback<T>(
    apiCall: () => Promise<T>,
    fallbackData: T
  ): Promise<T> {
    if (USE_DEMO_DATA) {
      console.log('Using demo data');
      return fallbackData;
    }

    try {
      return await apiCall();
    } catch (error) {
      console.warn('API call failed, using demo data:', error);
      return fallbackData;
    }
  }

  // Auth API
  async register(data: RegisterData) {
    const response = await this.api.post('/auth/register', data);
    if (response.data.token) {
      await this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async login(data: LoginData) {
    const response = await this.api.post('/auth/login', data);
    if (response.data.token) {
      await this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async logout() {
    await this.clearAuthToken();
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async changePassword(data: ChangePasswordData) {
    const response = await this.api.post('/auth/change-password', data);
    return response.data;
  }

  // Restaurant API
  async getRestaurants(page = 1, limit = 10) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/restaurants?page=${page}&limit=${limit}`);
        return response.data;
      },
      { restaurants: demoRestaurants, total: demoRestaurants.length }
    );
  }

  async getRestaurant(id: string) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/restaurants/${id}`);
        return response.data;
      },
      demoRestaurants.find(r => r._id === id) || demoRestaurants[0]
    );
  }

  async getNearbyRestaurants(lat: number, lng: number, maxDistance = 5000) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`);
        return response.data;
      },
      demoRestaurants
    );
  }

  async getMyRestaurants() {
    const response = await this.api.get('/restaurants/my-restaurants');
    return response.data;
  }

  async createRestaurant(data: CreateRestaurantData) {
    const response = await this.api.post('/restaurants', data);
    return response.data;
  }

  async updateRestaurant(id: string, data: UpdateRestaurantData) {
    const response = await this.api.patch(`/restaurants/${id}`, data);
    return response.data;
  }

  async deleteRestaurant(id: string) {
    const response = await this.api.delete(`/restaurants/${id}`);
    return response.data;
  }

  async regenerateQRCode(id: string) {
    const response = await this.api.post(`/restaurants/${id}/regenerate-qr`);
    return response.data;
  }

  // Menu API
  async getMenus(page = 1, limit = 10) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/menus?page=${page}&limit=${limit}`);
        return response.data;
      },
      { menus: demoMenus, total: demoMenus.length }
    );
  }

  async getMenusByRestaurant(restaurantId: string) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/menus/restaurant/${restaurantId}`);
        return response.data;
      },
      demoMenus.filter(m => m.restaurant === restaurantId)
    );
  }

  async getMenu(id: string) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/menus/${id}`);
        return response.data;
      },
      demoMenus.find(m => m._id === id) || demoMenus[0]
    );
  }

  async createMenu(data: CreateMenuData) {
    const response = await this.api.post('/menus', data);
    return response.data;
  }

  async updateMenu(id: string, data: UpdateMenuData) {
    const response = await this.api.patch(`/menus/${id}`, data);
    return response.data;
  }

  async deleteMenu(id: string) {
    const response = await this.api.delete(`/menus/${id}`);
    return response.data;
  }

  async searchMenuItems(
    restaurantId: string,
    query?: string,
    category?: string,
    dietary?: string[],
    maxPrice?: number,
    minPrice?: number
  ) {
    return this.apiCallWithFallback(
      async () => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);
        if (dietary?.length) params.append('dietary', dietary.join(','));
        if (maxPrice) params.append('maxPrice', maxPrice.toString());
        if (minPrice) params.append('minPrice', minPrice.toString());

        const response = await this.api.get(`/menus/search/${restaurantId}?${params.toString()}`);
        return response.data;
      },
      this.searchDemoMenuItems(restaurantId, query, category, dietary, maxPrice, minPrice)
    );
  }

  async getPopularItems(restaurantId: string, limit = 10) {
    return this.apiCallWithFallback(
      async () => {
        const response = await this.api.get(`/menus/popular/${restaurantId}?limit=${limit}`);
        return response.data;
      },
      getPopularItems(restaurantId).slice(0, limit)
    );
  }

  // Demo search implementation
  private searchDemoMenuItems(
    restaurantId: string,
    query?: string,
    category?: string,
    dietary?: string[],
    maxPrice?: number,
    minPrice?: number
  ) {
    const menu = demoMenus.find(m => m.restaurant === restaurantId);
    if (!menu) return [];

    const results = [];

    for (const menuCategory of menu.categories) {
      if (!menuCategory.isActive) continue;
      
      // Filter by category if specified
      if (category && menuCategory.name.toLowerCase() !== category.toLowerCase()) {
        continue;
      }

      for (const item of menuCategory.items) {
        if (!item.isAvailable) continue;

        // Text search
        const matchesQuery = !query || 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase());

        // Price filter
        const matchesPrice = (!minPrice || item.price >= minPrice) &&
                            (!maxPrice || item.price <= maxPrice);

        // Dietary filter
        const matchesDietary = !dietary || 
          dietary.some(diet => item.dietaryInfo?.includes(diet));

        if (matchesQuery && matchesPrice && matchesDietary) {
          results.push({
            menuId: menu._id,
            menuName: menu.name,
            categoryId: menuCategory._id,
            categoryName: menuCategory.name,
            item: item,
          });
        }
      }
    }

    return results;
  }

  async addCategory(menuId: string, data: CreateCategoryData) {
    const response = await this.api.post(`/menus/${menuId}/categories`, data);
    return response.data;
  }

  async updateCategory(menuId: string, categoryId: string, data: UpdateCategoryData) {
    const response = await this.api.patch(`/menus/${menuId}/categories/${categoryId}`, data);
    return response.data;
  }

  async deleteCategory(menuId: string, categoryId: string) {
    const response = await this.api.delete(`/menus/${menuId}/categories/${categoryId}`);
    return response.data;
  }

  async addMenuItem(menuId: string, data: AddMenuItemData) {
    const response = await this.api.post(`/menus/${menuId}/items`, data);
    return response.data;
  }

  async updateMenuItem(menuId: string, data: UpdateMenuItemData) {
    const response = await this.api.patch(`/menus/${menuId}/items`, data);
    return response.data;
  }

  async deleteMenuItem(menuId: string, categoryId: string, itemId: string) {
    const response = await this.api.delete(`/menus/${menuId}/categories/${categoryId}/items/${itemId}`);
    return response.data;
  }

  // Legacy methods for backward compatibility
  async getHealth() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getHello() {
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Types
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'customer' | 'restaurant_owner';
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateRestaurantData {
  name: string;
  description: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  images?: string[];
  logo?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  openingHours?: any;
  cuisineTypes?: string[];
}

export interface UpdateRestaurantData extends Partial<CreateRestaurantData> {}

export interface CreateMenuData {
  restaurant: string;
  name: string;
  description?: string;
  categories?: CreateCategoryData[];
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string;
  availableLanguages?: string[];
  currency?: string;
}

export interface UpdateMenuData extends Partial<Omit<CreateMenuData, 'restaurant'>> {}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
  items?: CreateMenuItemData[];
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateMenuItemData {
  name: string;
  description: string;
  price: number;
  image?: string;
  allergens?: string[];
  dietaryInfo?: string[];
  isAvailable?: boolean;
  preparationTime?: number;
  spicyLevel?: number;
  calories?: number;
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {}

export interface AddMenuItemData {
  categoryId: string;
  item: CreateMenuItemData;
}

export interface UpdateMenuItemData {
  categoryId: string;
  itemId: string;
  item: UpdateMenuItemData;
}

export const apiService = new ApiService();
