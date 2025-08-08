// Core Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'server' | 'kitchen' | 'employee' | 'master';
  businessName?: string;
  firstName?: string;
  lastName?: string;
  businessCode?: string;
  shift?: 'morning' | 'afternoon' | 'evening' | 'night';
  department?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: 'Food' | 'Bar' | 'Drinks';
  ingredients: string[];
  preparationTime: number;
  alcoholContent?: number;
  calories?: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isPopular: boolean;
  isSignature: boolean;
  imageUrl?: string;
  allergens: string[];
  available: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  barcode?: string;
  supplier: string;
  location: string;
  hasExpiration: boolean;
  expirationDate?: Date;
  lastUpdated: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  customerName?: string;
  tableNumber?: number;
  orderType: 'dine_in' | 'takeout' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  paymentMethod: string;
  employeeId: string;
  timestamp: Date;
  notes?: string;
  kitchenNotes?: string;
  allergyNotes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
  modifications: string[];
  notes?: string;
}

export interface PaymentCard {
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  holderName: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentMethod: string;
  timestamp: string;
  processingTime: number;
  errorMessage?: string;
  transactionId?: string;
}

export interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  stats?: string;
  action?: () => void;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'expiring' | 'expired' | 'overstock';
  itemId: string;
  itemName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  resolved: boolean;
}

export interface MenuStats {
  totalItems: number;
  activeItems: number;
  averagePrice: number;
  topCategories: { category: string; count: number }[];
  popularItems: MenuItem[];
}

export interface SecurityEvent {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  resolved: boolean;
}

export interface Client {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessCode: string;
  subscriptionPlan: string;
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  employees: number;
  monthlyRevenue: number;
  lastLogin: Date;
}

export interface BankingInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
}

export interface RevenueStats {
  monthlyRevenue: number;
  annualRevenue: number;
  totalClients: number;
  activeClients: number;
}

export interface BackupInfo {
  lastBackup: Date;
  backupSize: string;
  location: string;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface SystemAnalytics {
  totalClients: number;
  activeSubscriptions: number;
  totalEmployees: number;
  systemUptime: string;
  securityIncidents: number;
  averageResponseTime: string;
}

// Screen Types
export type Screen = 'login' | 'dashboard' | 'masterAdmin' | 'freeTrial' | 'support' | 'plans' | 'onboarding' | 'clientManagement' | 'banking' | 'security' | 'appUpdates' | 'cloudBackup' | 'pos' | 'kitchen' | 'bar' | 'inventory' | 'customerMenu' | 'menu' | 'reports' | 'payment' | 'receipt' | 'orderSuccess' | 'menuManagement' | 'staff' | 'schedule';

// Theme Types
export interface Theme {
  bg: string;
  surface: string;
  primary: string;
  text: string;
  accent: string;
}

export type ThemeKey = 'dark' | 'light' | 'blue' | 'green';