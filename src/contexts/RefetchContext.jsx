import React, { createContext, useContext, useState } from 'react';

const RefetchContext = createContext();

export const useRefetchContext = () => useContext(RefetchContext);

export const RefetchProvider = ({ children }) => {
  const [shouldRefetch, setShouldRefetch] = useState(false);

  return (
    <RefetchContext.Provider value={{ shouldRefetch, setShouldRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};