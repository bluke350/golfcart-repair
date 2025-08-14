import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  Customer, 
  Job, 
  Part, 
  InventoryItem, 
  Accessory, 
  Bill, 
  BillItem 
} from '../types';

// Define the context state type
interface ShopContextState {
  // Data collections
  customers: Customer[];
  jobs: Job[];
  parts: Part[];
  inventoryItems: InventoryItem[];
  accessories: Accessory[];
  bills: Bill[];
  
  // Active customer for billing
  activeCustomerId: number | null;
  activeBillItems: BillItem[];
  
  // Setters
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<Accessory[]>>;
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  
  // Customer selection for billing
  setActiveCustomerId: (id: number | null) => void;
  
  // Bill item methods
  addItemToBill: (type: 'job' | 'part' | 'inventory' | 'accessory', item: any, quantity?: number) => void;
  removeItemFromBill: (id: number) => void;
  clearBillItems: () => void;
  
  // Bill creation
  createBill: () => Promise<void>;
  
  // Utility methods to find records
  getCustomerById: (id: number | null) => Customer | undefined;
}

// Create context with default values
const ShopContext = createContext<ShopContextState | undefined>(undefined);

// Provider props interface
interface ShopProviderProps {
  children: ReactNode;
}

// Provider component
export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  // State for all data collections
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  
  // Billing state
  const [activeCustomerId, setActiveCustomerId] = useState<number | null>(null);
  const [activeBillItems, setActiveBillItems] = useState<BillItem[]>([]);
  
  // Load sample data (in a real app, this would be API calls)
  useEffect(() => {
    // Load sample customers
    setCustomers([
      { id: 1, name: 'John Smith', phone: '555-123-4567', email: 'john@example.com', address: '123 Main St' },
      { id: 2, name: 'Jane Doe', phone: '555-987-6543', email: 'jane@example.com', address: '456 Oak Ave' },
    ]);
    
    // Load sample jobs
    setJobs([
      { id: 1, description: 'Lift Kit Install', startTime: null, endTime: null, hourlyRate: 75, estimatedTime: 120 },
      { id: 2, description: 'Battery Replacement', startTime: null, endTime: null, hourlyRate: 65, estimatedTime: 45 },
    ]);
    
    // Load sample parts
    setParts([
      { id: 1, name: 'Golf Cart Battery', cost: 85, marketPrice: 120, markup: 41.18, quantityOnHand: 10, supplier: 'BatteryPlus' },
      { id: 2, name: 'Lift Kit Standard', cost: 220, marketPrice: 350, markup: 59.09, quantityOnHand: 5, supplier: 'CartMods Inc' },
    ]);
    
    // Load sample inventory
    setInventoryItems([
      { id: 1, name: 'Used Golf Cart - E-Z-GO', type: 'cart', price: 2800, forSale: true, quantityOnHand: 1 },
      { id: 2, name: 'Wheel Set - Premium', type: 'part', price: 240, forSale: true, quantityOnHand: 3 },
    ]);
    
    // Load sample accessories
    setAccessories([
      { id: 1, name: 'Premium Cup Holder', salesPoint: 'Perfect for drinks on the course!', price: 24.99, quantityOnHand: 15 },
      { id: 2, name: 'Folding Windshield', salesPoint: 'Protection from wind and debris', price: 89.95, quantityOnHand: 8 },
    ]);
    
    // Load sample bills
    setBills([
      { 
        id: 1, 
        customerId: 1, 
        date: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago 
        items: [
          { id: 1, type: 'job', name: 'Battery Replacement', price: 65, quantity: 1, originalItemId: 2 },
          { id: 2, type: 'part', name: 'Golf Cart Battery', price: 120, quantity: 1, originalItemId: 1 }
        ],
        total: 185,
        paid: true
      }
    ]);
  }, []);
  
  // Get customer by ID
  const getCustomerById = (id: number | null): Customer | undefined => {
    if (!id) return undefined;
    return customers.find(customer => customer.id === id);
  };
  
  // Add item to bill
  const addItemToBill = (
    type: 'job' | 'part' | 'inventory' | 'accessory', 
    item: any,
    quantity: number = 1
  ) => {
    if (!activeCustomerId) {
      alert('Please select a customer first');
      return;
    }
    
    let price: number = 0;
    let name: string = '';
    let originalItemId: number = item.id;
    
    switch(type) {
      case 'job':
        name = item.description;
        price = item.hourlyRate;
        break;
      case 'part':
        name = item.name;
        price = item.marketPrice;
        break;
      case 'inventory':
      case 'accessory':
        name = item.name;
        price = item.price;
        break;
    }
    
    const newItem: BillItem = {
      id: Date.now(),
      type,
      name,
      price,
      quantity,
      originalItemId
    };
    
    setActiveBillItems(prev => [...prev, newItem]);
  };
  
  // Remove item from bill
  const removeItemFromBill = (id: number) => {
    setActiveBillItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Clear all items from bill
  const clearBillItems = () => {
    setActiveBillItems([]);
  };
  
  // Create bill
  const createBill = async (): Promise<void> => {
    if (!activeCustomerId || activeBillItems.length === 0) {
      alert('Cannot create a bill without a customer or items');
      return;
    }
    
    const total = activeBillItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newBill: Bill = {
      id: Date.now(),
      customerId: activeCustomerId,
      date: Date.now(),
      items: [...activeBillItems],
      total,
      paid: false
    };
    
    // In a real app, this would be an API call
    setBills(prev => [...prev, newBill]);
    
    // Clear active bill items after creating the bill
    clearBillItems();
    
    alert('Bill created successfully!');
  };
  
  // Context value
  const contextValue: ShopContextState = {
    customers,
    jobs,
    parts,
    inventoryItems,
    accessories,
    bills,
    activeCustomerId,
    activeBillItems,
    setCustomers,
    setJobs,
    setParts,
    setInventoryItems,
    setAccessories,
    setBills,
    setActiveCustomerId,
    addItemToBill,
    removeItemFromBill,
    clearBillItems,
    createBill,
    getCustomerById
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to use the shop context
export const useShop = (): ShopContextState => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
