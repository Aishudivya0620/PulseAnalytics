import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  const login = (email, password) => {
    // Simple mock logic: if both fields have value, login
    if (email && password) {
      localStorage.setItem('isAuth', 'true');
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuth');
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
