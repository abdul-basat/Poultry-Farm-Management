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

export interface PerChickExpenses {
  totalCost: number;
  feedCost: number;
  medicineCost: number;
  extraExpenses: number;
  mortalityCost: number;
  currentStock: number;
  perChickPrice: number;
  calculationDate: string;
}

export interface DailyChickPrice {
  date: string;
  stats: PerChickExpenses;
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
  totalExpenses: number;
  perChickExpenses: number;
  dailyChickPrices: DailyChickPrice[];
}

export interface ExtraExpense {
  id: string;
  date: string;
  description: string;
  amount: number;
  createdAt: string;
}

export type Language = 'en' | 'ur';