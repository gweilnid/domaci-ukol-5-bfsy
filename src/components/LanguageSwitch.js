import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium ml-2"
    >
      {language === 'cs' ? 'EN' : 'CS'}
    </button>
  );
}

export default LanguageSwitch;