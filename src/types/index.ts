// Type definitions for the Golf Cart Repair Shop Management System

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Job {
  id: number;
  description: string;
  startTime: number | null;
  endTime: number | null;
  hourlyRate: number;
  estimatedTime?: number; // in minutes
  customerId?: number;    // Link to the customer this job is for
}

export interface Part {
  id: number;
  name: string;
  cost: number;       // Wholesale price
  marketPrice: number;
  markup: number;     // Calculated markup percentage
  quantityOnHand: number;
  supplier: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  type: 'part' | 'cart';
  price: number;
  forSale: boolean;
  quantityOnHand: number;
}

export interface Accessory {
  id: number;
  name: string;
  salesPoint: string;
  price: number;
  quantityOnHand: number;
}

export interface BillItem {
  id: number;
  type: 'job' | 'part' | 'inventory' | 'accessory';
  name: string;
  price: number;
  quantity: number;
  originalItemId: number; // Reference to the original item
}

export interface Bill {
  id: number;
  customerId: number;
  date: number; // Timestamp
  items: BillItem[];
  total: number;
  paid: boolean;
  notes?: string;
}
