import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Package, Pill } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useLanguage } from '../hooks/useLanguage';
import { FeedMedicine as FeedMedicineType } from '../types';
import { formatCurrency } from '../utils/format';

const FeedMedicine: React.FC = () => {
  const { feedMedicines, addFeedMedicine, updateFeedMedicine, deleteFeedMedicine, stats } = useData();
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedMedicineType | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'feed' as 'feed' | 'medicine',
    name: '',
    cost: '',
    supplier: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: formData.date,
      type: formData.type,
      name: formData.name,
      cost: parseFloat(formData.cost),
      supplier: formData.supplier || undefined,
    };

    if (editingItem) {
      updateFeedMedicine(editingItem.id, data);
    } else {
      addFeedMedicine(data);
    }

    setShowModal(false);
    setEditingItem(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'feed',
      name: '',
      cost: '',
      supplier: '',
    });
  };

  const handleEdit = (item: FeedMedicineType) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      type: item.type,
      name: item.name,
      cost: item.cost.toString(),
      supplier: item.supplier || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteFeedMedicine(id);
    }
  };

  const feedItems = feedMedicines.filter(item => item.type === 'feed');
  const medicineItems = feedMedicines.filter(item => item.type === 'medicine');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('feedMedicine')}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Feed Cost: {formatCurrency(language, stats.totalFeedCost)}</span>
            <span>Medicine Cost: {formatCurrency(language, stats.totalMedicineCost)}</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>
            {t('addFeedMedicine')}
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feed Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(language, stats.totalFeedCost)}</p>
              <p className="text-xs text-gray-500">{feedItems.length} records</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-500">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Medicine Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(language, stats.totalMedicineCost)}</p>
              <p className="text-xs text-gray-500">{medicineItems.length} records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('date')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('type')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('name')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('cost')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('supplier')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedMedicines.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {item.date}
                  </div>
                </td>
                <td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'feed' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.type === 'feed' ? (
                      <>
                        <Package className="h-3 w-3 mr-1" />
                        {t('feed')}
                      </>
                    ) : (
                      <>
                        <Pill className="h-3 w-3 mr-1" />
                        {t('medicine')}
                      </>
                    )}
                  </span>
                </td>
                <td className="font-medium">{item.name}</td>
                <td>{formatCurrency(language, item.cost)}</td>
                <td>{item.supplier || '-'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
                {editingItem ? t('edit') : t('addFeedMedicine')}
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
                    {t('type')}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'feed' | 'medicine' })}
                    className="input-field"
                    required
                  >
                    <option value="feed">{t('feed')}</option>
                    <option value="medicine">{t('medicine')}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('cost')} ({language === 'ur' ? 'روپے' : 'PKR'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('supplier')}
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        type: 'feed',
                        name: '',
                        cost: '',
                        supplier: '',
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

export default FeedMedicine;