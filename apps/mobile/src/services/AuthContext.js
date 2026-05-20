import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAccessToken, clearAccessToken, setLogoutCallback, tokenStorage } from './api';
import { API_BASE } from '../config';
import { registerForPushNotifications } from './notificationService';
import { clearAllCache } from '../database/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const logout = useCallback(async () => {
		try { await api.post('/auth/logout', {}); } catch {}
		try { await clearAllCache(); } catch {} // wipe SQLite: own try/catch so logout always completes
		clearAccessToken();
		await tokenStorage.clearRefresh();
		await tokenStorage.clearUser();
		setUser(null);
	}, []);

	useEffect(() => {
		setLogoutCallback(logout);
	}, [logout]);

	useEffect(() => {
		const init = async () => {
			try {
				const refreshToken = await tokenStorage.loadRefresh();
				if (!refreshToken) return;

				const res = await fetch(`${API_BASE}/auth/refresh`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refreshToken }),
				});

				if (!res.ok) {
					await tokenStorage.clearRefresh();
					await tokenStorage.clearUser();
					return;
				}

				const json = await res.json();
				setAccessToken(json.data.accessToken);

				const savedUser = await tokenStorage.loadUser();
				if (savedUser) setUser(savedUser);
			} catch {
				// Network unavailable — preserve tokens, user must log in when online
			} finally {
				setLoading(false);
			}
		};
		init();
	}, []);

	const login = useCallback(async (email, password) => {
		const res = await fetch(`${API_BASE}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		const json = await res.json();

		if (!json.success) {
			const err = new Error(json.error?.message || 'Login failed');
			err.code = json.error?.code;
			throw err;
		}

		const { accessToken, refreshToken, user: userData } = json.data;
		setAccessToken(accessToken);
		await tokenStorage.saveRefresh(refreshToken);
		await tokenStorage.saveUser(userData);
		setUser(userData);
		registerForPushNotifications().catch(() => {});
		return userData;
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
