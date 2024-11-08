"use client";

import { useState } from "react";
import Link from "next/link";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-black shadow p-4 mb-10">
      <nav className="container mx-auto flex justify-between items-center">
        
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">My E-commerce App</h1>
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
              href="/new"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Nouveau en ce moment
            </Link>
          </li>
          <li>
            <Link
              href="/man"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Homme
            </Link>
          </li> 
          <li>
            <Link
              href="/woman"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Femme
            </Link>
          </li>
          <li>
            <Link
              href="/child"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Enfant
            </Link>
          </li>
          <li>
            <Link
              href="/offers"
              className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
            >
              Offres
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Rechercher des produits..."
            className="px-4 py-2 border rounded-full mr-4"
          />
        </div>

        <div className="flex space-x-6">
          <Link href="/cart" className="hover:text-black transition-all">
                <AiOutlineShoppingCart className="text-2xl" />
          </Link>
          <Link href="/profile" className="hover:text-black transition-all">
                <AiOutlineUser className="text-2xl" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
