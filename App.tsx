import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import Logo from './src/components/Logo';
import MasterAdminService from './src/services/MasterAdminService';
import POSService from './src/services/POSService';
import EnhancedPOSService from './src/services/EnhancedPOSService';
import PaymentService, { PaymentCard, PaymentResponse } from './src/services/PaymentService';
import StaffService from './src/services/StaffService';
import DashboardService, { DashboardCard } from './src/services/DashboardService';
import AdvancedInventoryService, { InventoryItem, InventoryAlert } from './src/services/AdvancedInventoryService';
import MenuService, { MenuStats } from './src/services/MenuService';
import { MenuItem } from './src/data/menu';
import BarcodeScanner from './src/components/BarcodeScanner';

type Screen = 'login' | 'dashboard' | 'masterAdmin' | 'freeTrial' | 'support' | 'plans' | 'onboarding' | 'clientManagement' | 'banking' | 'security' | 'appUpdates' | 'cloudBackup' | 'pos' | 'kitchen' | 'bar' | 'inventory' | 'customerMenu' | 'menu' | 'reports' | 'payment' | 'receipt' | 'orderSuccess' | 'menuManagement' | 'staff' | 'schedule';

interface User {
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('light');

  // Dashboard Customization state
  const [isEditMode, setIsEditMode] = useState(false);
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([]);
  const [editingCard, setEditingCard] = useState<DashboardCard | null>(null);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Advanced Inventory state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low_stock' | 'expiring' | 'expired'>('all');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  
  // Add Stock Modal state
  const [addStockItem, setAddStockItem] = useState<InventoryItem | null>(null);
  const [addStockQuantity, setAddStockQuantity] = useState('');
  const [addStockCost, setAddStockCost] = useState('');
  const [addStockExpiration, setAddStockExpiration] = useState('');
  const [addStockBatch, setAddStockBatch] = useState('');
  
  // Barcode Scanner state
  const [manualBarcode, setManualBarcode] = useState('');
  
  // Menu Management state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuStats, setMenuStats] = useState<MenuStats | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isNewMenuItem, setIsNewMenuItem] = useState(false);
  const [menuCategory, setMenuCategory] = useState<'Food' | 'Bar' | 'Drinks'>('Food');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  
  // Menu Item Form state
  const [menuItemName, setMenuItemName] = useState('');
  const [menuItemDescription, setMenuItemDescription] = useState('');
  const [menuItemPrice, setMenuItemPrice] = useState('');
  const [menuItemCost, setMenuItemCost] = useState('');
  const [menuItemIngredients, setMenuItemIngredients] = useState('');
  const [menuItemPreparationTime, setMenuItemPreparationTime] = useState('');
  const [menuItemAlcoholContent, setMenuItemAlcoholContent] = useState('');
  const [menuItemCalories, setMenuItemCalories] = useState('');
  const [menuItemIsVegetarian, setMenuItemIsVegetarian] = useState(false);
  const [menuItemIsVegan, setMenuItemIsVegan] = useState(false);
  const [menuItemIsPopular, setMenuItemIsPopular] = useState(false);
  const [menuItemIsSignature, setMenuItemIsSignature] = useState(false);
  const [menuItemImageUrl, setMenuItemImageUrl] = useState('');
  
  // Edit Inventory Item state
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemSku, setItemSku] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [itemCostPerUnit, setItemCostPerUnit] = useState('');
  const [itemMinStock, setItemMinStock] = useState('');
  const [itemMaxStock, setItemMaxStock] = useState('');
  const [itemBarcode, setItemBarcode] = useState('');
  const [itemSupplier, setItemSupplier] = useState('');
  const [itemHasExpiration, setItemHasExpiration] = useState(false);
  const [itemLocation, setItemLocation] = useState('');
  
  const [user, setUser] = useState<User | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [masterAdminService] = useState(() => MasterAdminService.getInstance());
  const [posService] = useState(() => EnhancedPOSService.getInstance());
  const [paymentService] = useState(() => PaymentService.getInstance());
  const [staffService] = useState(() => StaffService.getInstance());
  const [dashboardService] = useState(() => DashboardService.getInstance());
  const [advancedInventoryService] = useState(() => AdvancedInventoryService.getInstance());
  const [menuService] = useState(() => new MenuService());
  
  // POS State
  const [selectedCategory, setSelectedCategory] = useState<'drinks' | 'food' | 'appetizers' | 'desserts'>('drinks');
  const [cart, setCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'contactless' | 'mobile' | 'split'>('card');
  const [tip, setTip] = useState(0);
  
  // Order Notes State
  const [generalNotes, setGeneralNotes] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [allergyNotes, setAllergyNotes] = useState('');
  const [orderPriority, setOrderPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  
  // Order Routing State
  const [orderDestination, setOrderDestination] = useState<'kitchen' | 'bar' | 'auto'>('auto');

  // Customer menu state - moved to top level to avoid hooks violations
  const [customerMenuSearchQuery, setCustomerMenuSearchQuery] = useState('');
  const [customerSelectedMenuCategory, setCustomerSelectedMenuCategory] = useState<string>('All');
  const [customerSelectedMenuItem, setCustomerSelectedMenuItem] = useState<any>(null);
  const [customerShowItemModal, setCustomerShowItemModal] = useState(false);
  const [customerShowEditModal, setCustomerShowEditModal] = useState(false);
  const [customerEditingItem, setCustomerEditingItem] = useState<any>(null);
  const [customerItemNotes, setCustomerItemNotes] = useState<{[key: string]: string}>({});
  const [customerShowNotesModal, setCustomerShowNotesModal] = useState(false);
  const [customerCurrentItemId, setCustomerCurrentItemId] = useState<string>('');
  const [customerTempNotes, setCustomerTempNotes] = useState('');
  const [customerOrderNotes, setCustomerOrderNotes] = useState('');
  
  // Reports State
  const [selectedReportType, setSelectedReportType] = useState<'overview' | 'financial' | 'sales' | 'inventory' | 'menu' | 'staff' | 'customer' | 'compliance'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  
  // Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCard, setPaymentCard] = useState<PaymentCard>({
    number: '',
    expiryMonth: 1,
    expiryYear: new Date().getFullYear(),
    cvv: '',
    holderName: ''
  });
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const themes = {
    dark: { bg: '#1a1a1a', surface: '#2d2d2d', primary: '#8B0000', text: '#ffffff', accent: '#FFB6C1' },
    light: { bg: '#ffffff', surface: '#f8f9fa', primary: '#8B0000', text: '#000000', accent: '#dc3545' },
    blue: { bg: '#0d1929', surface: '#1e3a5f', primary: '#4285f4', text: '#ffffff', accent: '#64b5f6' },
    green: { bg: '#0f2027', surface: '#2c5530', primary: '#4caf50', text: '#ffffff', accent: '#81c784' },
  };

  const theme = themes[currentTheme];

  // Load dashboard cards on mount and subscribe to changes
  useEffect(() => {
    const loadCards = () => {
      setDashboardCards(dashboardService.getDashboardCards());
    };

    loadCards();
    const unsubscribe = dashboardService.subscribe(loadCards);
    return unsubscribe;
  }, [dashboardService]);

  // Load inventory data and alerts
  useEffect(() => {
    const loadInventoryData = () => {
      setInventoryItems(advancedInventoryService.getInventory());
      setInventoryAlerts(advancedInventoryService.getAlerts());
    };

    loadInventoryData();
    // Refresh inventory data every 30 seconds to catch alerts
    const interval = setInterval(loadInventoryData, 30000);
    return () => clearInterval(interval);
  }, [advancedInventoryService]);

  // Load menu data
  useEffect(() => {
    const loadMenuData = () => {
      setMenuItems(menuService.getMenu());
      setMenuStats(menuService.getMenuStats());
    };

    loadMenuData();
  }, [menuService]);

  // Initialize cart when accessing POS
  useEffect(() => {
    if (currentScreen === 'pos') {
      setCart(posService.getCart());
    }
  }, [currentScreen]);

  const completeOnboarding = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    // Demo users for different roles
    const demoUsers = {
      'admin@demo.com': {
        id: 'admin-001',
        email: 'admin@demo.com',
        role: 'admin' as const,
        firstName: 'Business',
        lastName: 'Owner',
        businessName: 'Demo Bar & Grill',
        department: 'Management'
      },
      'manager@demo.com': {
        id: 'manager-001',
        email: 'manager@demo.com',
        role: 'manager' as const,
        firstName: 'John',
        lastName: 'Manager',
        businessName: 'Demo Bar & Grill',
        department: 'Management',
        shift: 'afternoon' as const
      },
      'server@demo.com': {
        id: 'server-001',
        email: 'server@demo.com',
        role: 'server' as const,
        firstName: 'Sarah',
        lastName: 'Server',
        businessName: 'Demo Bar & Grill',
        department: 'Front of House',
        shift: 'evening' as const
      },
      'kitchen@demo.com': {
        id: 'kitchen-001',
        email: 'kitchen@demo.com',
        role: 'kitchen' as const,
        firstName: 'Mike',
        lastName: 'Chef',
        businessName: 'Demo Bar & Grill',
        department: 'Kitchen',
        shift: 'afternoon' as const
      },
      'employee@demo.com': {
        id: 'employee-001',
        email: 'employee@demo.com',
        role: 'employee' as const,
        firstName: 'Alex',
        lastName: 'Employee',
        businessName: 'Demo Bar & Grill',
        department: 'General',
        shift: 'morning' as const
      }
    };

    if (email === 'admin@barbackpro.com' && password === 'MasterAdmin2024!') {
      // Enhanced security logging for Master Admin access
      masterAdminService.addSecurityEvent({
        type: 'login_attempt',
        description: `Master Admin login successful from ${email}`,
        severity: 'high',
      });
      
      const masterUser: User = {
        id: 'master-001',
        email: email,
        role: 'master',
        firstName: 'Master',
        lastName: 'Admin'
      };
      setUser(masterUser);
      setCurrentScreen('masterAdmin');
      console.log('🔐 Master Admin Access Granted - All systems available');
    } else if (demoUsers[email as keyof typeof demoUsers] && password === 'demo123') {
      const userData = demoUsers[email as keyof typeof demoUsers];
      setUser(userData);
      setCurrentScreen('dashboard');
      console.log(`Login Successful - Welcome ${userData.firstName} (${userData.role})!`);
    } else if (email && password) {
      const regularUser: User = {
        id: 'user-001',
        email: email,
        role: 'admin',
        firstName: 'Business',
        lastName: 'Owner',
        businessName: 'Demo Bar & Grill'
      };
      setUser(regularUser);
      setCurrentScreen('dashboard');
      console.log(`Login Successful - Welcome ${email}!`);
    } else {
      // Log failed login attempts for security monitoring
      if (email && password) {
        masterAdminService.addSecurityEvent({
          type: 'login_attempt',
          description: `Failed login attempt for email: ${email}`,
          severity: 'medium',
        });
        console.log('🚨 Login Failed - Invalid credentials');
      } else {
        console.log('Login Failed - Please enter both email and password');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setCurrentScreen('login');
  };

  const cycleTheme = () => {
    const themeKeys = Object.keys(themes) as Array<keyof typeof themes>;
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setCurrentTheme(themeKeys[nextIndex]);
    console.log(`Theme changed to: ${themeKeys[nextIndex]}`);
  };

  // Main render function
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return renderOnboardingScreen();
      case 'login':
        return renderLoginScreen();
      case 'dashboard':
        return renderDashboard();
      case 'masterAdmin':
        return renderMasterAdmin();
      case 'freeTrial':
        return renderFreeTrial();
      case 'support':
        return renderSupport();
      case 'plans':
        return renderPlans();
      case 'clientManagement':
        return renderClientManagement();
      case 'banking':
        return renderBanking();
      case 'security':
        return renderSecurity();
      case 'cloudBackup':
        return renderCloudBackup();
      case 'pos':
        return renderPOSScreen();
      case 'kitchen':
        return renderKitchenDisplay();
      case 'bar':
        return renderBarDisplay();
      case 'inventory':
        return renderAdvancedInventory();
      case 'customerMenu':
        return renderCustomerMenu();
      case 'menu':
        return renderMenuManagement();
      case 'reports':
        return renderEnhancedReports();
      case 'payment':
        return renderPaymentScreen();
      case 'orderSuccess':
        return renderOrderSuccessScreen();
      case 'staff':
        return renderStaffManagement();
      case 'schedule':
        return renderScheduleManagement();
      default:
        return renderLoginScreen();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  // Add more styles as needed for the components
});