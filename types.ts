export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number; // LKR
  category: string;
  description?: string;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  available: boolean; // New field for Stock Management
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  QR = 'QR'
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'KITCHEN' | 'READY' | 'COMPLETED';
  timestamp: number;
  paymentMethod?: PaymentMethod;
  // New fields for receipt
  cashierName?: string;
  amountTendered?: number;
  change?: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalTransactions: number;
  totalDiscounts: number;
}