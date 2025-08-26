import React from 'react';
import { FaFacebookF, FaWhatsapp, FaLinkedinIn, FaGlobe, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-2 text-sm border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <p className="text-xs">© {new Date().getFullYear()} | Developed by Abdul Basit</p>
        <div className="flex gap-3 text-sm">
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