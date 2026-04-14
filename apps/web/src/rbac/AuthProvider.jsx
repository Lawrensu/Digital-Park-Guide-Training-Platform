import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    
    // Simulate network delay for a more realistic demo
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded credentials for Demo
    // Admin: admin@sfc.com / admin123
    // Guide: guide@sfc.com / guide123
    
    let mockUser = null;

    if (username === 'admin@sfc.com' && password === 'admin123') {
      mockUser = { id: 'admin-1', role: 'ADMIN', name: 'SFC Administrator' };
    } else if (username === 'guide@sfc.com' && password === 'guide123') {
      mockUser = { id: 'guide-1', role: 'GUIDE', name: 'Joey Mok (Guide)' };
    }

    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setLoading(false);
      
      // Redirect based on role
      if (mockUser.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/guidedashboard'); 
      }
      
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, message: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);