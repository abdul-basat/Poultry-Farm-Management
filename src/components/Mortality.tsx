import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mortality as MortalityType } from '../types';

const Mortality: React.FC = () => {
  const { mortalities, addMortality, updateMortality, deleteMortality, stats } = useData();
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingMortality, setEditingMortality] = useState<MortalityType | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: formData.date,
      quantity: parseInt(formData.quantity),
      notes: formData.notes || undefined,
    };

    if (editingMortality) {
      updateMortality(editingMortality.id, data);
    } else {
      addMortality(data);
    }

    setShowModal(false);
    setEditingMortality(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      notes: '',
    });
  };

  const handleEdit = (mortality: MortalityType) => {
    setEditingMortality(mortality);
    setFormData({
      date: mortality.date,
      quantity: mortality.quantity.toString(),
      notes: mortality.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMortality(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('mortality')}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Total Mortality: {stats.totalMortality.toLocaleString()}</span>
            <span>Mortality Rate: {stats.mortalityRate.toFixed(1)}%</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>
            {t('addMortality')}
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deaths</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMortality}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mortality Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mortalityRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Survival Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(100 - stats.mortalityRate).toFixed(1)}%</p>
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
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('quantity')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('notes')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mortalities.map((mortality) => (
              <tr key={mortality.id}>
                <td>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {mortality.date}
                  </div>
                </td>
                <td>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {mortality.quantity.toLocaleString()}
                  </span>
                </td>
                <td className="max-w-xs truncate">{mortality.notes || '-'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(mortality)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mortality.id)}
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
                {editingMortality ? t('edit') : t('addMortality')}
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
                    {t('quantity')}
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Cause of death or additional notes..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingMortality(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        quantity: '',
                        notes: '',
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

export default Mortality;