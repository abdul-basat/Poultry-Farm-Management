import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import helpContent from '/public/help.md?raw';

const Help: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">{t('helpAndSupport')}</h1>
      <div className="card">
        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          {/* Using a simple pre to render markdown-like text.
              For a richer experience, a markdown renderer could be used. */}
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200">{helpContent}</pre>
        </div>
      </div>
    </div>
  );
};

export default Help;
