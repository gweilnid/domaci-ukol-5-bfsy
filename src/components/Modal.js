import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Modal({ title, btn1, btn2, children, onClose, onSave }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();
  
  const handleSave = () => {
    setIsProcessing(true);
    onSave();
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md modal-bg">
        <h2 className="text-lg font-bold app-title">{title}</h2>
        <div className="mt-4 mb-4">
          {children}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className={`py-2 px-4 rounded ${isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold`}
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? t('wait') : btn1}
          </button>
          <button
            className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded text-black font-bold"
            onClick={onClose}
            disabled={isProcessing}
          >
            {btn2}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
