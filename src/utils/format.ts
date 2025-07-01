export const formatCurrency = (language: 'en' | 'ur', amount: number): string => {
  const formatted = amount.toLocaleString();
  return language === 'ur' ? `${formatted} روپے` : `PKR ${formatted}`;
}; 