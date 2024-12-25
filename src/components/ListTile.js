import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../context/LanguageContext';

function ListTile({
  list,
  currentUser,
  navigate,
  archiveShoppingList,
  deleteShoppingList,
  unarchiveShoppingList,
}) {
  const isOwner = list.ownerId === currentUser.id;
  const isMember = list.users.some((user) => user.id === currentUser.id);
  const { t } = useLanguage();
  
  return (
    <div className="tile shadow-md rounded-lg p-4 mb-4 cursor-pointer h-[175px] box-border" onClick={() => navigate(`/lists/${list.id}`)}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-start w-full">
          <h2 className="text-xl font-semibold break-all">{list.title}</h2>
          <div className="flex items-center">
            {!list.archived && (
              <button
                className="p-2 archive-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  archiveShoppingList(list.id);
                }}
                title={t('archive')}
              >
                <FontAwesomeIcon icon={faArchive} size="lg" />
              </button>
            )}
            {list.archived && (
              <button
                className="p-2 text-blue-500 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  unarchiveShoppingList(list.id);
                }}
                title={t('unarchive')}
              >
                <FontAwesomeIcon icon={faArchive} size="lg" />
              </button>
            )}
            {!isOwner && isMember && (
              <button
                className="p-2 text-green-500 hover:text-green-700 cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title={t('youAreMember')}
              >
                <FontAwesomeIcon icon={faUsers} size="lg" />
              </button>
            )}
            {isOwner && (
              <button
                className="p-2 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteShoppingList(list.id);
                }}
                title={t('delete')}
              >
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-auto">
          <p className="tile-content font-bold">{list.shoppingList.length} {t('items')}</p>
          {list.archived && <p className="tile-content italic">({t('archived')})</p>}
        </div>
      </div>
    </div>
  );
}

export default ListTile;
