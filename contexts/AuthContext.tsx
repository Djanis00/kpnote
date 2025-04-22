import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      if (storedToken) {
        setToken(storedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
