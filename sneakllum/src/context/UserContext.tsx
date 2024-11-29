"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Définir le type pour le contexte utilisateur
interface UserContextType {
  user: { name: string | null; email: string | null };
  token: string | null;
  login: (userData: { name: string; email: string }, token: string) => void;
  logout: () => void;
}

// Créer un contexte utilisateur avec des valeurs par défaut
const UserContext = createContext<UserContextType | null>(null);

// Hook pour utiliser le contexte
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Définir le type des enfants du Provider
interface UserProviderProps {
  children: ReactNode;
}

// Créer le provider qui encapsule l'application avec le contexte
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialisation des états avec des types appropriés
  const [user, setUser] = useState<{ name: string | null; email: string | null }>({ name: null, email: null });
  const [token, setToken] = useState<string | null>(null);

  // Initialisation du contexte depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("first_name");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser({ name: storedUser, email: "" }); // Email peut être récupéré plus tard si nécessaire
      setToken(storedToken);
    }
  }, []);

  // Fonction de login
  const login = (userData: { name: string; email: string }, userToken: string) => {
    setUser(userData); // Mise à jour de l'état de l'utilisateur
    setToken(userToken); // Mise à jour du token
    localStorage.setItem("first_name", userData.name); // Sauvegarde du nom d'utilisateur dans le localStorage
    localStorage.setItem("token", userToken); // Sauvegarde du token dans le localStorage
  };

  // Fonction de logout
  const logout = () => {
    setUser({ name: null, email: null }); // Réinitialisation des données utilisateur
    setToken(null); // Réinitialisation du token
    localStorage.removeItem("first_name"); // Suppression du nom d'utilisateur du localStorage
    localStorage.removeItem("token"); // Suppression du token du localStorage
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
