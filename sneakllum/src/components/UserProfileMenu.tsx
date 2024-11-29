import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

const UserProfileMenu = () => {
  const { user, logout } = useUser(); // Récupère les informations utilisateur et la fonction logout
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Gère l'état du menu
  const router = useRouter();

  // Fonction pour afficher/masquer le menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout(); // Appelle la fonction logout du contexte
    router.push("/login"); // Redirige l'utilisateur vers la page de login
  };

  if (!user.name) {
    return null; // Si l'utilisateur n'est pas connecté, rien ne s'affiche
  }

  return (
    <div className="relative">
      <button
        className="text-lg font-semibold"
        onClick={toggleMenu} // Utilisation de toggleMenu pour gérer l'affichage du menu
      >
        {user.name} {/* Affiche le nom de l'utilisateur */}
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
          <div className="p-2">
            <button
              className="block w-full text-left text-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
