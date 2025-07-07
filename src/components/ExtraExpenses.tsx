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
    if (window.confirm(language === 'ur' ? 'کیا آپ واقعی اس اخراجات کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this expense?')) {
      deleteExtraExpense(id);
    }
  };

  const total = extraExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 {language === 'ur' ? 'urdu-text' : 'english-text'}">{t('extraExpenses')}</h1>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: '' });
          }}
        >
          + {language === 'ur' ? 'اضافی اخراجات شامل کریں' : 'Add Extra Expense'}
        </button>
      </div>
      {/* Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 flex items-center">
          <div className="flex-1">
            <div className="text-blue-700 dark:text-blue-200 font-semibold text-lg">
              {language === 'ur' ? 'کل اضافی اخراجات' : 'Total Extra Expenses'}
            </div>
            <div className="text-2xl font-bold mt-1">
              {total.toLocaleString()} {language === 'ur' ? 'روپے' : 'PKR'}
            </div>
            <div className="text-gray-500 text-sm mt-1">{extraExpenses.length} {language === 'ur' ? 'ریکارڈز' : 'records'}</div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-3 text-left">{language === 'ur' ? 'تاریخ' : 'Date'}</th>
              <th className="px-4 py-3 text-left">{language === 'ur' ? 'تفصیل' : 'Description'}</th>
              <th className="px-4 py-3 text-left">{language === 'ur' ? 'رقم' : 'Amount'}</th>
              <th className="px-4 py-3 text-center">{language === 'ur' ? 'اعمال' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {extraExpenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">{language === 'ur' ? 'کوئی ریکارڈ نہیں' : 'No records found'}</td>
              </tr>
            ) : (
              extraExpenses.map(exp => (
                <tr key={exp.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 whitespace-nowrap"><span role="img" aria-label="calendar">📅</span> {exp.date}</td>
                  <td className="px-4 py-3">{exp.description}</td>
                  <td className="px-4 py-3 font-semibold">{exp.amount.toLocaleString()} {language === 'ur' ? 'روپے' : 'PKR'}</td>
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title={language === 'ur' ? 'ترمیم' : 'Edit'}
                      onClick={() => handleEdit(exp)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title={language === 'ur' ? 'حذف کریں' : 'Delete'}
                      onClick={() => handleDelete(exp.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Form Modal/Inline */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{editId ? (language === 'ur' ? 'اخراجات ترمیم کریں' : 'Edit Expense') : (language === 'ur' ? 'نیا اخراجات شامل کریں' : 'Add New Expense')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="date">{language === 'ur' ? 'تاریخ' : 'Date'}</label>
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
                <label className="block mb-1 font-medium" htmlFor="description">{language === 'ur' ? 'تفصیل' : 'Description'}</label>
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
                <label className="block mb-1 font-medium" htmlFor="amount">{language === 'ur' ? 'رقم' : 'Amount'}</label>
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
                <button type="submit" className="btn-success flex-1">{editId ? (language === 'ur' ? 'اپ ڈیٹ کریں' : 'Update') : (language === 'ur' ? 'محفوظ کریں' : 'Save')}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">{language === 'ur' ? 'منسوخ کریں' : 'Cancel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtraExpenses; 