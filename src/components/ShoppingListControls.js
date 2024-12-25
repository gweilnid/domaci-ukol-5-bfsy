import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function ShoppingListControls({ filter, setFilter }) {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center my-4">
      <button
        className={`px-4 py-2 rounded-lg text-white font-bold mr-2 ${filter === 'all' ? 'btn-colorful' : 'bg-gray-400 hover:bg-gray-500'}`}
        onClick={() => setFilter('all')}
      >
        {t('all')}
      </button>

      <button
        className={`px-4 py-2 rounded-lg text-white font-bold mr-2 ${filter === 'unresolved' ? 'btn-colorful' : 'bg-gray-400 hover:bg-gray-500'}`}
        onClick={() => setFilter('unresolved')}
      >
        {t('unpurchased')}
      </button>
      
      <button
        className={`px-4 py-2 rounded-lg text-white font-bold ${filter === 'resolved' ? 'btn-colorful' : 'bg-gray-400 hover:bg-gray-500'}`}
        onClick={() => setFilter('resolved')}
      >
        {t('purchased')}
      </button>
    </div>
  );
}

export default ShoppingListControls;
