import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase } from './db';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
	const [dbReady, setDbReady] = useState(false);

	useEffect(() => {
		initDatabase()
			.then(() => setDbReady(true))
			.catch(() => setDbReady(true)); // degrade gracefully — app works online without offline support
	}, []);

	return (
		<DatabaseContext.Provider value={{ dbReady }}>
			{children}
		</DatabaseContext.Provider>
	);
};

export const useDatabase = () => useContext(DatabaseContext);
