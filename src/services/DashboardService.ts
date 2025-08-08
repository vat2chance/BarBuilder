import { DashboardCard } from '../types';

interface DashboardLayout {
  id: string;
  name: string;
  cards: DashboardCard[];
  isDefault: boolean;
}

class DashboardService {
  private static instance: DashboardService;
  private subscribers: (() => void)[] = [];
  private dashboardCards: DashboardCard[] = [];
  private layouts: DashboardLayout[] = [];

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  constructor() {
    this.initializeDefaultCards();
    this.initializeLayouts();
  }

  private initializeDefaultCards() {
    this.dashboardCards = [
      {
        id: 'pos',
        title: 'Point of Sale',
        subtitle: 'Process orders & payments',
        icon: '💳',
        color: '#4CAF50',
        stats: 'Active orders: 3'
      },
      {
        id: 'inventory',
        title: 'Inventory',
        subtitle: 'Manage stock & supplies',
        icon: '📦',
        color: '#2196F3',
        stats: 'Low stock: 5 items'
      },
      {
        id: 'menu',
        title: 'Menu Management',
        subtitle: 'Update menu items',
        icon: '🍽️',
        color: '#FF9800',
        stats: 'Active items: 45'
      },
      {
        id: 'reports',
        title: 'Reports & Analytics',
        subtitle: 'View business insights',
        icon: '📊',
        color: '#9C27B0',
        stats: 'Today: $2,450'
      },
      {
        id: 'staff',
        title: 'Staff Management',
        subtitle: 'Schedule & manage team',
        icon: '👥',
        color: '#607D8B',
        stats: 'On duty: 8'
      },
      {
        id: 'kitchen',
        title: 'Kitchen Display',
        subtitle: 'Monitor orders',
        icon: '🍳',
        color: '#FF5722',
        stats: 'Pending: 6 orders'
      },
      {
        id: 'customerMenu',
        title: 'Customer Menu',
        subtitle: 'Digital menu display',
        icon: '📱',
        color: '#00BCD4',
        stats: 'Active: 12 tables'
      },
      {
        id: 'schedule',
        title: 'Scheduling',
        subtitle: 'Staff schedules',
        icon: '📅',
        color: '#795548',
        stats: 'This week: 45 shifts'
      },
      {
        id: 'logout',
        title: 'Logout',
        subtitle: 'Sign out of system',
        icon: '🚪',
        color: '#F44336',
        stats: ''
      }
    ];
  }

  private initializeLayouts() {
    this.layouts = [
      {
        id: 'default',
        name: 'Default Layout',
        cards: [...this.dashboardCards],
        isDefault: true
      },
      {
        id: 'bartender',
        name: 'Bartender Layout',
        cards: this.dashboardCards.filter(card => 
          ['pos', 'inventory', 'menu', 'kitchen', 'customerMenu', 'logout'].includes(card.id)
        ),
        isDefault: false
      },
      {
        id: 'manager',
        name: 'Manager Layout',
        cards: this.dashboardCards.filter(card => 
          ['pos', 'inventory', 'menu', 'reports', 'staff', 'schedule', 'logout'].includes(card.id)
        ),
        isDefault: false
      },
      {
        id: 'kitchen',
        name: 'Kitchen Layout',
        cards: this.dashboardCards.filter(card => 
          ['kitchen', 'inventory', 'menu', 'reports', 'logout'].includes(card.id)
        ),
        isDefault: false
      }
    ];
  }

  // Get dashboard cards
  public getDashboardCards(): DashboardCard[] {
    return [...this.dashboardCards];
  }

  // Add new card
  public addCard(card: Omit<DashboardCard, 'id'>): boolean {
    try {
      const newCard: DashboardCard = {
        ...card,
        id: `custom_${Date.now()}`
      };
      
      this.dashboardCards.push(newCard);
      this.notifySubscribers();
      console.log(`✅ Added dashboard card: ${newCard.title}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add dashboard card:', error);
      return false;
    }
  }

  // Update card
  public updateCard(id: string, updates: Partial<DashboardCard>): boolean {
    try {
      const cardIndex = this.dashboardCards.findIndex(card => card.id === id);
      if (cardIndex === -1) return false;

      this.dashboardCards[cardIndex] = { ...this.dashboardCards[cardIndex], ...updates };
      this.notifySubscribers();
      console.log(`✅ Updated dashboard card: ${this.dashboardCards[cardIndex].title}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update dashboard card:', error);
      return false;
    }
  }

  // Remove card
  public removeCard(id: string): boolean {
    try {
      const cardIndex = this.dashboardCards.findIndex(card => card.id === id);
      if (cardIndex === -1) return false;

      const removedCard = this.dashboardCards.splice(cardIndex, 1)[0];
      this.notifySubscribers();
      console.log(`✅ Removed dashboard card: ${removedCard.title}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove dashboard card:', error);
      return false;
    }
  }

  // Reorder cards
  public reorderCards(newOrder: string[]): boolean {
    try {
      const reorderedCards: DashboardCard[] = [];
      
      for (const cardId of newOrder) {
        const card = this.dashboardCards.find(c => c.id === cardId);
        if (card) {
          reorderedCards.push(card);
        }
      }

      this.dashboardCards = reorderedCards;
      this.notifySubscribers();
      console.log('✅ Dashboard cards reordered');
      return true;
    } catch (error) {
      console.error('❌ Failed to reorder dashboard cards:', error);
      return false;
    }
  }

  // Get available layouts
  public getLayouts(): DashboardLayout[] {
    return [...this.layouts];
  }

  // Apply layout
  public applyLayout(layoutId: string): boolean {
    try {
      const layout = this.layouts.find(l => l.id === layoutId);
      if (!layout) return false;

      this.dashboardCards = [...layout.cards];
      this.notifySubscribers();
      console.log(`✅ Applied layout: ${layout.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to apply layout:', error);
      return false;
    }
  }

  // Create custom layout
  public createLayout(name: string, cardIds: string[]): boolean {
    try {
      const layoutCards = this.dashboardCards.filter(card => cardIds.includes(card.id));
      
      const newLayout: DashboardLayout = {
        id: `custom_${Date.now()}`,
        name,
        cards: layoutCards,
        isDefault: false
      };

      this.layouts.push(newLayout);
      console.log(`✅ Created custom layout: ${name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to create layout:', error);
      return false;
    }
  }

  // Delete layout
  public deleteLayout(layoutId: string): boolean {
    try {
      const layoutIndex = this.layouts.findIndex(l => l.id === layoutId);
      if (layoutIndex === -1 || this.layouts[layoutIndex].isDefault) return false;

      const removedLayout = this.layouts.splice(layoutIndex, 1)[0];
      console.log(`✅ Deleted layout: ${removedLayout.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete layout:', error);
      return false;
    }
  }

  // Reset to default
  public resetToDefault(): boolean {
    try {
      this.initializeDefaultCards();
      this.notifySubscribers();
      console.log('✅ Dashboard reset to default');
      return true;
    } catch (error) {
      console.error('❌ Failed to reset dashboard:', error);
      return false;
    }
  }

  // Export layout data
  public exportLayout(): DashboardLayout {
    return {
      id: 'exported',
      name: 'Exported Layout',
      cards: [...this.dashboardCards],
      isDefault: false
    };
  }

  // Import layout data
  public importLayout(layoutData: DashboardLayout): boolean {
    try {
      this.dashboardCards = [...layoutData.cards];
      this.notifySubscribers();
      console.log(`✅ Imported layout: ${layoutData.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to import layout:', error);
      return false;
    }
  }

  // Update card stats
  public updateCardStats(cardId: string, stats: string): boolean {
    return this.updateCard(cardId, { stats });
  }

  // Get card by ID
  public getCardById(id: string): DashboardCard | undefined {
    return this.dashboardCards.find(card => card.id === id);
  }

  // Subscribe to changes
  public subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  // Get dashboard analytics
  public getDashboardAnalytics() {
    return {
      totalCards: this.dashboardCards.length,
      customCards: this.dashboardCards.filter(card => card.id.startsWith('custom_')).length,
      availableLayouts: this.layouts.length,
      lastUpdated: new Date().toISOString()
    };
  }

  // Search cards
  public searchCards(query: string): DashboardCard[] {
    const lowercaseQuery = query.toLowerCase();
    return this.dashboardCards.filter(card => 
      card.title.toLowerCase().includes(lowercaseQuery) ||
      card.subtitle.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Duplicate card
  public duplicateCard(cardId: string): boolean {
    try {
      const originalCard = this.getCardById(cardId);
      if (!originalCard) return false;

      const duplicatedCard: DashboardCard = {
        ...originalCard,
        id: `duplicate_${Date.now()}`,
        title: `${originalCard.title} (Copy)`
      };

      this.dashboardCards.push(duplicatedCard);
      this.notifySubscribers();
      console.log(`✅ Duplicated card: ${originalCard.title}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to duplicate card:', error);
      return false;
    }
  }

  // Get card categories
  public getCardCategories(): string[] {
    const categories = new Set<string>();
    this.dashboardCards.forEach(card => {
      if (card.color) {
        categories.add(card.color);
      }
    });
    return Array.from(categories);
  }

  // Filter cards by category
  public filterCardsByCategory(category: string): DashboardCard[] {
    return this.dashboardCards.filter(card => card.color === category);
  }
}

export default DashboardService;
export type { DashboardLayout };