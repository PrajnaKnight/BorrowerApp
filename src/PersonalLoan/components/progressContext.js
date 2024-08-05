
import React, { createContext, useContext, useState } from 'react';

const ProgressBarContext = createContext();

export const useProgressBar = () => useContext(ProgressBarContext);

export const ProgressBarProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);

  return (
    <ProgressBarContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressBarContext.Provider>
  );
};
