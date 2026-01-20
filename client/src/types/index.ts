export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface QRCode {
  id: string;
  code: string;
  restaurantId: string;
  menuId: string;
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
