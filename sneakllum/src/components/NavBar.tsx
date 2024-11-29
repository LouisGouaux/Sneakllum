"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineSearch, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { useUser } from "../context/UserContext";
import UserProfileMenu from "../components/UserProfileMenu"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

    useEffect(() => {
    setIsMenuOpen(false); // Fermer le menu dès qu'il y a un changement dans user (connexion/déconnexion)
  }, [user]); // Cela sera déclenché chaque fois que l'utilisateur change

  return (
    <header className="bg-white text-black shadow p-4">
      <nav className="container mx-auto flex justify-between items-center">
        
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Sneakllum</h1>
        </Link>
        
        <button
          className="lg:hidden block text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span>☰</span>
        </button>

        <ul
          className={`lg:flex space-x-6 flex-1 justify-center ${
            isMenuOpen ? 'flex' : 'hidden'
          }`}
        >
          <li>
            <Link
              href="/search/new"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Nouveau en ce moment
            </Link>
          </li>
          <li>
            <Link
              href="/search/man"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Homme
            </Link>
          </li> 
          <li>
            <Link
              href="/search/woman"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Femme
            </Link>
          </li>
          <li>
            <Link
              href="/search/child"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Enfant
            </Link>
          </li>
          <li>
            <Link
              href="/search/offers"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Offres
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4 mr-4">
          <div className="relative w-64">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="pl-10 pr-4 py-2 w-full border rounded-full focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <Link href="/cart" className="hover:text-black transition-all">
            <AiOutlineShoppingCart className="text-2xl" />
          </Link>

          {user && user.name ? ( // Vérifie si l'utilisateur est connecté
            <UserProfileMenu /> // Affiche le composant UserProfileMenu pour gérer la déconnexion
          ) : (
            <Link href="/login" className="hover:text-black transition-all">
              <AiOutlineUser className="text-2xl" /> {/* Icône de profil */}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
