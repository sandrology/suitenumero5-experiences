
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_CREDENTIALS } from '../config/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Check localStorage for login status on initial load with a more reliable key
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('adminSessionActive');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      // Store login state in localStorage with a more descriptive key
      localStorage.setItem('adminSessionActive', 'true');
      // Set a cookie as additional persistence method
      document.cookie = "adminLoggedIn=true; path=/; max-age=31536000"; // 1 year expiration
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminSessionActive');
    // Clear the cookie on logout
    document.cookie = "adminLoggedIn=; path=/; max-age=0";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
