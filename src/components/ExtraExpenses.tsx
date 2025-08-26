import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { ExtraExpense } from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ExtraExpenses: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    extraExpenses,
    addExtraExpense,
    updateExtraExpense,
    deleteExtraExpense,
  } = useData();

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateExtraExpense(editId, {
        date: form.date,
        description: form.description,
        amount: parseFloat(form.amount),
      });
      setEditId(null);
    } else {
      addExtraExpense({
        date: form.date,
        description: form.description,
        amount: parseFloat(form.amount),
      });
    }
    setShowForm(false);
    setForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
    });
  };

  const handleEdit = (exp: ExtraExpense) => {
    setForm({
      date: exp.date,
      description: exp.description,
      amount: exp.amount.toString(),
    });
    setEditId(exp.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteExpenseConfirmation'))) {
      deleteExtraExpense(id);
    }
  };

  const total = extraExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>{t('extraExpenses')}</h1>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: '' });
          }}
          className="btn-primary flex items-center gap-2"
        >
          + <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('addExtraExpense')}</span>
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium text-gray-600 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>{t('totalExtraExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()} {language === 'ur' ? t('currencyPKR') : t('currencyPKR')}</p>
              <p className="text-xs text-gray-500">{extraExpenses.length} {language === 'ur' ? t('records') : t('records')}</p>
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
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('description')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('amount')}</th>
              <th className={language === 'ur' ? 'urdu-text' : 'english-text'}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {extraExpenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">{t('noRecordsFound')}</td>
              </tr>
            ) : (
              extraExpenses.map(exp => (
                <tr key={exp.id} className="border-b last:border-b-0">
                  <td>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {exp.date}
                    </div>
                  </td>
                  <td>{exp.description}</td>
                  <td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {exp.amount.toLocaleString()} {t('currencyPKR')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(exp)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal/Inline */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
                {editId ? t('editExpense') : t('addNewExpense')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`} htmlFor="date">
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`} htmlFor="description">
                    {t('description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input-field"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ur' ? 'urdu-text' : 'english-text'}`} htmlFor="amount">
                    {t('amount')}
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-success flex-1">{editId ? t('update') : t('save')}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtraExpenses;