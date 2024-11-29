"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface UserContextType {
  user: { name: string | null; email: string | null };
  token: string | null;
  login: (userData: { name: string; email: string }, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ name: string | null; email: string | null }>({ name: null, email: null });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("first_name");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser({ name: storedUser, email: "" });
      setToken(storedToken);
    }
  }, []);

  const login = (userData: { name: string; email: string }, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("first_name", userData.name);
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser({ name: null, email: null });
    setToken(null);
    localStorage.removeItem("first_name");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
