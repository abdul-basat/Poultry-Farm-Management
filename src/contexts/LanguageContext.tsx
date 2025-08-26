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
    chickPriceTracker: 'Chick Price Tracker',
    
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
    price: 'Price',
    
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
    
    // Extra Expenses
    description: 'Description',
    amount: 'Amount',
    actions: 'Actions',
    addExtraExpense: 'Add Extra Expense',
    totalExtraExpenses: 'Total Extra Expenses',
    currencyPKR: 'PKR',
    records: 'records',
    noRecordsFound: 'No records found',
    editExpense: 'Edit Expense',
    addNewExpense: 'Add New Expense',
    update: 'Update',
    save: 'Save',
    cancel: 'Cancel',
    deleteExpenseConfirmation: 'Are you sure you want to delete this expense?',
    
    // Actions
    viewDetails: 'View Details',
    downloadPDF: 'Download PDF',
    generateReport: 'Generate Report',
    totalExpenses: 'Total Expenses',
    perChickExpenses: 'Per Chick Expenses',
    
    // Chick Price Tracker
    currentPricePerChick: 'Current Price Per Chick',
    expenseBreakdown: 'Expense Breakdown',
    priceHistory: 'Price History',
    detailedMetrics: 'Detailed Metrics',
    feedMetrics: 'Feed Metrics',
    medicineMetrics: 'Medicine Metrics',
    expenseMetrics: 'Expense Metrics',
    mortalityMetrics: 'Mortality Metrics',
    totalFeedCost: 'Total Feed Cost',
    totalMedicineCost: 'Total Medicine Cost',
    avgPerChick: 'Average Per Chick',
    extra: 'Extra',
    noDataAvailable: 'No data available',
    lastUpdated: 'Last Updated',
    noHistoricalDataAvailable: 'No historical data available',
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
    chickPriceTracker: 'چوزہ قیمت ٹریکر',
    
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
    price: 'قیمت',
    
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
    
    // Extra Expenses
    description: 'تفصیل',
    amount: 'رقم',
    actions: 'اقدامات',
    addExtraExpense: 'اضافی اخراجات شامل کریں',
    totalExtraExpenses: 'کل اضافی اخراجات',
    currencyPKR: 'روپے',
    records: 'ریکارڈز',
    noRecordsFound: 'ریکارڈ موجود نہیں',
    editExpense: 'اخراجات ترمیم کریں',
    addNewExpense: 'نیا اخراجات شامل کریں',
    update: 'اپ ڈیٹ کریں',
    save: 'محفوظ کریں',
    deleteExpenseConfirmation: 'کیا آپ واقعی اس اخراجات کو حذف کرنا چاہتے ہیں؟',
    
    // Actions
    viewDetails: 'تفصیلات دیکھیں',
    downloadPDF: 'پی ڈی ایف ڈاؤن لوڈ کریں',
    generateReport: 'رپورٹ بنائیں',
    totalExpenses: 'کل اخراجات',
    perChickExpenses: 'فی چوزہ خرچ',
    
    // Chick Price Tracker
    currentPricePerChick: 'فی چوزہ موجودہ قیمت',
    expenseBreakdown: 'اخراجات کی تقسیم',
    priceHistory: 'قیمت کی تاریخ',
    detailedMetrics: 'تفصیلی اعداد و شمار',
    feedMetrics: 'فیڈ کے اعداد و شمار',
    medicineMetrics: 'دوائی کے اعداد و شمار',
    expenseMetrics: 'اخراجات کے اعداد و شمار',
    mortalityMetrics: 'اموات کے اعداد و شمار',
    totalFeedCost: 'کل فیڈ کی لاگت',
    totalMedicineCost: 'کل دوائی کی لاگت',
    avgPerChick: 'فی چوزہ اوسط',
    extra: 'اضافی',
    noDataAvailable: 'کوئی ڈیٹا دستیاب نہیں',
    lastUpdated: 'آخری اپ ڈیٹ',
    noHistoricalDataAvailable: 'کوئی تاریخی ڈیٹا دستیاب نہیں',
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