// useAppContext.js
import { useContext } from 'react';
import { AppContext } from '../components/appContext';

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
