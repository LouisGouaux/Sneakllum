"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface UserContextType {
  user: { name: string | null; email: string | null; isAdmin: boolean };
  token: string | null;
  login: (userData: { name: string; email: string; isAdmin: boolean }, token: string) => void;
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
  const [user, setUser] = useState<{ name: string | null; email: string | null; isAdmin: boolean }>({
    name: null,
    email: null,
    isAdmin: false,
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser });
      setToken(storedToken);
    }
  }, []);

  const login = (
      userData: { name: string; email: string; isAdmin: boolean },
      userToken: string
  ) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser({ name: null, email: null, isAdmin: false });
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
      <UserContext.Provider value={{ user, token, login, logout }}>
        {children}
      </UserContext.Provider>
  );
};
