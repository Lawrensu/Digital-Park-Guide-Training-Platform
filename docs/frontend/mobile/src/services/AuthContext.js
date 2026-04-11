// src/services/AuthContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS } from '../data/seedData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Authenticate user — tries API first, falls back to mock data for offline.
   */
  const login = useCallback(async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      // Try API first
      const response = await apiService.login(email, password, role);
      setUser(response.user);
      setLoading(false);
      return { success: true, role: response.user.role };
    } catch (apiErr) {
      // Offline fallback — check against local mock data
      console.log('API unavailable, using offline auth');
      const found = MOCK_USERS.find(
        (u) => u.email === email && u.password === password && u.role === role
      );
      if (found) {
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        setLoading(false);
        return { success: true, role: safeUser.role };
      }
      setError('Invalid credentials. Check email, password, and role.');
      setLoading(false);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ─── Simple API service ─────────────────────────────────────────────
const API_BASE = 'http://172.20.10.4:3000/api';

const apiService = {
  login: async (email, password, role) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
};
