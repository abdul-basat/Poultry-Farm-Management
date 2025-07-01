export interface ChickArrival {
  id: string;
  date: string;
  quantity: number;
  batchNumber: string;
  source?: string;
  createdAt: string;
}

export interface Mortality {
  id: string;
  date: string;
  quantity: number;
  notes?: string;
  createdAt: string;
}

export interface FeedMedicine {
  id: string;
  date: string;
  type: 'feed' | 'medicine';
  name: string;
  quantity: number;
  cost: number;
  supplier?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  date: string;
  customerName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  amountReceived: number;
  outstandingBalance: number;
  createdAt: string;
}

export interface DashboardStats {
  totalChicks: number;
  totalMortality: number;
  currentStock: number;
  totalSales: number;
  totalRevenue: number;
  totalOutstanding: number;
  totalFeedCost: number;
  totalMedicineCost: number;
  mortalityRate: number;
}

export type Language = 'en' | 'ur';