import React from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DailyChickPrice, PerChickExpenses } from '../types';
import { Calendar } from 'lucide-react';

const ChickPriceTracker: React.FC = () => {
  const { stats } = useData();
  const { t, language } = useLanguage();
  
  // Calculate total expenses for percentage calculations
  const totalExpenses = stats.totalExpenses;
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(language === 'ur' ? 'ur-PK' : 'en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'ur' ? 'ur-PK' : 'en-PK').format(num);
  };
  
  const getLastUpdatedText = (): string => {
    if (!stats.dailyChickPrices || stats.dailyChickPrices.length === 0) {
      return language === 'ur' ? 'کوئی ڈیٹا دستیاب نہیں' : 'No data available';
    }
    
    const lastDate = stats.dailyChickPrices[stats.dailyChickPrices.length - 1].date;
    return language === 'ur' 
      ? `آخری اپ ڈیٹ: ${lastDate}` 
      : `Last Updated: ${lastDate}`;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}> 
            {t('chickPriceTracker')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {getLastUpdatedText()}
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium text-gray-600 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>{t('currentPricePerChick')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.perChickExpenses)}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ur' 
                  ? `کل مرغیاں: ${formatNumber(stats.totalChicks)} | موجودہ اسٹاک: ${formatNumber(stats.currentStock)}`
                  : `Total Chicks: ${formatNumber(stats.totalChicks)} | Current Stock: ${formatNumber(stats.currentStock)}`
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium text-gray-600 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>{t('totalExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalExpenses)}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ur' 
                  ? `مرغیاں فی قیمت: ${formatCurrency(stats.perChickExpenses)}`
                  : `Per Chick Price: ${formatCurrency(stats.perChickExpenses)}`
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium text-gray-600 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>{t('totalChicks')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.totalChicks)}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ur' 
                  ? `موجودہ اسٹاک: ${formatNumber(stats.currentStock)}`
                  : `Current Stock: ${formatNumber(stats.currentStock)}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('expenseBreakdown')}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>{t('feedCost')}</span>
                <span className="font-medium">{formatCurrency(stats.totalFeedCost)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: totalExpenses > 0 ? `${(stats.totalFeedCost / totalExpenses) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>{t('medicineCost')}</span>
                <span className="font-medium">{formatCurrency(stats.totalMedicineCost)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: totalExpenses > 0 ? `${(stats.totalMedicineCost / totalExpenses) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>{t('extraExpenses')}</span>
                <span className="font-medium">{formatCurrency(stats.totalExpenses - stats.totalFeedCost - stats.totalMedicineCost)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{ width: totalExpenses > 0 ? `${((stats.totalExpenses - stats.totalFeedCost - stats.totalMedicineCost) / totalExpenses) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>{t('mortalityCost')}</span>
                <span className="font-medium">{formatNumber(stats.totalMortality)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: stats.totalChicks > 0 ? `${(stats.totalMortality / stats.totalChicks) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('priceHistory')}
          </h2>
          
          <div className="space-y-4">
            {stats.dailyChickPrices.length > 0 ? (
              stats.dailyChickPrices.slice().reverse().map((dailyPrice: DailyChickPrice, index: number) => {
                const isToday = dailyPrice.date === new Date().toISOString().split('T')[0];
                return (
                  <div key={index} className={`p-3 border rounded-lg ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className={isToday ? 'font-medium text-blue-600' : ''}>
                          {dailyPrice.date}
                        </span>
                      </div>
                      <span className="font-bold">
                        {formatCurrency(dailyPrice.stats.perChickPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{t('feed')}: {formatCurrency(dailyPrice.stats.feedCost)}</span>
                      <span>{t('medicine')}: {formatCurrency(dailyPrice.stats.medicineCost)}</span>
                      <span>{t('extra')}: {formatCurrency(dailyPrice.stats.extraExpenses)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-4">
                {language === 'ur' ? 'کوئی تاریخی ڈیٹا دستیاب نہیں' : 'No historical data available'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
          {t('detailedMetrics')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className={`font-medium mb-2 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
              {t('feedMetrics')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('totalFeedCost')}</span>
                <span className="font-medium">{formatCurrency(stats.totalFeedCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('avgPerChick')}</span>
                <span className="font-medium">
                  {formatCurrency(stats.totalChicks > 0 ? stats.totalFeedCost / stats.totalChicks : 0)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className={`font-medium mb-2 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
              {t('medicineMetrics')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('totalMedicineCost')}</span>
                <span className="font-medium">{formatCurrency(stats.totalMedicineCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('avgPerChick')}</span>
                <span className="font-medium">
                  {formatCurrency(stats.totalChicks > 0 ? stats.totalMedicineCost / stats.totalChicks : 0)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className={`font-medium mb-2 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
              {t('expenseMetrics')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('totalExtraExpenses')}</span>
                <span className="font-medium">{formatCurrency(stats.totalExpenses - stats.totalFeedCost - stats.totalMedicineCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('avgPerChick')}</span>
                <span className="font-medium">
                  {formatCurrency(stats.totalChicks > 0 ? (stats.totalExpenses - stats.totalFeedCost - stats.totalMedicineCost) / stats.totalChicks : 0)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className={`font-medium mb-2 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
              {t('mortalityMetrics')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('totalMortality')}</span>
                <span className="font-medium">{formatNumber(stats.totalMortality)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('mortalityRate')}</span>
                <span className="font-medium">{stats.mortalityRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChickPriceTracker;