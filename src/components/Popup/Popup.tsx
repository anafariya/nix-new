import React, { useState, useEffect } from 'react';

const Popup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('nixtour-popup-seen');

    if (!hasSeenPopup) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('nixtour-popup-seen', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-[9999]">
      <div className="relative w-[95vw] h-[95vh] max-w-none max-h-none overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-[10000] bg-black bg-opacity-50 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 shadow-lg text-xl font-bold"
        >
          ×
        </button>
        <img
          src="/popup.jpg"
          alt="Nixtour Promotion"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Popup;