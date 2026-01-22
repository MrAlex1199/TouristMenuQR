// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'restaurant_owner' | 'customer';
  isActive: boolean;
  phoneNumber?: string;
  profileImage?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Restaurant types
export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  owner: string | User;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  images?: string[];
  logo?: string;
  qrCode: string;
  isActive: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  openingHours?: WeeklyHours;
  cuisineTypes?: string[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

// Menu types
export interface Menu {
  _id: string;
  restaurant: string | Restaurant;
  name: string;
  description?: string;
  categories: MenuCategory[];
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  availableLanguages?: string[];
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  allergens?: string[];
  dietaryInfo?: string[];
  isAvailable: boolean;
  preparationTime?: number;
  spicyLevel?: number;
  calories?: number;
  orderCount?: number;
}

// Legacy types for backward compatibility
export interface QRCode {
  id: string;
  code: string;
  restaurantId: string;
  menuId: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface AuthResponse {
  user: User;
  token: string;
}

// Navigation types
export interface RootStackParamList {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  RestaurantDetail: { restaurantId: string };
  QRScanner: undefined;
  MenuView: { restaurantId: string };
  RestaurantList: undefined;
  MyRestaurants: undefined;
  CreateRestaurant: undefined;
  EditRestaurant: { restaurantId: string };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'customer' | 'restaurant_owner';
}

export interface RestaurantForm {
  name: string;
  description: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  cuisineTypes?: string[];
  latitude: number;
  longitude: number;
}
