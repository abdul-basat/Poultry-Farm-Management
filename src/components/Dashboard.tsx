import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Users,
  Activity,
  ShoppingCart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { format, subDays, startOfDay } from 'date-fns';
import { formatCurrency } from '../utils/format';

const Dashboard: React.FC = () => {
  const { stats, mortalities, sales, feedMedicines } = useData();
  const { t, language } = useLanguage();

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayMortality = mortalities
      .filter(m => m.date === dateStr)
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const daySales = sales
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.quantity, 0);

    return {
      date: format(date, 'MMM dd'),
      mortality: dayMortality,
      sales: daySales,
    };
  });

  const expenseData = [
    { name: t('feed'), value: stats.totalFeedCost, color: '#f59e0b' },
    { name: t('medicine'), value: stats.totalMedicineCost, color: '#ef4444' },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: number;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="stats-card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className={`text-sm font-medium text-gray-600 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('totalChicks')}
          value={stats.totalChicks.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title={t('currentStock')}
          value={stats.currentStock.toLocaleString()}
          icon={Package}
          color="bg-green-500"
        />
        <StatCard
          title={t('totalMortality')}
          value={stats.totalMortality.toLocaleString()}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title={t('mortalityRate')}
          value={`${stats.mortalityRate.toFixed(1)}%`}
          icon={Activity}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('totalSales')}
          value={stats.totalSales.toLocaleString()}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(language, stats.totalRevenue)}
          icon={DollarSign}
          color="bg-indigo-500"
        />
        <StatCard
          title={t('outstandingAmount')}
          value={formatCurrency(language, stats.totalOutstanding)}
          icon={AlertTriangle}
          color="bg-yellow-500"
        />
        <StatCard
          title={t('feedCost')}
          value={formatCurrency(language, stats.totalFeedCost)}
          icon={ShoppingCart}
          color="bg-teal-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="card">
          <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            Daily Activity (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mortality" fill="#ef4444" name="Mortality" />
              <Bar dataKey="sales" fill="#22c55e" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="card">
          <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(language, value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {mortalities.slice(-3).reverse().map((mortality) => (
            <div key={mortality.id} className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {mortality.quantity} chicks died on {mortality.date}
                </p>
                {mortality.notes && (
                  <p className="text-xs text-gray-600">{mortality.notes}</p>
                )}
              </div>
            </div>
          ))}
          
          {sales.slice(-3).reverse().map((sale) => (
            <div key={sale.id} className="flex items-center p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Sold {sale.quantity} chicks to {sale.customerName}
                </p>
                <p className="text-xs text-gray-600">
                  Amount: {formatCurrency(language, sale.totalAmount)} | Received: {formatCurrency(language, sale.amountReceived)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;