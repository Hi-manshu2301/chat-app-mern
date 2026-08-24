import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "chat-app-user";
const TOKEN_KEY = "chat-app-token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData, token) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
