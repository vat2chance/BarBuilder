import { MenuItem, MenuStats } from '../types';
import { menuData } from '../data/menu';

class MenuService {
  private menuItems: MenuItem[] = [];

  constructor() {
    this.initializeMenu();
  }

  private initializeMenu() {
    this.menuItems = [...menuData];
  }

  // Get all menu items
  public getMenu(): MenuItem[] {
    return [...this.menuItems];
  }

  // Get menu by category
  public getMenuByCategory(category: string): MenuItem[] {
    if (!category || category === 'All') return this.menuItems;
    return this.menuItems.filter(item => item.category === category);
  }

  // Get menu categories
  public getMenuCategories(): string[] {
    const categories = [...new Set(this.menuItems.map(item => item.category))];
    return categories.sort();
  }

  // Get menu item by ID
  public getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find(item => item.id === id);
  }

  // Add menu item
  public addMenuItem(item: Omit<MenuItem, 'id'>): boolean {
    try {
      const newItem: MenuItem = {
        ...item,
        id: `menu_${Date.now()}`
      };

      this.menuItems.push(newItem);
      console.log(`✅ Added menu item: ${newItem.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add menu item:', error);
      return false;
    }
  }

  // Update menu item
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

  // Remove menu item
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

  // Toggle item availability
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

  // Update item price
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

  // Get popular items
  public getPopularItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isPopular);
  }

  // Get signature items
  public getSignatureItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isSignature);
  }

  // Get vegetarian items
  public getVegetarianItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isVegetarian);
  }

  // Get vegan items
  public getVeganItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isVegan);
  }

  // Get gluten-free items
  public getGlutenFreeItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isGlutenFree);
  }

  // Search menu items
  public searchMenuItems(query: string): MenuItem[] {
    const lowercaseQuery = query.toLowerCase();
    return this.menuItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(lowercaseQuery)
      ) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get menu stats
  public getMenuStats(): MenuStats {
    const totalItems = this.menuItems.length;
    const activeItems = this.menuItems.filter(item => item.available).length;
    const averagePrice = this.menuItems.reduce((sum, item) => sum + item.price, 0) / totalItems;

    // Get top categories
    const categoryCounts: { [key: string]: number } = {};
    this.menuItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get popular items
    const popularItems = this.getPopularItems().slice(0, 10);

    return {
      totalItems,
      activeItems,
      averagePrice,
      topCategories,
      popularItems
    };
  }

  // Get total menu revenue potential
  public getTotalMenuRevenue(): number {
    return this.menuItems.reduce((total, item) => total + item.profitMargin, 0);
  }

  // Get average price
  public getAveragePrice(): number {
    if (this.menuItems.length === 0) return 0;
    const totalPrice = this.menuItems.reduce((total, item) => total + item.price, 0);
    return totalPrice / this.menuItems.length;
  }

  // Get items by price range
  public getItemsByPriceRange(minPrice: number, maxPrice: number): MenuItem[] {
    return this.menuItems.filter(item => 
      item.price >= minPrice && item.price <= maxPrice
    );
  }

  // Get items by preparation time
  public getItemsByPrepTime(maxPrepTime: number): MenuItem[] {
    return this.menuItems.filter(item => 
      item.preparationTime <= maxPrepTime
    );
  }

  // Get items by alcohol content
  public getItemsByAlcoholContent(minABV: number, maxABV: number): MenuItem[] {
    return this.menuItems.filter(item => 
      item.alcoholContent && 
      item.alcoholContent >= minABV && 
      item.alcoholContent <= maxABV
    );
  }

  // Get items by calories
  public getItemsByCalories(maxCalories: number): MenuItem[] {
    return this.menuItems.filter(item => 
      item.calories && item.calories <= maxCalories
    );
  }

  // Get items by availability
  public getItemsByAvailability(availability: 'always' | 'seasonal' | 'weekends' | 'special'): MenuItem[] {
    return this.menuItems.filter(item => item.availability === availability);
  }

  // Get items by tags
  public getItemsByTags(tags: string[]): MenuItem[] {
    return this.menuItems.filter(item => 
      tags.some(tag => item.tags.includes(tag))
    );
  }

  // Get items by allergens
  public getItemsByAllergens(allergens: string[]): MenuItem[] {
    return this.menuItems.filter(item => 
      allergens.some(allergen => 
        item.allergens && item.allergens.includes(allergen)
      )
    );
  }

  // Get items without allergens
  public getItemsWithoutAllergens(allergens: string[]): MenuItem[] {
    return this.menuItems.filter(item => 
      !allergens.some(allergen => 
        item.allergens && item.allergens.includes(allergen)
      )
    );
  }

  // Get menu analytics
  public getMenuAnalytics() {
    const stats = this.getMenuStats();
    const totalRevenue = this.getTotalMenuRevenue();
    const averagePrice = this.getAveragePrice();

    return {
      ...stats,
      totalRevenue,
      averagePrice,
      categories: this.getMenuCategories().length,
      popularItemsCount: this.getPopularItems().length,
      signatureItemsCount: this.getSignatureItems().length,
      vegetarianItemsCount: this.getVegetarianItems().length,
      veganItemsCount: this.getVeganItems().length,
      glutenFreeItemsCount: this.getGlutenFreeItems().length
    };
  }

  // Export menu data
  public exportMenuData(): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      analytics: this.getMenuAnalytics(),
      items: this.menuItems,
      categories: this.getMenuCategories()
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Import menu data
  public importMenuData(data: string): boolean {
    try {
      const importData = JSON.parse(data);
      if (importData.items && Array.isArray(importData.items)) {
        this.menuItems = importData.items;
        console.log(`✅ Imported ${this.menuItems.length} menu items`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to import menu data:', error);
      return false;
    }
  }

  // Duplicate menu item
  public duplicateMenuItem(id: string): boolean {
    try {
      const originalItem = this.getMenuItemById(id);
      if (!originalItem) return false;

      const duplicatedItem: MenuItem = {
        ...originalItem,
        id: `menu_${Date.now()}`,
        name: `${originalItem.name} (Copy)`,
        isPopular: false,
        isSignature: false
      };

      this.menuItems.push(duplicatedItem);
      console.log(`✅ Duplicated menu item: ${originalItem.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to duplicate menu item:', error);
      return false;
    }
  }

  // Get menu item suggestions
  public getMenuItemSuggestions(query: string): MenuItem[] {
    const suggestions = this.searchMenuItems(query);
    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  // Get menu item pairings
  public getMenuItemPairings(itemId: string): MenuItem[] {
    const item = this.getMenuItemById(itemId);
    if (!item || !item.pairings) return [];

    return this.menuItems.filter(menuItem => 
      item.pairings!.includes(menuItem.name)
    );
  }

  // Get menu item customizations
  public getMenuItemCustomizations(itemId: string) {
    const item = this.getMenuItemById(itemId);
    return item?.customizations || [];
  }
}

export default MenuService;