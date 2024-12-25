import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function AddItemForm({ addItem }) {
  const { t } = useLanguage();
  const maxNameLength = 64;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements['name'].value.trim();
    
    if (name.length > maxNameLength) {
      alert(t('maxChars'));
      return;
    }

    if (name) {
      addItem(name);
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-between items-center my-4 px-4">
      <input
        type="text"
        name="name"
        placeholder={t('addItem')}
        className="input-color flex-grow mr-4 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
        maxLength={maxNameLength}
      />
      <button
        type="submit"
        className="btn-colorful font-bold py-2 px-4 rounded"
      >
        {t('add')}
      </button>
    </form>
  );
}

export default AddItemForm;
