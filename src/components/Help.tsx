import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';
import helpEn from '../help/help_en.md?raw';
import helpUr from '../help/help_ur.md?raw';

const helpContent: { [key: string]: string } = {
  en: helpEn,
  ur: helpUr,
};

const Help: React.FC = () => {
  const { language, t } = useLanguage();
  const content = helpContent[language];

  return (
    <div className="p-0 sm:p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">{t('helpAndSupport')}</h1>
      <div className="card bg-white rounded-lg shadow dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <div className="p-4 sm:p-4">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-xl sm:text-3xl font-bold mb-4 border-b pb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-3 border-b pb-1" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 pl-4" {...props} />,
              li: ({node, ...props}) => <li className="mb-2" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Help;
