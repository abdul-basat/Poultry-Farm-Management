import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/help.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch help content');
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">{t('helpAndSupport')}</h1>
      <div className="card">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {content && (
          <div className="p-4 bg-white rounded-lg shadow">
            {/* Using a simple div to render markdown-like text.
                For a richer experience, a markdown renderer could be used. */}
            <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
