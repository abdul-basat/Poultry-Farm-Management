import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useLanguage } from '../hooks/useLanguage';
import { ChickArrival } from '../types';

const ChickArrivals: React.FC = () => {
  const { chickArrivals, addChickArrival, updateChickArrival, deleteChickArrival } = useData();
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingArrival, setEditingArrival] = useState<ChickArrival | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    price: '',
    batchNumber: '',
    source: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: formData.date,
      quantity: parseInt(formData.quantity),
      price: formData.price ? parseFloat(formData.price) : undefined,
      batchNumber: formData.batchNumber,
      source: formData.source || undefined,
    };

    if (editingArrival) {
      updateChickArrival(editingArrival.id, data);
    } else {
      addChickArrival(data);
    }

    setShowModal(false);
    setEditingArrival(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      price: '',
      batchNumber: '',
      source: '',
    });
  };

  const handleEdit = (arrival: ChickArrival) => {
    setEditingArrival(arrival);
    setFormData({
      date: arrival.date,
      quantity: arrival.quantity.toString(),
      price: arrival.price ? arrival.price.toString() : '',
      batchNumber: arrival.batchNumber,
      source: arrival.source || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteChickArrival(id);
    }
  };

  const totalChicks = chickArrivals.reduce((sum, arrival) => sum + arrival.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('chickArrival')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Total Chicks: {totalChicks.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>
            {t('addChickArrival')}
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('date')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('batchNumber')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('price')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('quantity')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('source')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chickArrivals.map((arrival) => (
              <tr key={arrival.id}>
                <td>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {arrival.date}
                  </div>
                </td>
                <td className="font-medium">{arrival.batchNumber}</td>
                <td>{arrival.price && arrival.quantity ? `${language === 'ur' ? 'روپے' : 'PKR'} ${(arrival.price / arrival.quantity).toFixed(2)}` : '-'}</td>
                <td>{arrival.quantity.toLocaleString()}</td>
                <td>{arrival.source || '-'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(arrival)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(arrival.id)}
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
                {editingArrival ? t('edit') : t('addChickArrival')}
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
                    {t('cost')} ({language === 'ur' ? 'روپے' : 'PKR'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('batchNumber')}
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                    {t('source')}
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingArrival(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        quantity: '',
                        batchNumber: '',
                        source: '',
                        price: '',
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

export default ChickArrivals;