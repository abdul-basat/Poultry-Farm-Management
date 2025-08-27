import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../hooks/useLanguage';
import { helpContent } from '../lib/help-content';
import { Languages } from 'lucide-react';

const Help: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const content = helpContent[language];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          data-testid="language-toggle-button"
        >
          <Languages className="h-4 w-4" />
          <span>{language === 'en' ? 'اردو' : 'English'}</span>
        </button>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Help;
