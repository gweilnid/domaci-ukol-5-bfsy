import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  mockFetchLists,
  mockCreateList,
  mockUpdateList,
  mockDeleteList,
} from './mockApi';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const API_BASE_URL = 'https://api.shoppinglist.com/lists';

// Nastaveni na moc nebo API, false === API, prepinani useru na radku 19
const DEFAULT_USE_MOCK = true;

export const AppProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [currentUser] = useState({ id: 'user2' }); // Tady prepinat usery
  const [useMockData] = useState(DEFAULT_USE_MOCK);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false); // Globalni state nacitani
  const [loadingItems] = useState([]); // Lokalni state nacitani
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Reset chyby
  const resetError = () => setError(null);

  // Nacteni seznamu
  const fetchLists = useCallback(async () => {
    setIsLoadingGlobal(true);
    resetError();
    try {
      const data = useMockData
        ? await mockFetchLists()
        : await fetch(API_BASE_URL).then((res) => {
            if (!res.ok) throw new Error('Chyba při načítání dat z API');
            return res.json();
          });

      // Filtrovani seznamu podle uzivatelu
      const filteredLists = data.filter((list) =>
        list.users.some((user) => user.id === currentUser.id)
      );

      setShoppingLists(filteredLists);
    } catch (err) {
      setError('Nepodařilo se načíst seznamy. Zkuste to znovu.');
    } finally {
      setIsLoadingGlobal(false);
    }
  }, [useMockData, currentUser.id]);

  // Přepínač témat
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };


  // Pridani seznamu
  const addList = async (newList) => {
    setIsLoadingGlobal(true);
    resetError();
    try {
      const createdList = useMockData
        ? await mockCreateList(newList)
        : await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newList),
          }).then((res) => {
            if (!res.ok) throw new Error('Chyba při přidávání seznamu do API');
            return res.json();
          });
      setShoppingLists((prev) => [...prev, createdList]);
    } catch (err) {
      setError('Nepodařilo se přidat nový seznam.');
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  // Aktualizace seznamu
  const updateList = async (updatedList) => {
    setIsLoadingGlobal(true);
    resetError();
    try {
      const newList = useMockData
        ? await mockUpdateList(updatedList)
        : await fetch(`${API_BASE_URL}/${updatedList.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList),
          }).then((res) => {
            if (!res.ok) throw new Error('Chyba při aktualizaci seznamu na serveru');
            return res.json();
          });
      setShoppingLists((prev) =>
        prev.map((list) => (list.id === updatedList.id ? newList : list))
      );
    } catch (err) {
      setError('Nepodařilo se aktualizovat seznam.');
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  // Smazani seznamu
  const deleteList = async (listId) => {
    setIsLoadingGlobal(true);
    resetError();
    try {
      const deleted = useMockData
        ? await mockDeleteList(listId)
        : await fetch(`${API_BASE_URL}/${listId}`, { method: 'DELETE' }).then((res) => {
            if (!res.ok) throw new Error('Chyba při mazání seznamu na serveru');
            return res.json();
          });
      setShoppingLists((prev) => prev.filter((list) => list.id !== deleted.id));
    } catch (err) {
      setError('Nepodařilo se smazat seznam.');
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  // Nacitani seznamu pri mountu
  useEffect(() => {
    fetchLists();
  }, [fetchLists, useMockData]);

  return (
    <AppContext.Provider
      value={{
        shoppingLists,
        currentUser,
        addList,
        updateList,
        deleteList,
        isLoadingGlobal,
        loadingItems,
        error,
        resetError,
        useMockData,
        theme, 
        toggleTheme 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
