import { InventoryItem, InventoryAlert } from '../types';

interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface InventorySupplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
}

interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'restock' | 'sale' | 'waste' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  cost: number;
  timestamp: string;
  notes?: string;
  employeeId: string;
}

class AdvancedInventoryService {
  private static instance: AdvancedInventoryService;
  private inventory: InventoryItem[] = [];
  private alerts: InventoryAlert[] = [];
  private categories: InventoryCategory[] = [];
  private suppliers: InventorySupplier[] = [];
  private transactions: InventoryTransaction[] = [];

  public static getInstance(): AdvancedInventoryService {
    if (!AdvancedInventoryService.instance) {
      AdvancedInventoryService.instance = new AdvancedInventoryService();
    }
    return AdvancedInventoryService.instance;
  }

  constructor() {
    this.initializeInventory();
    this.initializeCategories();
    this.initializeSuppliers();
  }

  private initializeInventory() {
    this.inventory = [
      {
        id: 'vodka_premium',
        name: 'Premium Vodka',
        sku: 'VOD001',
        category: 'Spirits',
        currentStock: 12,
        minStock: 3,
        maxStock: 20,
        unit: 'bottles',
        costPerUnit: 35.00,
        barcode: '1234567890123',
        supplier: 'Premium Spirits Co.',
        location: 'Bar Storage A',
        hasExpiration: false,
        lastUpdated: new Date()
      },
      {
        id: 'gin_premium',
        name: 'Premium Gin',
        sku: 'GIN001',
        category: 'Spirits',
        currentStock: 8,
        minStock: 2,
        maxStock: 15,
        unit: 'bottles',
        costPerUnit: 42.00,
        barcode: '1234567890124',
        supplier: 'Premium Spirits Co.',
        location: 'Bar Storage A',
        hasExpiration: false,
        lastUpdated: new Date()
      },
      {
        id: 'ginger_beer',
        name: 'House Ginger Beer',
        sku: 'MIX001',
        category: 'Mixers',
        currentStock: 50,
        minStock: 12,
        maxStock: 100,
        unit: 'bottles',
        costPerUnit: 3.50,
        barcode: '1234567890125',
        supplier: 'Local Brewery',
        location: 'Bar Storage B',
        hasExpiration: true,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lastUpdated: new Date()
      },
      {
        id: 'lime_fresh',
        name: 'Fresh Limes',
        sku: 'PRO001',
        category: 'Produce',
        currentStock: 25,
        minStock: 10,
        maxStock: 50,
        unit: 'pieces',
        costPerUnit: 0.75,
        barcode: '1234567890126',
        supplier: 'Fresh Produce Inc.',
        location: 'Refrigerator',
        hasExpiration: true,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastUpdated: new Date()
      },
      {
        id: 'whiskey_bourbon',
        name: 'Bourbon Whiskey',
        sku: 'WHI001',
        category: 'Spirits',
        currentStock: 15,
        minStock: 5,
        maxStock: 25,
        unit: 'bottles',
        costPerUnit: 45.00,
        barcode: '1234567890127',
        supplier: 'Kentucky Distillers',
        location: 'Bar Storage A',
        hasExpiration: false,
        lastUpdated: new Date()
      },
      {
        id: 'tequila_silver',
        name: 'Silver Tequila',
        sku: 'TEQ001',
        category: 'Spirits',
        currentStock: 10,
        minStock: 3,
        maxStock: 18,
        unit: 'bottles',
        costPerUnit: 38.00,
        barcode: '1234567890128',
        supplier: 'Mexican Spirits Co.',
        location: 'Bar Storage A',
        hasExpiration: false,
        lastUpdated: new Date()
      }
    ];

    this.checkForAlerts();
  }

  private initializeCategories() {
    this.categories = [
      { id: 'spirits', name: 'Spirits', description: 'Alcoholic spirits and liquors', color: '#8B0000' },
      { id: 'mixers', name: 'Mixers', description: 'Non-alcoholic mixers and syrups', color: '#FF6B35' },
      { id: 'produce', name: 'Produce', description: 'Fresh fruits and vegetables', color: '#4CAF50' },
      { id: 'garnishes', name: 'Garnishes', description: 'Cocktail garnishes and decorations', color: '#FFC107' },
      { id: 'equipment', name: 'Equipment', description: 'Bar equipment and tools', color: '#607D8B' },
      { id: 'glassware', name: 'Glassware', description: 'Drinking glasses and vessels', color: '#9C27B0' }
    ];
  }

  private initializeSuppliers() {
    this.suppliers = [
      {
        id: 'supplier_001',
        name: 'Premium Spirits Co.',
        contact: 'John Smith',
        email: 'john@premiumspirits.com',
        phone: '(555) 123-4567',
        rating: 4.8
      },
      {
        id: 'supplier_002',
        name: 'Local Brewery',
        contact: 'Sarah Johnson',
        email: 'sarah@localbrewery.com',
        phone: '(555) 234-5678',
        rating: 4.6
      },
      {
        id: 'supplier_003',
        name: 'Fresh Produce Inc.',
        contact: 'Mike Davis',
        email: 'mike@freshproduce.com',
        phone: '(555) 345-6789',
        rating: 4.4
      }
    ];
  }

  // Get inventory items
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  // Get inventory alerts
  public getAlerts(): InventoryAlert[] {
    return [...this.alerts];
  }

  // Get categories
  public getCategories(): InventoryCategory[] {
    return [...this.categories];
  }

  // Get suppliers
  public getSuppliers(): InventorySupplier[] {
    return [...this.suppliers];
  }

  // Get transactions
  public getTransactions(): InventoryTransaction[] {
    return [...this.transactions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Add inventory item
  public addItem(item: Omit<InventoryItem, 'id' | 'lastUpdated'>): boolean {
    try {
      const newItem: InventoryItem = {
        ...item,
        id: `item_${Date.now()}`,
        lastUpdated: new Date()
      };

      this.inventory.push(newItem);
      this.checkForAlerts();
      console.log(`✅ Added inventory item: ${newItem.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add inventory item:', error);
      return false;
    }
  }

  // Update inventory item
  public updateItem(id: string, updates: Partial<InventoryItem>): boolean {
    try {
      const itemIndex = this.inventory.findIndex(item => item.id === id);
      if (itemIndex === -1) return false;

      this.inventory[itemIndex] = { 
        ...this.inventory[itemIndex], 
        ...updates, 
        lastUpdated: new Date() 
      };
      
      this.checkForAlerts();
      console.log(`✅ Updated inventory item: ${this.inventory[itemIndex].name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update inventory item:', error);
      return false;
    }
  }

  // Remove inventory item
  public removeItem(id: string): boolean {
    try {
      const itemIndex = this.inventory.findIndex(item => item.id === id);
      if (itemIndex === -1) return false;

      const removedItem = this.inventory.splice(itemIndex, 1)[0];
      console.log(`✅ Removed inventory item: ${removedItem.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove inventory item:', error);
      return false;
    }
  }

  // Restock item
  public restockItem(itemId: string, quantity: number, cost: number, notes?: string): boolean {
    try {
      const item = this.inventory.find(item => item.id === itemId);
      if (!item) return false;

      const previousStock = item.currentStock;
      item.currentStock += quantity;
      item.lastUpdated = new Date();

      // Record transaction
      const transaction: InventoryTransaction = {
        id: `txn_${Date.now()}`,
        itemId,
        type: 'restock',
        quantity,
        previousStock,
        newStock: item.currentStock,
        cost: cost * quantity,
        timestamp: new Date().toISOString(),
        notes,
        employeeId: 'emp_001'
      };

      this.transactions.push(transaction);
      this.checkForAlerts();

      console.log(`✅ Restocked ${quantity} ${item.unit} of ${item.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to restock item:', error);
      return false;
    }
  }

  // Sell item (reduce stock)
  public sellItem(itemId: string, quantity: number, notes?: string): boolean {
    try {
      const item = this.inventory.find(item => item.id === itemId);
      if (!item || item.currentStock < quantity) return false;

      const previousStock = item.currentStock;
      item.currentStock -= quantity;
      item.lastUpdated = new Date();

      // Record transaction
      const transaction: InventoryTransaction = {
        id: `txn_${Date.now()}`,
        itemId,
        type: 'sale',
        quantity: -quantity,
        previousStock,
        newStock: item.currentStock,
        cost: 0,
        timestamp: new Date().toISOString(),
        notes,
        employeeId: 'emp_001'
      };

      this.transactions.push(transaction);
      this.checkForAlerts();

      console.log(`✅ Sold ${quantity} ${item.unit} of ${item.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to sell item:', error);
      return false;
    }
  }

  // Check for alerts
  private checkForAlerts(): void {
    this.alerts = [];

    this.inventory.forEach(item => {
      // Low stock alert
      if (item.currentStock <= item.minStock) {
        this.alerts.push({
          id: `alert_${Date.now()}_${item.id}`,
          type: 'low_stock',
          itemId: item.id,
          itemName: item.name,
          message: `${item.name} is running low (${item.currentStock} ${item.unit} remaining)`,
          severity: item.currentStock === 0 ? 'high' : 'medium',
          timestamp: new Date(),
          resolved: false
        });
      }

      // Expiring items alert
      if (item.hasExpiration && item.expirationDate) {
        const daysUntilExpiry = Math.ceil((item.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
          this.alerts.push({
            id: `alert_${Date.now()}_${item.id}_expiry`,
            type: 'expiring',
            itemId: item.id,
            itemName: item.name,
            message: `${item.name} expires in ${daysUntilExpiry} day(s)`,
            severity: daysUntilExpiry === 1 ? 'high' : 'medium',
            timestamp: new Date(),
            resolved: false
          });
        }

        if (daysUntilExpiry < 0) {
          this.alerts.push({
            id: `alert_${Date.now()}_${item.id}_expired`,
            type: 'expired',
            itemId: item.id,
            itemName: item.name,
            message: `${item.name} has expired`,
            severity: 'high',
            timestamp: new Date(),
            resolved: false
          });
        }
      }

      // Overstock alert
      if (item.currentStock > item.maxStock) {
        this.alerts.push({
          id: `alert_${Date.now()}_${item.id}_overstock`,
          type: 'overstock',
          itemId: item.id,
          itemName: item.name,
          message: `${item.name} is overstocked (${item.currentStock} ${item.unit})`,
          severity: 'low',
          timestamp: new Date(),
          resolved: false
        });
      }
    });
  }

  // Resolve alert
  public resolveAlert(alertId: string): boolean {
    const alertIndex = this.alerts.findIndex(alert => alert.id === alertId);
    if (alertIndex === -1) return false;

    this.alerts[alertIndex].resolved = true;
    console.log(`✅ Resolved alert: ${this.alerts[alertIndex].message}`);
    return true;
  }

  // Search inventory
  public searchInventory(query: string): InventoryItem[] {
    const lowercaseQuery = query.toLowerCase();
    return this.inventory.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.sku.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery) ||
      item.supplier.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get inventory by category
  public getInventoryByCategory(category: string): InventoryItem[] {
    return this.inventory.filter(item => item.category === category);
  }

  // Get low stock items
  public getLowStockItems(): InventoryItem[] {
    return this.inventory.filter(item => item.currentStock <= item.minStock);
  }

  // Get expiring items
  public getExpiringItems(daysThreshold: number = 7): InventoryItem[] {
    const thresholdDate = new Date(Date.now() + daysThreshold * 24 * 60 * 60 * 1000);
    return this.inventory.filter(item => 
      item.hasExpiration && 
      item.expirationDate && 
      item.expirationDate <= thresholdDate
    );
  }

  // Get inventory value
  public getInventoryValue(): number {
    return this.inventory.reduce((total, item) => 
      total + (item.currentStock * item.costPerUnit), 0
    );
  }

  // Get inventory analytics
  public getInventoryAnalytics() {
    const totalItems = this.inventory.length;
    const lowStockItems = this.getLowStockItems().length;
    const expiringItems = this.getExpiringItems().length;
    const totalValue = this.getInventoryValue();

    return {
      totalItems,
      lowStockItems,
      expiringItems,
      totalValue,
      averageValue: totalItems > 0 ? totalValue / totalItems : 0,
      categories: this.categories.length,
      suppliers: this.suppliers.length
    };
  }

  // Export inventory report
  public exportInventoryReport(): string {
    const report = {
      generatedAt: new Date().toISOString(),
      analytics: this.getInventoryAnalytics(),
      items: this.inventory,
      alerts: this.alerts.filter(alert => !alert.resolved),
      transactions: this.transactions.slice(0, 100) // Last 100 transactions
    };

    return JSON.stringify(report, null, 2);
  }

  // Scan barcode
  public scanBarcode(barcode: string): InventoryItem | null {
    const item = this.inventory.find(item => item.barcode === barcode);
    return item || null;
  }

  // Get item by SKU
  public getItemBySku(sku: string): InventoryItem | null {
    const item = this.inventory.find(item => item.sku === sku);
    return item || null;
  }

  // Get item by ID
  public getItemById(id: string): InventoryItem | null {
    const item = this.inventory.find(item => item.id === id);
    return item || null;
  }
}

export default AdvancedInventoryService;
export type { InventoryCategory, InventorySupplier, InventoryTransaction };