import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChickArrival, Mortality, FeedMedicine, Sale, DashboardStats } from '../types';

interface DataContextType {
  // Data
  chickArrivals: ChickArrival[];
  mortalities: Mortality[];
  feedMedicines: FeedMedicine[];
  sales: Sale[];
  stats: DashboardStats;
  
  // Actions
  addChickArrival: (arrival: Omit<ChickArrival, 'id' | 'createdAt'>) => void;
  addMortality: (mortality: Omit<Mortality, 'id' | 'createdAt'>) => void;
  addFeedMedicine: (feedMedicine: Omit<FeedMedicine, 'id' | 'createdAt'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  
  updateChickArrival: (id: string, arrival: Partial<ChickArrival>) => void;
  updateMortality: (id: string, mortality: Partial<Mortality>) => void;
  updateFeedMedicine: (id: string, feedMedicine: Partial<FeedMedicine>) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  
  deleteChickArrival: (id: string) => void;
  deleteMortality: (id: string) => void;
  deleteFeedMedicine: (id: string) => void;
  deleteSale: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chickArrivals, setChickArrivals] = useState<ChickArrival[]>([]);
  const [mortalities, setMortalities] = useState<Mortality[]>([]);
  const [feedMedicines, setFeedMedicines] = useState<FeedMedicine[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalChicks: 0,
    totalMortality: 0,
    currentStock: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalOutstanding: 0,
    totalFeedCost: 0,
    totalMedicineCost: 0,
    mortalityRate: 0,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedArrivals = localStorage.getItem('chickArrivals');
    const savedMortalities = localStorage.getItem('mortalities');
    const savedFeedMedicines = localStorage.getItem('feedMedicines');
    const savedSales = localStorage.getItem('sales');

    if (savedArrivals) setChickArrivals(JSON.parse(savedArrivals));
    if (savedMortalities) setMortalities(JSON.parse(savedMortalities));
    if (savedFeedMedicines) setFeedMedicines(JSON.parse(savedFeedMedicines));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('chickArrivals', JSON.stringify(chickArrivals));
  }, [chickArrivals]);

  useEffect(() => {
    localStorage.setItem('mortalities', JSON.stringify(mortalities));
  }, [mortalities]);

  useEffect(() => {
    localStorage.setItem('feedMedicines', JSON.stringify(feedMedicines));
  }, [feedMedicines]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  // Calculate stats whenever data changes
  useEffect(() => {
    const totalChicks = chickArrivals.reduce((sum, arrival) => sum + arrival.quantity, 0);
    const totalMortality = mortalities.reduce((sum, mortality) => sum + mortality.quantity, 0);
    const totalSalesQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const currentStock = totalChicks - totalMortality - totalSalesQuantity;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amountReceived, 0);
    const totalOutstanding = sales.reduce((sum, sale) => sum + sale.outstandingBalance, 0);
    const totalFeedCost = feedMedicines.filter(item => item.type === 'feed').reduce((sum, item) => sum + item.cost, 0);
    const totalMedicineCost = feedMedicines.filter(item => item.type === 'medicine').reduce((sum, item) => sum + item.cost, 0);
    const mortalityRate = totalChicks > 0 ? (totalMortality / totalChicks) * 100 : 0;

    setStats({
      totalChicks,
      totalMortality,
      currentStock,
      totalSales: totalSalesQuantity,
      totalRevenue,
      totalOutstanding,
      totalFeedCost,
      totalMedicineCost,
      mortalityRate,
    });
  }, [chickArrivals, mortalities, feedMedicines, sales]);

  // CRUD operations
  const addChickArrival = (arrival: Omit<ChickArrival, 'id' | 'createdAt'>) => {
    const newArrival: ChickArrival = {
      ...arrival,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setChickArrivals(prev => [...prev, newArrival]);
  };

  const addMortality = (mortality: Omit<Mortality, 'id' | 'createdAt'>) => {
    const newMortality: Mortality = {
      ...mortality,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setMortalities(prev => [...prev, newMortality]);
  };

  const addFeedMedicine = (feedMedicine: Omit<FeedMedicine, 'id' | 'createdAt'>) => {
    const newFeedMedicine: FeedMedicine = {
      ...feedMedicine,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setFeedMedicines(prev => [...prev, newFeedMedicine]);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const outstandingBalance = sale.totalAmount - sale.amountReceived;
    const newSale: Sale = {
      ...sale,
      outstandingBalance,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
  };

  const updateChickArrival = (id: string, updates: Partial<ChickArrival>) => {
    setChickArrivals(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateMortality = (id: string, updates: Partial<Mortality>) => {
    setMortalities(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateFeedMedicine = (id: string, updates: Partial<FeedMedicine>) => {
    setFeedMedicines(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateSale = (id: string, updates: Partial<Sale>) => {
    setSales(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.outstandingBalance = updated.totalAmount - updated.amountReceived;
        return updated;
      }
      return item;
    }));
  };

  const deleteChickArrival = (id: string) => {
    setChickArrivals(prev => prev.filter(item => item.id !== id));
  };

  const deleteMortality = (id: string) => {
    setMortalities(prev => prev.filter(item => item.id !== id));
  };

  const deleteFeedMedicine = (id: string) => {
    setFeedMedicines(prev => prev.filter(item => item.id !== id));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DataContext.Provider value={{
      chickArrivals,
      mortalities,
      feedMedicines,
      sales,
      stats,
      addChickArrival,
      addMortality,
      addFeedMedicine,
      addSale,
      updateChickArrival,
      updateMortality,
      updateFeedMedicine,
      updateSale,
      deleteChickArrival,
      deleteMortality,
      deleteFeedMedicine,
      deleteSale,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};