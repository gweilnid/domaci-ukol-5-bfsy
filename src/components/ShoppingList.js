import React, { useState } from 'react';
import ShoppingListItem from './ShoppingListItem';
import ShoppingListControls from './ShoppingListControls';
import AddItemForm from './AddItemForm';
import UserManagement from './UserManagement';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

function ShoppingList({ list, updateList, currentUser }) {
  const { isLoading, error } = useAppContext();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [localRemoveLoading, setLocalRemoveLoading] = useState(null); 
  const [localToggleLoading, setLocalToggleLoading] = useState(null); 
  const [hasLeftList, setHasLeftList] = useState(false);  // State to track if a user has left the list

  const isOwner = list && currentUser && list.ownerId === currentUser.id;
  const isMember = list && currentUser && list.users.some(user => user.id === currentUser.id);

  if (isLoading) {
    return <div className="text-lg text-center text-gray-700">{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!list) {
    return <div className="text-gray-500 text-center">{t('couldntLoad')}</div>;
  }

  if (hasLeftList) {
    return <div className="text-red-500 text-center">{t('leftList')}</div>;
  }

  const getFilteredItems = () => {
    switch (filter) {
      case 'unresolved':
        return list.shoppingList.filter(item => !item.purchased);
      case 'resolved':
        return list.shoppingList.filter(item => item.purchased);
      default:
        return list.shoppingList;
    }
  };

  const addItem = async (name) => {
    setIsAddingItem(true);
    try {
      if (name) {
        const newItem = {
          id: `item-${Date.now()}`,
          name,
          purchased: false,
        };
        const updatedList = {
          ...list,
          shoppingList: [...list.shoppingList, newItem],
        };
        await updateList(updatedList);
      }
    } finally {
      setIsAddingItem(false);
    }
  };

  const removeItem = async (itemId) => {
    setLocalRemoveLoading(itemId);
    try {
      const updatedList = {
        ...list,
        shoppingList: list.shoppingList.filter((item) => item.id !== itemId),
      };
      await updateList(updatedList);
    } finally {
      setLocalRemoveLoading(null);
    }
  };

  const togglePurchased = async (itemId) => {
    setLocalToggleLoading(itemId);
    try {
      const updatedList = {
        ...list,
        shoppingList: list.shoppingList.map((item) =>
          item.id === itemId ? { ...item, purchased: !item.purchased } : item
        ),
      };
      await updateList(updatedList);
    } finally {
      setLocalToggleLoading(null);
    }
  };

  const handleAddUser = async (email) => {
    if (email && !list.users.some(user => user.email === email)) {
      const newUser = { id: `user-${Date.now()}`, email, role: 'user' };
      const updatedList = { ...list, users: [...list.users, newUser] };
      updateList(updatedList);
      setInviteEmail('');
    }
  };

  const handleRemoveUser = async(userId) => {
    if (userId === currentUser.id) {
      setHasLeftList(true);
      return;
    }
    const updatedList = {
      ...list,
      users: list.users.filter((user) => user.id !== userId),
    };
    await updateList(updatedList);
  };

  return (
    <div className="p-4 mt-5">
      <div className="mb-4">
        {isEditingTitle && isOwner ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            updateList({ ...list, title: newTitle });
            setIsEditingTitle(false);
          }} className="flex">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 p-2 border input-color rounded"
            />
            <button type="submit" className="ml-2 btn-colorful font-bold py-2 px-4 rounded">
            {t('save')}
            </button>
          </form>
        ) : (
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold app-title">{list.title}</h1>
            {isOwner && (
              <button
                className="btn-colorful font-bold py-2 px-3 mx-4 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {t('edit')}
              </button>
            )}
          </div>
        )}
      </div>

      <AddItemForm addItem={addItem} isLoading={isAddingItem} />
      <ShoppingListControls filter={filter} setFilter={setFilter} />

      {getFilteredItems().map(item => (
        <ShoppingListItem
        key={item.id}
        item={item}
        togglePurchased={togglePurchased}
        removeItem={removeItem}
        canRemoveItems={isOwner || isMember}
        isLoading={
          localToggleLoading === item.id || localRemoveLoading === item.id
        } 
       />
      ))
      }

      {isOwner && (
         <UserManagement
           users={list.users}
           currentUser={currentUser}
           addUser={handleAddUser}
           removeUser={handleRemoveUser}
           inviteEmail={inviteEmail}
           setInviteEmail={setInviteEmail}
           isLoading={isAddingItem}
         />
      )}

      {!isOwner && isMember && (
        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onClick={() => setHasLeftList(true)}>
          {t('leaveList')}
        </button>
      )}
    </div>
  );
}

export default ShoppingList;
