import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, User, DollarSign } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sale } from '../types';
import { formatCurrency } from '../utils/format';

const Sales: React.FC = () => {
  const { sales, addSale, updateSale, deleteSale, stats } = useData();
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    quantity: '',
    pricePerUnit: '',
    totalAmount: '',
    amountReceived: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: formData.date,
      customerName: formData.customerName,
      quantity: parseInt(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalAmount: parseFloat(formData.totalAmount),
      amountReceived: parseFloat(formData.amountReceived),
      outstandingBalance: parseFloat(formData.totalAmount) - parseFloat(formData.amountReceived),
    };

    if (editingSale) {
      updateSale(editingSale.id, data);
    } else {
      addSale(data);
    }

    setShowModal(false);
    setEditingSale(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      quantity: '',
      pricePerUnit: '',
      totalAmount: '',
      amountReceived: '',
    });
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      date: sale.date,
      customerName: sale.customerName,
      quantity: sale.quantity.toString(),
      pricePerUnit: sale.pricePerUnit.toString(),
      totalAmount: sale.totalAmount.toString(),
      amountReceived: sale.amountReceived.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteSale(id);
    }
  };

  // Calculate total amount when quantity or price changes
  const handleQuantityOrPriceChange = (field: 'quantity' | 'pricePerUnit', value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    if (newFormData.quantity && newFormData.pricePerUnit) {
      const total = parseFloat(newFormData.quantity) * parseFloat(newFormData.pricePerUnit);
      newFormData.totalAmount = total.toString();
    }
    
    setFormData(newFormData);
  };

  // Group sales by customer
  const customerSummary = sales.reduce((acc, sale) => {
    if (!acc[sale.customerName]) {
      acc[sale.customerName] = {
        totalQuantity: 0,
        totalAmount: 0,
        totalReceived: 0,
        totalOutstanding: 0,
        salesCount: 0,
      };
    }
    
    acc[sale.customerName].totalQuantity += sale.quantity;
    acc[sale.customerName].totalAmount += sale.totalAmount;
    acc[sale.customerName].totalReceived += sale.amountReceived;
    acc[sale.customerName].totalOutstanding += sale.outstandingBalance;
    acc[sale.customerName].salesCount += 1;
    
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('sales')}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Total Sales: {stats.totalSales.toLocaleString()}</span>
            <span>Revenue: {formatCurrency(language, stats.totalRevenue)}</span>
            <span>Outstanding: {formatCurrency(language, stats.totalOutstanding)}</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>
            {t('addSale')}
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(language, stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Amount Received</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(language, stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(language, stats.totalOutstanding)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="card">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
          Customer Summary
        </h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Total Quantity</th>
                <th>Total Amount</th>
                <th>Amount Received</th>
                <th>Outstanding</th>
                <th>Sales Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(customerSummary).map(([customerName, summary]) => (
                <tr key={customerName}>
                  <td className="font-medium">{customerName}</td>
                  <td>{summary.totalQuantity.toLocaleString()}</td>
                  <td>{formatCurrency(language, summary.totalAmount)}</td>
                  <td>{formatCurrency(language, summary.totalReceived)}</td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      summary.totalOutstanding === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {formatCurrency(language, summary.totalOutstanding)}
                    </span>
                  </td>
                  <td>{summary.salesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('date')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('customerName')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('quantity')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('pricePerUnit')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('totalAmount')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('amountReceived')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('outstandingBalance')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {sale.date}
                  </div>
                </td>
                <td className="font-medium">{sale.customerName}</td>
                <td>{sale.quantity.toLocaleString()}</td>
                <td>{formatCurrency(language, sale.pricePerUnit)}</td>
                <td>{formatCurrency(language, sale.totalAmount)}</td>
                <td>{formatCurrency(language, sale.amountReceived)}</td>
                <td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sale.outstandingBalance === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formatCurrency(language, sale.outstandingBalance)}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                {editingSale ? t('edit') : t('addSale')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('customerName')}
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                      {t('quantity')}
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleQuantityOrPriceChange('quantity', e.target.value)}
                      className="input-field"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                      {t('pricePerUnit')} ({language === 'ur' ? 'روپے' : 'PKR'})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerUnit}
                      onChange={(e) => handleQuantityOrPriceChange('pricePerUnit', e.target.value)}
                      className="input-field"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('totalAmount')} ({language === 'ur' ? 'روپے' : 'PKR'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('amountReceived')} ({language === 'ur' ? 'روپے' : 'PKR'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amountReceived}
                    onChange={(e) => setFormData({ ...formData, amountReceived: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSale(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        customerName: '',
                        quantity: '',
                        pricePerUnit: '',
                        totalAmount: '',
                        amountReceived: '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn-primary">
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;