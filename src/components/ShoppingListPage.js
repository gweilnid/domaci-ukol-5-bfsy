import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ShoppingList from './ShoppingList';
import { useLanguage } from '../context/LanguageContext';

function ShoppingListPage() {
  const { shoppingLists, updateList, currentUser } = useAppContext();
  const { id } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(true); // Lokalni stav nacteni stranky
  const { t } = useLanguage();

  // Najde seznam
  const list = shoppingLists.find((list) => list.id === id);

  useEffect(() => {
    // Pokud seznam existuje, bere stranky jako nactenou
    if (list) {
      setIsPageLoading(false);
    }
  }, [list]);

  if (isPageLoading) {
    // Pri prvni nacteni zobrazi skeleton
    return (
      <div className="loading-container">
        <div className="skeleton-list"></div>
        <div className="skeleton-list"></div>
        <div className="skeleton-list"></div>
      </div>
    );
  }

  if (!list) {
    return <h2>{t('listNotFound')}</h2>;
  }

  return <ShoppingList list={list} updateList={updateList} currentUser={currentUser} />;
}

export default ShoppingListPage;
