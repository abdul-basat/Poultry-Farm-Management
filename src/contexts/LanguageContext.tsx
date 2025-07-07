import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    chickArrival: 'Chick Arrival',
    mortality: 'Mortality Log',
    feedMedicine: 'Feed & Medicine',
    sales: 'Sales Management',
    extraExpenses: 'Extra Expenses',
    reports: 'Reports',
    
    
    // Dashboard
    totalChicks: 'Total Chicks',
    currentStock: 'Current Stock',
    totalMortality: 'Total Mortality',
    mortalityRate: 'Mortality Rate',
    totalSales: 'Total Sales',
    totalRevenue: 'Total Revenue',
    outstandingAmount: 'Outstanding Amount',
    feedCost: 'Feed Cost',
    medicineCost: 'Medicine Cost',
    
    // Common
    date: 'Date',
    quantity: 'Quantity',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    total: 'Total',
    
    // Chick Arrival
    batchNumber: 'Batch Number',
    source: 'Source',
    addChickArrival: 'Add Chick Arrival',
    
    // Mortality
    notes: 'Notes',
    causeOfDeath: 'Cause of Death',
    addMortality: 'Add Mortality Record',
    
    // Feed & Medicine
    type: 'Type',
    feed: 'Feed',
    medicine: 'Medicine',
    name: 'Name',
    cost: 'Cost',
    supplier: 'Supplier',
    addFeedMedicine: 'Add Feed/Medicine Record',
    
    // Sales
    customerName: 'Customer Name',
    pricePerUnit: 'Price per Unit',
    totalAmount: 'Total Amount',
    amountReceived: 'Amount Received',
    outstandingBalance: 'Outstanding Balance',
    addSale: 'Add Sale Record',
    
    // Actions
    viewDetails: 'View Details',
    downloadPDF: 'Download PDF',
    generateReport: 'Generate Report',
    totalExpenses: 'Total Expenses',
    perChickExpenses: 'Per Chick Expenses',
  },
  ur: {
    // Navigation
    dashboard: 'ڈیش بورڈ',
    chickArrival: 'چوزوں کی آمد',
    mortality: 'چوزوں کا مرنا',
    feedMedicine: 'فیڈ اور دوائی',
    sales: 'چوزوں کا بکنا',
    reports: 'رپورٹس',
    extraExpenses: 'اضافی اخراجات',
    
    // Dashboard
    totalChicks: 'کل چوزے',
    currentStock: 'موجودہ اسٹاک',
    totalMortality: 'کل اموات',
    mortalityRate: 'اموات کی شرح',
    totalSales: 'کل فروخت',
    totalRevenue: 'کل آمدنی',
    outstandingAmount: 'باقی رقم',
    feedCost: 'فیڈ کی لاگت',
    medicineCost: 'دوائی کی لاگت',
    
    // Common
    date: 'تاریخ',
    quantity: 'تعداد',
    add: 'شامل کریں',
    edit: 'تبدیل کریں',
    delete: 'ڈیلیٹ کریں',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    search: 'تلاش کریں',
    filter: 'فلٹر کریں',
    export: 'ایکسپورٹ کریں',
    total: 'کل',
    
    // Chick Arrival
    batchNumber: 'بیچ نمبر',
    source: 'ذریعہ',
    addChickArrival: 'چوزوں کی آمد شامل کریں',
    
    // Mortality
    notes: 'نوٹس',
    causeOfDeath: 'موت کی وجہ',
    addMortality: 'اموات کا ریکارڈ شامل کریں',
    
    // Feed & Medicine
    type: 'قسم',
    feed: 'فیڈ',
    medicine: 'دوائی',
    name: 'نام',
    cost: 'قیمت',
    supplier: 'سپلائر',
    addFeedMedicine: 'فیڈ/دوائی کا ریکارڈ شامل کریں',
    
    // Sales
    customerName: 'گاہک کا نام',
    pricePerUnit: 'فی یونٹ قیمت',
    totalAmount: 'کل رقم',
    amountReceived: 'وصول شدہ رقم',
    outstandingBalance: 'باقی رقم',
    addSale: 'فروخت کا ریکارڈ شامل کریں',
    
    // Actions
    viewDetails: 'تفصیلات دیکھیں',
    downloadPDF: 'پی ڈی ایف ڈاؤن لوڈ کریں',
    generateReport: 'رپورٹ بنائیں',
    totalExpenses: 'کل اخراجات',
    perChickExpenses: 'فی چوزہ خرچ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};