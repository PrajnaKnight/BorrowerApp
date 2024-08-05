import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  activeTab: 'Loan Details',
  loanStatus: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_LOAN_STATUS':
      return { ...state, loanStatus: action.payload };
    case 'SET_TAB_AND_STATUS':
      return { ...state, activeTab: action.payload.activeTab, loanStatus: action.payload.loanStatus };
    default:
      return state;
  }
};

const TabContext = createContext();

export const useTab = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TabContext.Provider value={{ state, dispatch }}>
      {children}
    </TabContext.Provider>
  );
};