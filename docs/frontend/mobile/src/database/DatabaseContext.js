// src/database/DatabaseContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // No native DB needed — using AsyncStorage + mock data
    setDbReady(true);
  }, []);

  return (
    <DatabaseContext.Provider value={{ dbReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);