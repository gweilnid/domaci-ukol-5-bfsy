import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function UserManagement({
  users,
  currentUser,
  addUser,
  removeUser,
  inviteEmail,
  setInviteEmail,
  isLoading: globalLoading, 
}) {
  const [localAddLoading, setLocalAddLoading] = useState(false); 
  const [localRemoveUserLoading, setLocalRemoveUserLoading] = useState(null); 
  const { t } = useLanguage();

  // Identifikace uzivatele
  const isOwner = users.some((user) => user.id === currentUser.id && user.role === 'owner');

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setLocalAddLoading(true);
    try {
      await addUser(inviteEmail);
      setInviteEmail(''); 
    } catch (err) {
      console.error(t('handleUserError'), err);
    } finally {
      setLocalAddLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    setLocalRemoveUserLoading(userId);
    try {
      await removeUser(userId);
    } catch (err) {
      console.error(t('handleRemoveUserError'), err);
    } finally {
      setLocalRemoveUserLoading(null);
    }
  };

  return (
    <div className=" user-management" style={{ marginTop: '20px' }}>
      {isOwner && (
        <>
          {/* Formular pridani clena */}
          <form onSubmit={handleAddUser} className="flex-apart">
            <input
              className="email-input input-color"
              type="email"
              placeholder={t('addUserEmail')}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={localAddLoading || globalLoading} // Deaktivace pri pridavani
            />
            <button
              className="btn-colorful font-bold py-2 px-4 rounded"
              type="submit"
              disabled={localAddLoading || globalLoading}
            >
              {localAddLoading ? t('adding') : t('add')}
            </button>
          </form>
       
      {/* Seznam clenu */}
      <ul>
        {users.map((user) => (
          <li className="app-title items-center"key={user.id}>
            <span className='truncate'>{user.email}</span>
            {user.role !== 'owner' && user.id !== currentUser.id && (
              <button
                className="btn-colorful font-bold rounded"
                onClick={() => handleRemoveUser(user.id)}
                disabled={localRemoveUserLoading === user.id || globalLoading} // Deaktivace pri mazani uzivatele
              >
                {localRemoveUserLoading === user.id ? t('removing') : t('remove')}
              </button>
            )}
          </li>
        ))}
      </ul>
      </>
      )}
    </div>
  );
}

export default UserManagement;
