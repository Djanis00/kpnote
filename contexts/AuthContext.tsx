import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (newToken) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  };

  useEffect(() => {
    const loadToken = async () => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      setToken(stored);
      setLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
