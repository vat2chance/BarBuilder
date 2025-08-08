// Import the actual menu data structure
import { MenuItem as MenuDataItem, menuData } from '../data/menu';

interface MenuItem extends MenuDataItem {
  available: boolean;
  posCategory: 'drinks' | 'food' | 'appetizers' | 'desserts';
  inventoryItems: { itemId: string; quantity: number }[];
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifications: string[];
  specialInstructions?: string;
  customizations: { [key: string]: string };
  subtotal: number;
  itemNotes?: string;
}

interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'contactless' | 'mobile' | 'split';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  orderStatus: 'preparing' | 'ready' | 'served' | 'cancelled';
  customerName?: string;
  tableNumber?: number;
  orderType: 'dine_in' | 'takeout' | 'delivery';
  timestamp: string;
  employeeId: string;
  generalNotes?: string;
  kitchenNotes?: string;
  allergyNotes?: string;
  estimatedReadyTime?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  kitchenTicketNumber?: string;
}

interface KitchenTicket {
  ticketNumber: string;
  orderId: string;
  orderNumber: number;
  tableNumber?: number;
  customerName?: string;
  orderType: 'dine_in' | 'takeout' | 'delivery';
  items: {
    name: string;
    quantity: number;
    modifications: string[];
    notes?: string;
    allergens: string[];
    preparationTime: number;
    priority: string;
  }[];
  generalNotes?: string;
  kitchenNotes?: string;
  allergyNotes?: string;
  timestamp: string;
  estimatedReadyTime: string;
  status: 'new' | 'preparing' | 'ready' | 'served';
  prepTimeTotal: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  cost: number;
  supplier: string;
  lastRestocked: string;
}

interface MenuManagement {
  addMenuItem: (item: Omit<MenuItem, 'id'>) => boolean;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => boolean;
  removeMenuItem: (id: string) => boolean;
  toggleItemAvailability: (id: string) => boolean;
  updateItemPrice: (id: string, newPrice: number) => boolean;
  addCustomization: (itemId: string, customization: any) => boolean;
}

class EnhancedPOSService {
  private static instance: EnhancedPOSService;
  private menuItems: MenuItem[] = [];
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private kitchenTickets: KitchenTicket[] = [];
  private orderCounter: number = 1001;
  private kitchenTicketCounter: number = 5001;
  private inventory: InventoryItem[] = [];

  public static getInstance(): EnhancedPOSService {
    if (!EnhancedPOSService.instance) {
      EnhancedPOSService.instance = new EnhancedPOSService();
    }
    return EnhancedPOSService.instance;
  }

  constructor() {
    this.initializeMenuFromData();
    this.initializeInventory();
  }

  // Initialize menu from actual menu data
  private initializeMenuFromData() {
    this.menuItems = menuData.map(item => {
      const posCategory = this.mapCategoryToPOS(item.category);
      return {
        ...item,
        available: true,
        posCategory,
        inventoryItems: this.getInventoryItemsForMenuItem(item.id)
      };
    });
  }

  private mapCategoryToPOS(category: string): 'drinks' | 'food' | 'appetizers' | 'desserts' {
    const categoryMap: { [key: string]: 'drinks' | 'food' | 'appetizers' | 'desserts' } = {
      'Signature Cocktails': 'drinks',
      'Classic Cocktails': 'drinks',
      'Craft Beer': 'drinks',
      'Wine': 'drinks',
      'Non-Alcoholic': 'drinks',
      'Main Courses': 'food',
      'Appetizers': 'appetizers',
      'Desserts': 'desserts',
    };
    return categoryMap[category] || 'food';
  }

  private getInventoryItemsForMenuItem(menuItemId: string): { itemId: string; quantity: number }[] {
    // Map menu items to inventory items based on ingredients
    const defaultMapping = [{ itemId: `inv_${menuItemId}`, quantity: 1 }];
    
    // You can expand this with specific mappings
    const inventoryMap: { [key: string]: { itemId: string; quantity: number }[] } = {
      'cocktail-signature-mule': [
        { itemId: 'vodka_premium', quantity: 2 },
        { itemId: 'ginger_beer', quantity: 6 },
        { itemId: 'lime_fresh', quantity: 0.5 }
      ],
      'cocktail-classic-martini': [
        { itemId: 'gin_premium', quantity: 2.5 },
        { itemId: 'vermouth_dry', quantity: 0.5 }
      ],
      // Add more specific mappings as needed
    };
    
    return inventoryMap[menuItemId] || defaultMapping;
  }

  private initializeInventory() {
    this.inventory = [
      { id: 'vodka_premium', name: 'Premium Vodka', category: 'Spirits', currentStock: 12, minimumStock: 3, unit: 'bottles', cost: 35.00, supplier: 'Premium Spirits Co.', lastRestocked: '2024-01-15' },
      { id: 'gin_premium', name: 'Premium Gin', category: 'Spirits', currentStock: 8, minimumStock: 2, unit: 'bottles', cost: 42.00, supplier: 'Premium Spirits Co.', lastRestocked: '2024-01-15' },
      { id: 'ginger_beer', name: 'House Ginger Beer', category: 'Mixers', currentStock: 50, minimumStock: 12, unit: 'bottles', cost: 3.50, supplier: 'Local Brewery', lastRestocked: '2024-01-20' },
      { id: 'lime_fresh', name: 'Fresh Limes', category: 'Produce', currentStock: 25, minimumStock: 10, unit: 'pieces', cost: 0.75, supplier: 'Fresh Produce Inc.', lastRestocked: '2024-01-22' },
      // Add more inventory items as needed
    ];
  }

  // Menu Management Functions
  public addMenuItem(item: Omit<MenuDataItem, 'id'> & { posCategory: 'drinks' | 'food' | 'appetizers' | 'desserts' }): boolean {
    try {
      const newId = `custom_${Date.now()}`;
      const newItem: MenuItem = {
        ...item,
        id: newId,
        available: true,
        inventoryItems: [{ itemId: `inv_${newId}`, quantity: 1 }]
      };
      
      this.menuItems.push(newItem);
      console.log(`✅ Added new menu item: ${newItem.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add menu item:', error);
      return false;
    }
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): boolean {
    try {
      const itemIndex = this.menuItems.findIndex(item => item.id === id);
      if (itemIndex === -1) return false;

      this.menuItems[itemIndex] = { ...this.menuItems[itemIndex], ...updates };
      console.log(`✅ Updated menu item: ${this.menuItems[itemIndex].name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update menu item:', error);
      return false;
    }
  }

  public removeMenuItem(id: string): boolean {
    try {
      const itemIndex = this.menuItems.findIndex(item => item.id === id);
      if (itemIndex === -1) return false;

      const removedItem = this.menuItems.splice(itemIndex, 1)[0];
      console.log(`✅ Removed menu item: ${removedItem.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove menu item:', error);
      return false;
    }
  }

  public toggleItemAvailability(id: string): boolean {
    try {
      const item = this.menuItems.find(item => item.id === id);
      if (!item) return false;

      item.available = !item.available;
      console.log(`✅ ${item.available ? 'Enabled' : 'Disabled'} ${item.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to toggle item availability:', error);
      return false;
    }
  }

  public updateItemPrice(id: string, newPrice: number): boolean {
    try {
      const item = this.menuItems.find(item => item.id === id);
      if (!item) return false;

      const oldPrice = item.price;
      item.price = newPrice;
      console.log(`✅ Updated ${item.name} price from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update item price:', error);
      return false;
    }
  }

  // POS Functions
  public getMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => item.available);
  }

  public getMenuItemsByCategory(category: 'drinks' | 'food' | 'appetizers' | 'desserts'): MenuItem[] {
    return this.menuItems.filter(item => item.available && item.posCategory === category);
  }

  public addToCart(
    menuItemId: string, 
    quantity: number = 1, 
    modifications: string[] = [],
    customizations: { [key: string]: string } = {},
    itemNotes?: string
  ): boolean {
    const menuItem = this.menuItems.find(item => item.id === menuItemId && item.available);
    if (!menuItem) return false;

    // Check if item already exists in cart with same modifications
    const existingItemIndex = this.cart.findIndex(
      cartItem => 
        cartItem.menuItem.id === menuItemId && 
        JSON.stringify(cartItem.modifications) === JSON.stringify(modifications) &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations) &&
        cartItem.itemNotes === itemNotes
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      this.cart[existingItemIndex].quantity += quantity;
      this.cart[existingItemIndex].subtotal = this.cart[existingItemIndex].quantity * menuItem.price;
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        menuItem,
        quantity,
        modifications,
        customizations,
        itemNotes,
        subtotal: quantity * menuItem.price
      };
      this.cart.push(cartItem);
    }

    console.log(`✅ Added ${quantity}x ${menuItem.name} to cart`);
    return true;
  }

  public updateCartItemNotes(itemIndex: number, notes: string): boolean {
    if (itemIndex < 0 || itemIndex >= this.cart.length) return false;
    
    this.cart[itemIndex].itemNotes = notes;
    console.log(`✅ Updated notes for ${this.cart[itemIndex].menuItem.name}`);
    return true;
  }

  public removeFromCart(itemIndex: number): boolean {
    if (itemIndex < 0 || itemIndex >= this.cart.length) return false;

    const removedItem = this.cart.splice(itemIndex, 1)[0];
    console.log(`✅ Removed ${removedItem.menuItem.name} from cart`);
    return true;
  }

  public updateCartItemQuantity(itemIndex: number, quantity: number): boolean {
    if (itemIndex < 0 || itemIndex >= this.cart.length) return false;
    if (quantity <= 0) return this.removeFromCart(itemIndex);

    this.cart[itemIndex].quantity = quantity;
    this.cart[itemIndex].subtotal = quantity * this.cart[itemIndex].menuItem.price;
    console.log(`✅ Updated ${this.cart[itemIndex].menuItem.name} quantity to ${quantity}`);
    return true;
  }

  public getCart(): CartItem[] {
    return [...this.cart];
  }

  public getCartTotal(): { subtotal: number; tax: number; total: number } {
    const subtotal = this.cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.08875; // 8.875% tax rate
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  }

  public clearCart(): void {
    this.cart = [];
    console.log('✅ Cart cleared');
  }

  // Order Processing
  public processOrder(
    paymentMethod: 'cash' | 'card' | 'contactless' | 'mobile' | 'split',
    customerName?: string,
    tableNumber?: number,
    orderType: 'dine_in' | 'takeout' | 'delivery' = 'dine_in',
    tip: number = 0,
    employeeId: string = 'emp_001',
    generalNotes?: string,
    kitchenNotes?: string,
    allergyNotes?: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Order | null {
    if (this.cart.length === 0) return null;

    try {
      const { subtotal, tax } = this.getCartTotal();
      const total = subtotal + tax + tip;

      const order: Order = {
        id: `order_${Date.now()}`,
        orderNumber: this.orderCounter++,
        items: [...this.cart],
        subtotal,
        tax,
        tip,
        total,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'preparing',
        customerName,
        tableNumber,
        orderType,
        timestamp: new Date().toISOString(),
        employeeId,
        generalNotes,
        kitchenNotes,
        allergyNotes,
        priority
      };

      // Calculate estimated ready time
      const totalPrepTime = this.cart.reduce((total, item) => 
        total + (item.menuItem.preparationTime * item.quantity), 0
      );
      
      const readyTime = new Date();
      readyTime.setMinutes(readyTime.getMinutes() + totalPrepTime);
      order.estimatedReadyTime = readyTime.toISOString();

      // Create kitchen ticket
      const kitchenTicket = this.createKitchenTicket(order);
      
      this.orders.push(order);
      this.kitchenTickets.push(kitchenTicket);
      
      // Update inventory
      this.updateInventoryForOrder(order);

      console.log(`✅ Order #${order.orderNumber} created successfully`);
      console.log(`🍳 Kitchen ticket #${kitchenTicket.ticketNumber} generated`);
      
      return order;
    } catch (error) {
      console.error('❌ Failed to process order:', error);
      return null;
    }
  }

  private createKitchenTicket(order: Order): KitchenTicket {
    const ticketNumber = `K${this.kitchenTicketCounter++}`;
    
    const totalPrepTime = order.items.reduce((total, item) => 
      total + (item.menuItem.preparationTime * item.quantity), 0
    );

    const readyTime = new Date();
    readyTime.setMinutes(readyTime.getMinutes() + totalPrepTime);

    return {
      ticketNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      orderType: order.orderType,
      items: order.items.map(item => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        modifications: item.modifications,
        notes: item.itemNotes,
        allergens: item.menuItem.allergens || [],
        preparationTime: item.menuItem.preparationTime,
        priority: order.priority
      })),
      generalNotes: order.generalNotes,
      kitchenNotes: order.kitchenNotes,
      allergyNotes: order.allergyNotes,
      timestamp: order.timestamp,
      estimatedReadyTime: readyTime.toISOString(),
      status: 'new',
      prepTimeTotal: totalPrepTime
    };
  }

  private updateInventoryForOrder(order: Order): void {
    order.items.forEach(cartItem => {
      cartItem.menuItem.inventoryItems.forEach(invItem => {
        const inventoryItem = this.inventory.find(item => item.id === invItem.itemId);
        if (inventoryItem) {
          inventoryItem.currentStock = Math.max(0, inventoryItem.currentStock - (invItem.quantity * cartItem.quantity));
          
          if (inventoryItem.currentStock <= inventoryItem.minimumStock) {
            console.log(`⚠️  Low stock alert: ${inventoryItem.name} (${inventoryItem.currentStock} ${inventoryItem.currentStock} remaining)`);
          }
        }
      });
    });
  }

  // Kitchen Management
  public getKitchenTickets(): KitchenTicket[] {
    return this.kitchenTickets.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  public updateKitchenTicketStatus(ticketNumber: string, status: 'new' | 'preparing' | 'ready' | 'served'): boolean {
    const ticket = this.kitchenTickets.find(t => t.ticketNumber === ticketNumber);
    if (!ticket) return false;

    ticket.status = status;
    
    // Update order status
    const order = this.orders.find(o => o.id === ticket.orderId);
    if (order) {
      switch (status) {
        case 'preparing':
          order.orderStatus = 'preparing';
          break;
        case 'ready':
          order.orderStatus = 'ready';
          break;
        case 'served':
          order.orderStatus = 'served';
          break;
      }
    }

    console.log(`✅ Kitchen ticket #${ticketNumber} updated to ${status}`);
    return true;
  }

  public printKitchenTicket(ticketNumber: string): string {
    const ticket = this.kitchenTickets.find(t => t.ticketNumber === ticketNumber);
    if (!ticket) return '';

    const ticketText = `
╔══════════════════════════════════════╗
║           KITCHEN TICKET             ║
╠══════════════════════════════════════╣
║ Ticket: ${ticket.ticketNumber.padEnd(28)} ║
║ Order: #${ticket.orderNumber.toString().padEnd(27)} ║
║ ${ticket.orderType.toUpperCase().padEnd(34)} ║
${ticket.tableNumber ? `║ Table: ${ticket.tableNumber.toString().padEnd(28)} ║` : ''}
${ticket.customerName ? `║ Customer: ${ticket.customerName.padEnd(23)} ║` : ''}
╠══════════════════════════════════════╣
║ Time: ${new Date(ticket.timestamp).toLocaleTimeString().padEnd(29)} ║
║ Ready: ${new Date(ticket.estimatedReadyTime).toLocaleTimeString().padEnd(28)} ║
║ Prep Time: ${ticket.prepTimeTotal} min${' '.repeat(21)} ║
╠══════════════════════════════════════╣
║ ITEMS:                               ║
${ticket.items.map(item => {
  const itemLine = `║ ${item.quantity}x ${item.name}`;
  const padding = 38 - itemLine.length;
  return itemLine + ' '.repeat(Math.max(0, padding)) + '║';
}).join('\n')}
╠══════════════════════════════════════╣
${ticket.allergyNotes ? `║ ⚠️  ALLERGY: ${ticket.allergyNotes.padEnd(23)} ║` : ''}
${ticket.kitchenNotes ? `║ 📝 KITCHEN: ${ticket.kitchenNotes.padEnd(24)} ║` : ''}
${ticket.generalNotes ? `║ 💬 NOTES: ${ticket.generalNotes.padEnd(26)} ║` : ''}
╚══════════════════════════════════════╝
    `;

    console.log('🖨️ Kitchen ticket printed:');
    console.log(ticketText);
    return ticketText;
  }

  // Analytics & Reporting
  public getDailySales(): { totalOrders: number; totalRevenue: number; avgOrderValue: number } {
    const today = new Date().toDateString();
    const todayOrders = this.orders.filter(order => 
      new Date(order.timestamp).toDateString() === today &&
      order.paymentStatus === 'completed'
    );

    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { totalOrders, totalRevenue, avgOrderValue };
  }

  public getPopularItems(limit: number = 10): { name: string; timesOrdered: number }[] {
    const itemCounts: { [key: string]: number } = {};
    
    this.orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.menuItem.name;
        itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
      });
    });

    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, timesOrdered: count }))
      .sort((a, b) => b.timesOrdered - a.timesOrdered)
      .slice(0, limit);
  }

  public getLowStockItems(): InventoryItem[] {
    return this.inventory.filter(item => item.currentStock <= item.minimumStock);
  }

  public getOrders(): Order[] {
    return [...this.orders];
  }

  public getActiveOrders(): Order[] {
    return this.orders.filter(order => 
      order.orderStatus === 'preparing' || order.orderStatus === 'ready'
    );
  }
}

export default EnhancedPOSService;
export type { MenuItem, CartItem, Order, KitchenTicket, MenuManagement };