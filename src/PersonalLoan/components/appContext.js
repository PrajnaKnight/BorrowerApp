import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  
  const [language, setLanguage] = useState('en'); // default language

  
  const [fontSize, setFontSize] = useState(1); // default font size

  
  const handleFontSize = () => setFontSize(currentSize => {
    let newSize = currentSize; // Initialize newSize with currentSize
    
    // Update newSize based on currentSize
    if (currentSize === 1) {
      newSize = 3; // Increase font size to 3
    } else if (currentSize === 3) {
      newSize = 5; // Increase font size to 5
    } else {
      newSize = 1; // Reset font size to 1
    }

    return newSize;
  });



  
  const changeLanguage = (lang) => setLanguage(lang);

  return (
    <AppContext.Provider value={{ fontSize,   handleFontSize,  language, changeLanguage }}>
      {children}
    </AppContext.Provider>
  );
};
