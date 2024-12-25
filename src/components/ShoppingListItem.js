import React from 'react';

function ShoppingListItem({ item, canRemoveItems, togglePurchased, removeItem, isLoading }) {
  return (
    <div className="items-row rounded-lg p-4 flex justify-between items-center mb-2">
      {isLoading ? (
        <div className="animate-pulse flex-1 space-x-4 py-1">
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
          <div className="h-4 bg-gray-400 rounded w-1/4"></div>
        </div>
      ) : (
        <>
          <span className={`flex-grow truncate ${item.purchased ? 'line-through app-title' : 'app-title'}`}>
            {item.name}
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={() => togglePurchased(item.id)}
              className="form-checkbox h-5 w-5 rounded"
            />
            {canRemoveItems && (
              <button
                className="p-1 rounded bg-gray-100 text-white hover:bg-gray-200 disabled:bg-red-300"
                onClick={() => removeItem(item.id)}
                disabled={isLoading}
              >
                🗑️
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingListItem;
