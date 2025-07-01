import React from 'react';
import { FaFacebookF, FaWhatsapp, FaLinkedinIn, FaGlobe, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">Developed by: Abdul Basit</h2>
        <div className="flex gap-6 text-xl">
          <a href="https://web.facebook.com/abasit.dev" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FaFacebookF /></a>
          <a href="https://wa.me/+923347232542" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FaWhatsapp /></a>
          <a href="https://linkedin.com/in/abdulbasat" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FaLinkedinIn /></a>
          <a href="https://sprinthon.com" target="_blank" rel="noopener noreferrer" aria-label="Website" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FaGlobe /></a>
          <a href="mailto:absit.dev@gmail.com" aria-label="Email" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FaEnvelope /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 