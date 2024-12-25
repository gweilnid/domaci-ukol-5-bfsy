import React, { createContext, useContext, useState } from 'react';

const translations = {
  cs: {
    // Obecné
    loading: 'Načítání...',
    error: 'Chyba',
    save: 'Uložit',
    cancel: 'Zrušit',
    edit: 'Upravit',
    delete: 'Smazat',
    archive: 'Archivovat',
    unarchive: 'Obnovit z archivu',
    yes: 'Ano',
    no: 'Ne',
    add: 'Přidat',
    wait: 'Čekejte...',
    // Tile
    youAreMember: 'Jste člen',


    // Nákupní seznamy
    shoppingLists: 'Nákupní seznamy',
    createNewList: 'Vytvořit nový seznam',
    active: 'Aktivní',
    archived: 'Archivované',
    all: 'Všechny',
    listNotFound: 'Seznam nenalezen. Zkuste to znovu.',
    confirmDelete: 'Opravdu chcete smazat tento seznam?',
    listTitle: 'Název seznamu',
    createList: 'Vytvořit',
    enterTitle: 'Zadejte název (max. 32 znaků)',
    couldntLoad: 'Seznam nebyl nalezen nebo se nepodařilo načíst data.',
    // Položky seznamu
    addItem: 'Přidej položku (maximálně 64 znaků)',
    maxChars: 'Název položky může mít maximálně 64 znaků.',
    purchased: 'Zakoupené',
    unpurchased: 'Nezakoupené',
    items: 'položek',
    
    // Uživatelé
    addUser: 'Přidat uživatele',
    addUserEmail: 'Přidat uživatele e-mailem',
    removing: 'Odebírání...',
    remove: 'Odstranit',
    adding: 'Přidávání...',
    leaveList: 'Opustit seznam',
    leftList: 'Opustili jste seznam. Pro opětovné připojení kontaktujte vlastníka.',
    handleUserError: 'Chyba při přidávání uživatele:',
    handleRemoveUserError: 'Chyba při odebírání uživatele:'
  },
  en: {
    // General
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    archive: 'Archive',
    unarchive: 'Restore from archive',
    yes: 'Yes',
    no: 'No',
    add: 'Add',
    wait: 'Wait...',
    // Tile
    youAreMember: 'You are member',

    // Shopping lists
    shoppingLists: 'Shopping Lists',
    createNewList: 'Create new list',
    active: 'Active',
    archived: 'Archived',
    all: 'All',
    listNotFound: 'List not found. Please try again.',
    confirmDelete: 'Are you sure you want to delete this list?',
    listTitle: 'List title',
    createList: 'Create',
    enterTitle: 'Enter title (max. 32 characters)',
    couldntLoad: 'The list was not found or the data could not be retrieved.',
    // List items
    addItem: 'Add item (maximum 64 characters)',
    maxChars: 'The item name can have a maximum of 64 characters.',
    purchased: 'Purchased',
    unpurchased: 'Unpurchased',
    items: 'items',
    
    // Users
    addUser: 'Add user',
    addUserEmail: 'Add user by email',
    removing: 'Removing...',
    remove: 'Remove',
    adding: 'Adding...',
    leaveList: 'Leave list',
    leftList: 'You have left the list. Please contact the owner to join again.',
    handleUserError: 'Error when adding a user:',
    handleRemoveUserError: 'Error when removing a user:',
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'cs');

  const toggleLanguage = () => {
    const newLanguage = language === 'cs' ? 'en' : 'cs';
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  const t = (key, params = []) => {
    let translation = translations[language][key] || key;
    params.forEach((param, index) => {
      translation = translation.replace(`{${index}}`, param);
    });
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};