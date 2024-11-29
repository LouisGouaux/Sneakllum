import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

const UserProfileMenu = () => {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Fonction pour afficher/masquer le menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user.name) {
    return null;
  }

  return (
    <div className="relative">
      <button
        className="text-lg font-semibold"
        onClick={toggleMenu}
      >
        {user.name}
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
