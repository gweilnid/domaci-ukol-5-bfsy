import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ListTile from './ListTile';
import Modal from './Modal';
import { useLanguage } from '../context/LanguageContext';

function ShoppingListsOverview() {
  const {
    shoppingLists,
    currentUser,
    addList,
    deleteList,
    updateList,
    isLoading, 
    error,
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, listId: null });
  const [isDialogLoading, setIsDialogLoading] = useState(false); 
  const [loadingListId, setLoadingListId] = useState(null); 
  const [showSkeleton, setShowSkeleton] = useState(true); 
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Zpoždění pro skeleton při změně `isLoading`
  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000); // Delay pro nacitani aby to bylo jako nacitani z API
      return () => clearTimeout(timer); // Vynluovat pri unmountu
    }
  }, [isLoading]);

  const createShoppingList = async () => {
    setIsDialogLoading(true);
    try {
      if (newListTitle.trim()) {
        const newList = {
          id: `list-${Date.now()}`,
          title: newListTitle,
          shoppingList: [],
          archived: false,
          ownerId: currentUser.id,
          users: [{ id: currentUser.id, email: currentUser.email, role: 'owner' }],
        };
        await addList(newList);
        setNewListTitle('');
        setIsModalOpen(false);
      }
    } finally {
      setIsDialogLoading(false);
    }
  };

  const confirmDeleteList = (listId) => {
    setDeleteConfirmation({ isOpen: true, listId });
  };

  const handleDeleteList = async () => {
    setIsDialogLoading(true);
    try {
      if (deleteConfirmation.listId) {
        setLoadingListId(deleteConfirmation.listId); // Nastaveni nacitani pro konkretni seznam
        await deleteList(deleteConfirmation.listId);
        setDeleteConfirmation({ isOpen: false, listId: null });
      }
    } finally {
      setIsDialogLoading(false);
      setLoadingListId(null); // Ukonceni nacitani pro seznam
    }
  };

  const handleArchiveList = async (list) => {
    setLoadingListId(list.id);
    try {
      await updateList({ ...list, archived: true });
    } finally {
      setLoadingListId(null);
    }
  };

  const handleUnarchiveList = async (list) => {
    setLoadingListId(list.id);
    try {
      await updateList({ ...list, archived: false });
    } finally {
      setLoadingListId(null);
    }
  };

  const activeLists = shoppingLists.filter((list) => !list.archived);
  const archivedLists = shoppingLists.filter((list) => list.archived);

  return (
    <div className="shopping-lists-overview">
      <h1 className ="app-title text-3xl font-bold py-5">{t('shoppingLists')}</h1>

      {/* Chybova zprava */}
      {error && <div className="error-message">{error}</div>}

      {/* Zobrazeni skeletonu pri nacitani nebo obsahu */}
      {showSkeleton ? (
        <div className="loading-container">
          <div className="skeleton-list"></div>
          <div className="skeleton-list"></div>
          <div className="skeleton-list"></div>
        </div>
      ) : (
        <>
        <div className='flex-apart'>
          <div className="filter-controls">
            <button 
              className={`btn ${filter === 'all' ? 'btn-colorful' : ' text-black bg-gray-300 hover:bg-gray-400'}`}
              onClick={() => setFilter('all')}
            >
              {t('all')}
            </button>
            <button
              className={`btn ${filter === 'active' ? 'btn-colorful' : 'text-black bg-gray-300 hover:bg-gray-400'}`}
              onClick={() => setFilter('active')}
            >
              {t('active')}
            </button>
            </div>
            <button className="btn text-white add-card mb-5" onClick={() => setIsModalOpen(true)}>
                  {t('createNewList')}
            </button>
          </div>
          {/* Aktivni seznamy */}
          {(filter === 'all' || filter === 'active') && (
            <div className="active-lists">
              <h2>{t('active')}</h2>
              <div className="lists-container">
                {activeLists.map((list) =>
                  loadingListId === list.id ? (
                    <div key={list.id} className="skeleton-list"></div>
                  ) : (
                    <ListTile
                      key={list.id}
                      list={list}
                      currentUser={currentUser}
                      navigate={navigate}
                      archiveShoppingList={() => handleArchiveList(list)}
                      deleteShoppingList={() => confirmDeleteList(list.id)}
                      unarchiveShoppingList={() => handleUnarchiveList(list)}
                    />
                  )
                )}
                
              </div>
            </div>
          )}

          {/* Archivovane + aktivni seznamy */}
          {filter === 'all' && (
            <div className="archived-lists">
              <h2>{t('archived')}</h2>
              <div className="lists-container">
                {archivedLists.map((list) =>
                  loadingListId === list.id ? (
                    <div key={list.id} className="skeleton-list"></div>
                  ) : (
                    <ListTile
                      key={list.id}
                      list={list}
                      currentUser={currentUser}
                      navigate={navigate}
                      archiveShoppingList={() => handleArchiveList(list)}
                      deleteShoppingList={() => confirmDeleteList(list.id)}
                      unarchiveShoppingList={() => handleUnarchiveList(list)}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal pro vytvoreni seznamu */}
      {isModalOpen && (
        <Modal
          title={t('listTitle')}
          btn1={t('createList')}
          btn2={t('cancel')}
          onClose={() => setIsModalOpen(false)}
          onSave={createShoppingList}
          isLoading={isDialogLoading}
        >
          <input
            className=' modal-input border input-color rounded-lg'
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            maxLength={32}
            placeholder={t('enterTitle')}
          />
        </Modal>
      )}

      {/* Dialog pro potvrzeni smazani */}
      {deleteConfirmation.isOpen && (
        <Modal
          title={t('delete')}
          btn1={t('yes')}
          btn2={t('no')}
          onClose={() => setDeleteConfirmation({ isOpen: false, listId: null })}
          onSave={handleDeleteList}
          isLoading={isDialogLoading}
        >
          <span className='app-title'>{t('confirmDelete')}</span>
        </Modal>
      )}
    </div>
  );
}

export default ShoppingListsOverview;
